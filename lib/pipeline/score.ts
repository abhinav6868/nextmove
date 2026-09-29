export interface ScoreInput {
  fit: number; // 0 - 100
  timing: number; // 0 - 100
  reach: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  timingEvidence?: string;
  fitEvidence?: string;
  reachEvidence?: string;
}

export interface ScoreOutput {
  fit: number;
  timing: number;
  reach: number;
  confidence: number;
  base: number;
  total: number;
  reasoning: string;
}

/**
 * Calculates Opportunity Score per PRD Section 7.
 * Code does the math, never the LLM.
 *
 * base  = 0.35 * Timing + 0.35 * Fit + 0.30 * Reach
 * total = round(base * (0.6 + 0.4 * Confidence))
 */
export function calculateScore(input: ScoreInput): ScoreOutput {
  const fit = Math.max(0, Math.min(100, Math.round(input.fit)));
  const timing = Math.max(0, Math.min(100, Math.round(input.timing)));
  const reach = Math.max(0, Math.min(100, Math.round(input.reach)));
  const confidence = Math.max(0, Math.min(1, Number(input.confidence.toFixed(2))));

  const base = 0.35 * timing + 0.35 * fit + 0.3 * reach;
  const total = Math.max(
    0,
    Math.min(100, Math.round(base * (0.6 + 0.4 * confidence)))
  );

  // Generate explainable 1-sentence reasoning
  const parts: string[] = [];
  if (input.timingEvidence) {
    parts.push(input.timingEvidence);
  } else if (timing >= 75) {
    parts.push("Recent high-urgency operational trigger");
  } else if (timing <= 35) {
    parts.push("No fresh triggers detected in last 90 days");
  }

  if (input.reachEvidence) {
    parts.push(input.reachEvidence);
  } else if (reach >= 75) {
    parts.push("Identified direct operational decision-maker");
  }

  if (input.fitEvidence) {
    parts.push(input.fitEvidence);
  }

  const reasoning =
    parts.length > 0
      ? parts.join("; ") + "."
      : `Scored ${total}/100 based on timing (${timing}), ICP fit (${fit}), and decision-maker reach (${reach}) with ${(confidence * 100).toFixed(0)}% data confidence.`;

  return {
    fit,
    timing,
    reach,
    confidence,
    base: Math.round(base * 10) / 10,
    total,
    reasoning,
  };
}
