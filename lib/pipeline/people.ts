export interface ExtractedPerson {
  name: string | null;
  role: string;
  persona: string;
  persona_reason: string;
  source_url: string;
  confidence: "high" | "medium" | "low";
}

export function determinePersonas(
  companyName: string,
  companyUrl: string,
  stage: string,
  sizeBand: string,
  knownPeople?: Array<{ name: string; role: string; source_url?: string }>
): ExtractedPerson[] {
  const personas: ExtractedPerson[] = [];

  // Match known people if found
  if (knownPeople && knownPeople.length > 0) {
    for (const p of knownPeople) {
      const roleLower = p.role.toLowerCase();
      let persona = "Operational Leader";
      let reason = "Key stakeholder for workflow efficiency and process scaling.";

      if (/ops|operation|chief of staff/i.test(roleLower)) {
        persona = "Head of Operations";
        reason = "Directly owns the manual workflow bottlenecks you would automate.";
      } else if (/tech|cto|engineering|architect/i.test(roleLower)) {
        persona = "VP of Engineering / CTO";
        reason = "Evaluates API integrations, data security, and AI infrastructure feasibility.";
      } else if (/founder|ceo|co-founder/i.test(roleLower)) {
        persona = "Founder & CEO";
        reason = "Has final sign-off on strategic tooling and capital efficiency for team expansion.";
      } else if (/product|cpo/i.test(roleLower)) {
        persona = "Head of Product";
        reason = "Spearheads automated customer experience and backend data loops.";
      }

      personas.push({
        name: p.name,
        role: p.role,
        persona,
        persona_reason: reason,
        source_url: p.source_url || companyUrl,
        confidence: "high",
      });
    }
  }

  // If fewer than 2 personas, supply target persona roles with low/medium confidence
  // without fabricating names per PRD rule ("Don't invent names. If no named person is found, output the role only and set low confidence.")
  const existingPersonas = new Set(personas.map((p) => p.persona));

  if (!existingPersonas.has("Head of Operations")) {
    personas.push({
      name: null,
      role: "Head of Operations / Chief of Staff",
      persona: "Head of Operations",
      persona_reason: "Owns internal team operations and process bandwidth constraints.",
      source_url: `${companyUrl.replace(/\/$/, "")}/about`,
      confidence: "low",
    });
  }

  if (!existingPersonas.has("Founder & CEO") && (stage === "Seed" || sizeBand === "20-50")) {
    personas.push({
      name: null,
      role: "Founder & CEO",
      persona: "Founder & CEO",
      persona_reason: "Primary decision-maker for tooling budget in companies under 50 people.",
      source_url: `${companyUrl.replace(/\/$/, "")}/about`,
      confidence: "medium",
    });
  }

  return personas.slice(0, 3);
}
