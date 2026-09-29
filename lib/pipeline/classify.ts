import { FieldDiff } from "./diff";

export interface ClassifiedSignal {
  type: "funding" | "hiring" | "leadership" | "product" | "expansion" | "noise";
  description: string;
  is_meaningful: boolean;
  reason: string;
  urgency: "high" | "medium" | "low";
}

/**
 * Classifies diff items into Signal vs Noise per PRD Section 9.
 * If unclear, defaults to Noise.
 */
export function classifyDiff(diff: FieldDiff): ClassifiedSignal {
  const desc = diff.description.toLowerCase();

  // 1. Funding
  if (diff.category === "funding" || desc.includes("series") || desc.includes("seed") || desc.includes("funding")) {
    return {
      type: "funding",
      description: diff.description,
      is_meaningful: true,
      reason: "Fresh capital injection signals immediate budget for scaling workflows and AI tooling.",
      urgency: "high",
    };
  }

  // 2. Leadership
  if (diff.category === "leadership" || desc.includes("joined as") || desc.includes("vp") || desc.includes("head of")) {
    return {
      type: "leadership",
      description: diff.description,
      is_meaningful: true,
      reason: "New leadership brings mandate to evaluate tools and overhaul operational bottlenecks in first 90 days.",
      urgency: "high",
    };
  }

  // 3. Hiring surge (especially ops / AI)
  if (diff.category === "hiring") {
    const isOpsOrAI = /ops|operation|automation|ai|engineer/i.test(diff.description);
    if (isOpsOrAI) {
      return {
        type: "hiring",
        description: diff.description,
        is_meaningful: true,
        reason: "Active recruitment in operations indicates workflow bottlenecks that AI automation directly resolves.",
        urgency: "high",
      };
    }
    return {
      type: "hiring",
      description: diff.description,
      is_meaningful: true,
      reason: "Team expansion increases coordination overhead and creates demand for automated processes.",
      urgency: "medium",
    };
  }

  // 4. Product or pricing
  if (diff.category === "product" || diff.category === "expansion") {
    return {
      type: diff.category,
      description: diff.description,
      is_meaningful: true,
      reason: "New offerings or pricing restructuring requires rapid support and operational scale.",
      urgency: "medium",
    };
  }

  // 5. Default to Noise per PRD rule
  return {
    type: "noise",
    description: diff.description,
    is_meaningful: false,
    reason: "Routine website copy or minor visual update; does not indicate immediate buying urgency.",
    urgency: "low",
  };
}
