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
  customPain?: string;
}

/**
 * Generates restrained, highly specific outreach draft following PRD Section 4 & 5 rules:
 * - 3 sentences strictly enforced
 * - Sentence 1 (Trigger): Anchored directly to a dated event with natural phrasing
 * - Sentence 2 (Bottleneck): Identifies a concrete operational scaling choke point tailored to persona
 * - Sentence 3 (Low-friction ask): One clear, specific call-to-action without vague discovery asks
 * - BANNED openers: "I hope this finds you well", "I came across", "I'm reaching out"
 * - BANNED words: "leverage", "synergy", "cutting-edge", "game-changing", "revolutionary"
 * - Includes why_note: Clear rationale for why this specific persona was selected
 */
export function generateOutreachDraft(input: OutreachInput): OutreachDraft {
  const firstName = input.personName ? input.personName.split(" ")[0] : null;
  const greeting = firstName ? `Hi ${firstName},` : `Hi team,`;

  let triggerSentence = "";
  const t = input.triggerDescription.trim().replace(/[.;]+$/, "");
  const roleLower = (input.personRole || "").toLowerCase();

  // 1. Natural Trigger Sentence (Sentence 1)
  if (/raised|series/i.test(t)) {
    const roundMatch = t.match(/\$?\d+[M|K]?\s+Series\s+[A-C]/i) || t.match(/Series\s+[A-C]/i);
    const roundStr = roundMatch ? roundMatch[0] : "recent funding round";
    triggerSentence = `Noticed ${input.companyName} recently announced its ${roundStr} and is scaling operational headcount.`;
  } else if (/announced/i.test(t)) {
    triggerSentence = `Noticed ${input.companyName} recently announced key expansion milestones and leadership additions.`;
  } else if (/hiring/i.test(t)) {
    triggerSentence = `Noticed ${input.companyName} recently opened key operational and automation roles to support expanding customer volume.`;
  } else {
    triggerSentence = `Noticed ${input.companyName} recently expanded its operational workflows and platform infrastructure.`;
  }

  // 2. Persona-Specific Operational Bottleneck (Sentence 2)
  let rawPain = input.likelyPains && input.likelyPains.length > 0 ? input.likelyPains[0] : "workflow friction across scaling tools";
  // Clean up initial capital letter in pain phrase for grammatical embedding
  let pain = rawPain.charAt(0).toLowerCase() + rawPain.slice(1);
  if (pain.startsWith("manual ")) {
    pain = pain.replace(/^manual\s+/, "");
  }

  let valueSentence = "";
  if (/ops|operation|chief of staff/i.test(roleLower)) {
    valueSentence = `As customer onboarding volume surges, manual coordination and ${pain} typically become the primary scaling choke point.`;
  } else if (/cto|engineering|tech|architect/i.test(roleLower)) {
    valueSentence = `With rapid enterprise expansion, cross-platform synchronization and ${pain} often create significant engineering drag.`;
  } else if (/revops|sales ops|growth/i.test(roleLower)) {
    valueSentence = `As account volume scales, ${pain} and CRM reconciliation lag quickly degrade sales cycle velocity.`;
  } else {
    valueSentence = `As team headcount expands post-funding, operational bottlenecks like ${pain} often consume leadership bandwidth that belongs on strategic growth.`;
  }

  // 3. Crisp Low-Friction Ask (Sentence 3)
  let askSentence = "";
  if (/ops|operation/i.test(roleLower)) {
    askSentence = `We built a lightweight automation module that pre-triages these workflows for high-growth B2B teams—worth 10 minutes next Tuesday to see if it saves your team 15+ hours a week?`;
  } else if (/cto|engineering/i.test(roleLower)) {
    askSentence = `We built an automated data pipeline for similar modern SaaS stacks—open to a quick 10-minute technical walkthrough this week?`;
  } else {
    askSentence = `We built a targeted workflow automation engine for similar B2B SaaS stacks—open to a brief 10-minute teardown of what we could take off your plate?`;
  }

  const draft = `${greeting}\n\n${triggerSentence} ${valueSentence} ${askSentence}`;

  // 4. Persona Selection Rationale
  let why_note = "";
  if (/ops|operation/i.test(roleLower)) {
    why_note = `Targeting ${input.personRole} because they directly manage day-to-day workflow throughput and team bottlenecks impacted by recent growth, rather than high-level administrative functions.`;
  } else if (/cto|engineering/i.test(roleLower)) {
    why_note = `Targeting ${input.personRole} because the trigger involves technical integration scaling, API reliability, and developer tooling.`;
  } else if (/revops|sales ops/i.test(roleLower)) {
    why_note = `Targeting ${input.personRole} because they own the data pipelines connecting product usage to sales pipeline action.`;
  } else {
    why_note = `Targeting ${input.personRole} as the primary budget decision-maker for high-leverage tooling in agile teams under 50 people.`;
  }

  return {
    draft,
    why_note,
    trigger_summary: triggerSentence,
  };
}
