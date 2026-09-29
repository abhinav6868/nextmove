import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateScore } from "../lib/pipeline/score";
import { computeSnapshotDiff } from "../lib/pipeline/diff";
import { resolveClaim } from "../lib/pipeline/reliability";

describe("Scoring Model (PRD Section 7)", () => {
  it("calculates opportunity score using base formula and confidence multiplier", () => {
    // base = 0.35*90 + 0.35*80 + 0.30*70 = 31.5 + 28 + 21 = 80.5
    // total = round(80.5 * (0.6 + 0.4*0.8)) = round(80.5 * 0.92) = round(74.06) = 74
    const result = calculateScore({
      timing: 90,
      fit: 80,
      reach: 70,
      confidence: 0.8,
      timingEvidence: "Raised Series B 6 days ago",
    });

    assert.equal(result.timing, 90);
    assert.equal(result.fit, 80);
    assert.equal(result.reach, 70);
    assert.equal(result.confidence, 0.8);
    assert.equal(result.total, 74);
    assert.ok(result.reasoning.includes("Raised Series B 6 days ago"));
  });

  it("clamps sub-scores between 0 and 100", () => {
    const result = calculateScore({
      timing: 150,
      fit: -20,
      reach: 50,
      confidence: 1.5,
    });

    assert.equal(result.timing, 100);
    assert.equal(result.fit, 0);
    assert.equal(result.confidence, 1);
  });
});

describe("Snapshot Diffing (PRD Section 6 & 9)", () => {
  it("detects new funding round between snapshot A and B", () => {
    const prev = {
      latest_round: { round: "Series A", amount: "$5M", date: "2024-01-01" },
    };
    const current = {
      latest_round: { round: "Series B", amount: "$18M", date: "2026-09-20" },
    };

    const diffs = computeSnapshotDiff(prev, current);
    const fundingDiff = diffs.find((d) => d.category === "funding");
    assert.ok(fundingDiff);
    assert.equal(fundingDiff.field, "latest_round");
    assert.ok(fundingDiff.new_value?.toString().includes("Series B"));
  });

  it("detects new open roles opened in snapshot B", () => {
    const prev = {
      open_roles: [{ title: "Backend Engineer", department: "Engineering" }],
    };
    const current = {
      open_roles: [
        { title: "Backend Engineer", department: "Engineering" },
        { title: "Head of Operations", department: "Operations" },
      ],
    };

    const diffs = computeSnapshotDiff(prev, current);
    const hiringDiff = diffs.find((d) => d.category === "hiring");
    assert.ok(hiringDiff);
    assert.ok(hiringDiff.description.includes("Head of Operations"));
  });
});

describe("Reliability & Source Tier Conflict Resolution (PRD Section 8)", () => {
  it("prefers higher tier over lower tier", () => {
    const result = resolveClaim([
      { value: "200 employees", tier: 3, source_url: "https://jobboard.com" },
      { value: "150 employees", tier: 1, source_url: "https://company.com/about" },
    ]);

    assert.ok(result);
    assert.equal(result.value, "150 employees");
    assert.equal(result.tier, 1);
    assert.equal(result.confidence, "high");
    assert.equal(result.alternatives.length, 1);
    assert.equal(result.alternatives[0].status, "lower_tier");
  });

  it("flags conflict when two tier-1/2 sources disagree", () => {
    const result = resolveClaim([
      { value: "500 employees", tier: 2, source_url: "https://news.com/press-release", date: "2026-08-01" },
      { value: "200 employees", tier: 2, source_url: "https://techcrunch.com/article", date: "2026-09-01" },
    ]);

    assert.ok(result);
    assert.equal(result.value, "200 employees"); // Newer date
    assert.equal(result.needs_review, true);
    assert.equal(result.alternatives[0].status, "conflicting");
  });
});
