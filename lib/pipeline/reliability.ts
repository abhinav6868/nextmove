export type SourceTier = 1 | 2 | 3 | 4;

export interface SourcedClaim<T = string | number> {
  value: T;
  source_url: string;
  tier: SourceTier;
  date?: string; // ISO date string e.g. "2026-09-15" or "2024"
  label?: string; // e.g. "press release", "careers page"
}

export interface AlternativeClaim<T = string | number> {
  value: T;
  source_url: string;
  tier: SourceTier;
  date?: string;
  status: "superseded" | "lower_tier" | "conflicting";
  label?: string;
}

export interface ResolvedClaim<T = string | number> {
  value: T;
  confidence: "high" | "medium" | "low";
  tier: SourceTier;
  source_url: string;
  date?: string;
  needs_review: boolean;
  alternatives: AlternativeClaim<T>[];
}

export const TIER_WEIGHTS: Record<SourceTier, number> = {
  1: 1.0, // Official site, official filings
  2: 0.8, // Reputable news, official press
  3: 0.6, // Directories (Crunchbase, job boards)
  4: 0.3, // Social posts, scraped guesses
};

/**
 * Resolves conflicting claims according to PRD Section 8:
 * - Prefer the higher tier (lower tier number)
 * - Then prefer newer date
 * - If two tier-1/2 sources disagree on value, flag `needs_review: true`
 */
export function resolveClaim<T extends string | number>(
  claims: SourcedClaim<T>[]
): ResolvedClaim<T> | null {
  if (!claims || claims.length === 0) {
    return null;
  }

  if (claims.length === 1) {
    const single = claims[0];
    const confidence =
      single.tier === 1 ? "high" : single.tier <= 2 ? "medium" : "low";
    return {
      value: single.value,
      confidence,
      tier: single.tier,
      source_url: single.source_url,
      date: single.date,
      needs_review: false,
      alternatives: [],
    };
  }

  // Sort claims:
  // 1. Primary: tier ascending (tier 1 beats tier 2)
  // 2. Secondary: date descending (newer beats older)
  const sorted = [...claims].sort((a, b) => {
    if (a.tier !== b.tier) {
      return a.tier - b.tier;
    }
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  const best = sorted[0];
  const alternatives: AlternativeClaim<T>[] = [];
  let hasHighTierDisagreement = false;

  for (let i = 1; i < sorted.length; i++) {
    const claim = sorted[i];
    // Values match
    if (String(claim.value).trim().toLowerCase() === String(best.value).trim().toLowerCase()) {
      continue;
    }

    let status: "superseded" | "lower_tier" | "conflicting" = "superseded";
    if (claim.tier > best.tier) {
      status = "lower_tier";
    } else if (claim.tier <= 2 && best.tier <= 2) {
      status = "conflicting";
      hasHighTierDisagreement = true;
    }

    alternatives.push({
      value: claim.value,
      source_url: claim.source_url,
      tier: claim.tier,
      date: claim.date,
      label: claim.label,
      status,
    });
  }

  // Determine confidence
  let confidence: "high" | "medium" | "low" = "medium";
  if (best.tier === 1 && !hasHighTierDisagreement) {
    confidence = "high";
  } else if (best.tier <= 2 && !hasHighTierDisagreement) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return {
    value: best.value,
    confidence,
    tier: best.tier,
    source_url: best.source_url,
    date: best.date,
    needs_review: hasHighTierDisagreement,
    alternatives,
  };
}
