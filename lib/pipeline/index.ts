import { db } from "../db/client";
import {
  companies,
  snapshots,
  signals,
  people,
  scores,
  outreach,
  runs,
} from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { performResearch, SourcedDocument } from "./research";
import { extractCompanyIntel } from "./extract";
import { computeSnapshotDiff, ExtractedIntel } from "./diff";
import { classifyDiff } from "./classify";
import { calculateScore } from "./score";
import { determinePersonas } from "./people";
import { generateOutreachDraft } from "./outreach";

export interface PipelineStepLog {
  step: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp: string;
  duration_ms?: number;
  details?: string;
}

export interface PipelineResult {
  success: boolean;
  companyId: number;
  runId: number;
  totalScore: number;
  signalsCount: number;
  logs: PipelineStepLog[];
  error?: string;
}

/**
 * Runs the complete Sales Intelligence Pipeline for a single company
 */
export async function runCompanyPipeline(
  companyUrl: string,
  suggestedName?: string
): Promise<PipelineResult> {
  const startTime = Date.now();
  const stepLogs: PipelineStepLog[] = [];

  function logStep(
    step: string,
    status: PipelineStepLog["status"],
    details?: string,
    stepStartTime?: number
  ) {
    const duration = stepStartTime ? Date.now() - stepStartTime : undefined;
    stepLogs.push({
      step,
      status,
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      details,
    });
  }

  // Create initial run record
  const [initialRun] = await db
    .insert(runs)
    .values({
      company_id: null,
      status: "running",
      log: [],
    })
    .returning();
  const runId = initialRun.id;

  try {
    // ----------------------------------------------------
    // STEP 1: Research (Site, About, Careers, News)
    // ----------------------------------------------------
    const s1Start = Date.now();
    logStep("Research", "running", `Crawling domain ${companyUrl}`);
    const docs = await performResearch(companyUrl, suggestedName);
    logStep(
      "Research",
      "completed",
      `Fetched ${docs.length} public documents with source tiers`,
      s1Start
    );

    // ----------------------------------------------------
    // STEP 2: Extract structured intel
    // ----------------------------------------------------
    const s2Start = Date.now();
    logStep("Extraction", "running", "Extracting structured intel and source citations");
    const intel = await extractCompanyIntel(companyUrl, docs, suggestedName);
    logStep(
      "Extraction",
      "completed",
      `Identified ${intel.name} (${intel.stage}, ${intel.size_band})`,
      s2Start
    );

    // ----------------------------------------------------
    // STEP 3: Company DB Record
    // ----------------------------------------------------
    let companyRecord = await db.query.companies.findFirst({
      where: eq(companies.url, companyUrl),
    });

    if (!companyRecord) {
      const [newComp] = await db
        .insert(companies)
        .values({
          name: intel.name,
          url: companyUrl,
          industry: intel.industry,
          size_band: intel.size_band,
          stage: intel.stage,
          location: intel.location,
          description: intel.description,
        })
        .returning();
      companyRecord = newComp;
    } else {
      // Update with latest metadata
      await db
        .update(companies)
        .set({
          name: intel.name,
          stage: intel.stage,
          size_band: intel.size_band,
          description: intel.description,
        })
        .where(eq(companies.id, companyRecord.id));
    }

    const companyId = companyRecord.id;

    // Link run to company
    await db
      .update(runs)
      .set({ company_id: companyId })
      .where(eq(runs.id, runId));

    // ----------------------------------------------------
    // STEP 4: Snapshots & History (Append-only)
    // ----------------------------------------------------
    const s4Start = Date.now();
    logStep("Snapshot", "running", "Querying previous snapshot for diffing");
    const prevSnapshot = await db.query.snapshots.findFirst({
      where: eq(snapshots.company_id, companyId),
      orderBy: desc(snapshots.captured_at),
    });

    const [currentSnapshot] = await db
      .insert(snapshots)
      .values({
        company_id: companyId,
        raw: docs,
        extracted: intel,
        source_map: intel.source_map,
      })
      .returning();
    logStep("Snapshot", "completed", `Snapshot #${currentSnapshot.id} recorded`, s4Start);

    // ----------------------------------------------------
    // STEP 5: Diff & Signal Classification
    // ----------------------------------------------------
    const s5Start = Date.now();
    logStep("Diff & Signals", "running", "Detecting field diffs vs previous snapshot");
    const diffs = computeSnapshotDiff(
      (prevSnapshot?.extracted as ExtractedIntel) || null,
      intel
    );

    let savedSignalsCount = 0;
    let topUrgentSignal: { id: number; description: string; type: string } | null = null;

    for (const diff of diffs) {
      const classified = classifyDiff(diff);
      const [newSignal] = await db
        .insert(signals)
        .values({
          company_id: companyId,
          snapshot_from: prevSnapshot?.id || null,
          snapshot_to: currentSnapshot.id,
          type: classified.type,
          description: classified.description,
          is_meaningful: classified.is_meaningful,
          reason: classified.reason,
          urgency: classified.urgency,
        })
        .returning();

      savedSignalsCount++;
      if (classified.is_meaningful && !topUrgentSignal) {
        topUrgentSignal = {
          id: newSignal.id,
          description: classified.description,
          type: classified.type,
        };
      }
    }
    logStep(
      "Diff & Signals",
      "completed",
      `Detected ${diffs.length} diffs, classified ${savedSignalsCount} signals`,
      s5Start
    );

    // ----------------------------------------------------
    // STEP 6: People & Personas (Task 3)
    // ----------------------------------------------------
    const s6Start = Date.now();
    logStep("People", "running", "Mapping target decision-makers");
    const targetPeople = determinePersonas(
      intel.name,
      companyUrl,
      intel.stage,
      intel.size_band,
      intel.key_people
    );

    // Remove old people records for this company to avoid stale duplicates
    await db.delete(people).where(eq(people.company_id, companyId));

    const savedPeople = [];
    for (const p of targetPeople) {
      const [savedPerson] = await db
        .insert(people)
        .values({
          company_id: companyId,
          name: p.name,
          role: p.role,
          persona: p.persona,
          persona_reason: p.persona_reason,
          source_url: p.source_url,
          confidence: p.confidence,
        })
        .returning();
      savedPeople.push(savedPerson);
    }
    logStep(
      "People",
      "completed",
      `Identified ${savedPeople.length} key operational personas`,
      s6Start
    );

    // ----------------------------------------------------
    // STEP 7: Opportunity Scoring (Task 2 & 7)
    // ----------------------------------------------------
    const s7Start = Date.now();
    logStep("Scoring", "running", "Calculating explainable opportunity score");

    // Compute sub-scores grounded in evidence
    let timingScore = 50;
    let timingEvidence = "Standard operational baseline";
    if (intel.latest_round) {
      timingScore = 92;
      timingEvidence = `Raised ${intel.latest_round.round} (${intel.latest_round.amount}) on ${intel.latest_round.date}`;
    } else if (intel.open_roles.length >= 3) {
      timingScore = 78;
      timingEvidence = `Active hiring spike with ${intel.open_roles.length} open roles`;
    }

    let fitScore = 70;
    if (intel.size_band === "50-200" && intel.stage.includes("Series")) {
      fitScore = 95;
    } else if (intel.size_band === "20-50") {
      fitScore = 85;
    }

    let reachScore = 50;
    if (savedPeople.some((p) => p.name !== null)) {
      reachScore = 90;
    } else if (savedPeople.length > 0) {
      reachScore = 65;
    }

    const confidenceVal =
      docs.some((d) => d.tier === 1) && intel.key_people.length > 0
        ? 0.88
        : 0.72;

    const scoreResult = calculateScore({
      fit: fitScore,
      timing: timingScore,
      reach: reachScore,
      confidence: confidenceVal,
      timingEvidence,
      fitEvidence: `Matches ICP: ${intel.stage} with ${intel.size_band} team in ${intel.location}`,
      reachEvidence: savedPeople[0]?.name
        ? `Contact identified: ${savedPeople[0].name} (${savedPeople[0].role})`
        : `Target role: ${savedPeople[0]?.role || "Head of Ops"}`,
    });

    await db.insert(scores).values({
      company_id: companyId,
      fit: scoreResult.fit,
      timing: scoreResult.timing,
      reach: scoreResult.reach,
      confidence: scoreResult.confidence.toString(),
      total: scoreResult.total,
      reasoning: scoreResult.reasoning,
    });
    logStep(
      "Scoring",
      "completed",
      `Score computed: ${scoreResult.total}/100 (${scoreResult.reasoning})`,
      s7Start
    );

    // ----------------------------------------------------
    // STEP 8: Outreach Draft Generation (Task 4)
    // ----------------------------------------------------
    const s8Start = Date.now();
    logStep("Outreach", "running", "Drafting restrained outreach message");

    const primaryPerson = savedPeople[0];
    const triggerDesc =
      topUrgentSignal?.description ||
      (intel.latest_round
        ? `announcement of ${intel.latest_round.round} funding`
        : `expansion with ${intel.open_roles.length} new openings`);

    const outreachDraft = generateOutreachDraft({
      companyName: intel.name,
      personName: primaryPerson?.name || null,
      personRole: primaryPerson?.role || "Head of Operations",
      triggerDescription: triggerDesc,
      triggerType: topUrgentSignal?.type || "expansion",
      likelyPains: intel.likely_pains,
    });

    // Clear old outreach for this company and save fresh
    await db.delete(outreach).where(eq(outreach.company_id, companyId));
    await db.insert(outreach).values({
      company_id: companyId,
      person_id: primaryPerson?.id || null,
      trigger_signal_id: topUrgentSignal?.id || null,
      draft: outreachDraft.draft,
      why_note: outreachDraft.why_note,
    });
    logStep(
      "Outreach",
      "completed",
      `Draft created with trigger anchor and 3-sentence limit`,
      s8Start
    );

    // Update run record to completed
    await db
      .update(runs)
      .set({
        status: "completed",
        finished_at: new Date(),
        log: stepLogs,
      })
      .where(eq(runs.id, runId));

    return {
      success: true,
      companyId,
      runId,
      totalScore: scoreResult.total,
      signalsCount: savedSignalsCount,
      logs: stepLogs,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logStep("Pipeline", "failed", errorMsg);

    await db
      .update(runs)
      .set({
        status: "failed",
        finished_at: new Date(),
        log: stepLogs,
      })
      .where(eq(runs.id, runId));

    return {
      success: false,
      companyId: 0,
      runId,
      totalScore: 0,
      signalsCount: 0,
      logs: stepLogs,
      error: errorMsg,
    };
  }
}
