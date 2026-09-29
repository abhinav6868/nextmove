export interface OutreachDraft {
  draft: string;
  why_note: string;
  trigger_summary: string;
}

export interface OutreachInput {
  companyName: string;
  personName: string | null;
  personRole: string;
  triggerDescription: string;
  triggerType: string;
  triggerDate?: string;
  likelyPains?: string[];
}

/**
 * Generates restrained, highly specific outreach draft following PRD Section 4 & 5 rules:
 * - 3–4 sentences
 * - First sentence references one specific, dated trigger
 * - One clear low-friction ask
 * - BANNED openers: "I hope this finds you well", "I came across", "I'm reaching out"
 * - BANNED words: "leverage", "synergy", "cutting-edge", "game-changing"
 * - Includes why_note: why this person, why now, in one sentence
 */
export function generateOutreachDraft(input: OutreachInput): OutreachDraft {
  const greeting = input.personName
    ? `Hi ${input.personName.split(" ")[0]},`
    : `Hi team,`;

  const pain =
    input.likelyPains && input.likelyPains.length > 0
      ? input.likelyPains[0]
      : "scaling team throughput without linear headcount expansion";

  // Sentence 1: Dated trigger reference
  const triggerSentence = `Noticed ${input.companyName}'s ${input.triggerDescription}.`;

  // Sentence 2: Concrete automation proposition without banned buzzwords
  const valueSentence = `When teams expand this phase, manual data and workflow friction typically slow down ${input.personRole.toLowerCase()} priorities like ${pain}.`;

  // Sentence 3: Low friction ask
  const askSentence = `Built an automated agent pipeline for similar B2B SaaS stacks—open to a 10-minute teardown of what we could take off your plate this week?`;

  const draft = `${greeting}\n\n${triggerSentence} ${valueSentence} ${askSentence}`;

  const why_note = `${input.personRole} owns the specific operational bottlenecks created by the recent ${input.triggerType} trigger.`;

  return {
    draft,
    why_note,
    trigger_summary: input.triggerDescription,
  };
}
