export interface FieldDiff {
  field: string;
  category:
    | "funding"
    | "hiring"
    | "leadership"
    | "product"
    | "expansion"
    | "general";
  old_value: string | number | null;
  new_value: string | number | null;
  description: string;
}

export interface ExtractedIntel {
  name?: string;
  stage?: string;
  size_band?: string;
  employee_count?: number;
  funding_total?: string;
  latest_round?: {
    round: string;
    amount: string;
    date: string;
    investors?: string[];
  };
  key_people?: Array<{ name: string; role: string; source_url?: string }>;
  open_roles?: Array<{ title: string; department: string; location?: string }>;
  products?: string[];
  pricing_model?: string;
  locations?: string[];
  recent_news?: Array<{ title: string; date: string; url?: string }>;
  pains?: string[];
}

/**
 * Computes deep differences between snapshot A and snapshot B.
 */
export function computeSnapshotDiff(
  prev: ExtractedIntel | null,
  current: ExtractedIntel
): FieldDiff[] {
  const diffs: FieldDiff[] = [];

  if (!prev) {
    // Initial snapshot: record primary baseline state
    if (current.latest_round) {
      diffs.push({
        field: "latest_round",
        category: "funding",
        old_value: null,
        new_value: `${current.latest_round.round} (${current.latest_round.amount})`,
        description: `Initial funding record: ${current.latest_round.round} of ${current.latest_round.amount} on ${current.latest_round.date}`,
      });
    }

    if (current.open_roles && current.open_roles.length > 0) {
      diffs.push({
        field: "open_roles",
        category: "hiring",
        old_value: null,
        new_value: `${current.open_roles.length} open roles`,
        description: `Hiring for ${current.open_roles.length} roles including ${current.open_roles.slice(0, 3).map((r) => r.title).join(", ")}`,
      });
    }

    if (current.key_people && current.key_people.length > 0) {
      diffs.push({
        field: "key_people",
        category: "leadership",
        old_value: null,
        new_value: `${current.key_people.length} leaders identified`,
        description: `Leadership identified: ${current.key_people.map((p) => `${p.name} (${p.role})`).join(", ")}`,
      });
    }

    return diffs;
  }

  // 1. Funding Diff
  if (
    current.latest_round &&
    (!prev.latest_round ||
      prev.latest_round.round !== current.latest_round.round ||
      prev.latest_round.amount !== current.latest_round.amount)
  ) {
    diffs.push({
      field: "latest_round",
      category: "funding",
      old_value: prev.latest_round
        ? `${prev.latest_round.round} (${prev.latest_round.amount})`
        : null,
      new_value: `${current.latest_round.round} (${current.latest_round.amount})`,
      description: `Announced ${current.latest_round.round} round of ${current.latest_round.amount}`,
    });
  }

  // 2. Headcount / Size Band Diff
  if (current.size_band && current.size_band !== prev.size_band) {
    diffs.push({
      field: "size_band",
      category: "expansion",
      old_value: prev.size_band || null,
      new_value: current.size_band,
      description: `Company team size grew from ${prev.size_band || "unknown"} to ${current.size_band}`,
    });
  }

  // 3. Open Roles Diff
  const prevRoles = new Set((prev.open_roles || []).map((r) => r.title.toLowerCase().trim()));
  const currentRoles = current.open_roles || [];
  const newRoles = currentRoles.filter(
    (r) => !prevRoles.has(r.title.toLowerCase().trim())
  );

  if (newRoles.length > 0) {
    const isOpsHiring = newRoles.some((r) =>
      /ops|operation|ai|machine learning|automation|support/i.test(r.title)
    );
    diffs.push({
      field: "open_roles",
      category: "hiring",
      old_value: `${prev.open_roles?.length || 0} roles`,
      new_value: `${currentRoles.length} roles (+${newRoles.length} new)`,
      description: `Opened ${newRoles.length} new roles: ${newRoles.slice(0, 3).map((r) => r.title).join(", ")}${isOpsHiring ? " (includes critical ops/automation roles)" : ""}`,
    });
  }

  // 4. Leadership Diff
  const prevPeople = new Set((prev.key_people || []).map((p) => p.name.toLowerCase().trim()));
  const currentPeople = current.key_people || [];
  const newPeople = currentPeople.filter(
    (p) => !prevPeople.has(p.name.toLowerCase().trim())
  );

  if (newPeople.length > 0) {
    diffs.push({
      field: "key_people",
      category: "leadership",
      old_value: `${prev.key_people?.length || 0} leaders`,
      new_value: `${currentPeople.length} leaders`,
      description: `New leadership added: ${newPeople.map((p) => `${p.name} as ${p.role}`).join(", ")}`,
    });
  }

  // 5. Products / Pricing Diff
  if (
    current.pricing_model &&
    prev.pricing_model &&
    current.pricing_model !== prev.pricing_model
  ) {
    diffs.push({
      field: "pricing_model",
      category: "expansion",
      old_value: prev.pricing_model,
      new_value: current.pricing_model,
      description: `Updated pricing model from ${prev.pricing_model} to ${current.pricing_model}`,
    });
  }

  return diffs;
}
