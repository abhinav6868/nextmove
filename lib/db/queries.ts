import { db } from "./client";
import {
  companies,
  snapshots,
  signals,
  people,
  scores,
  outreach,
  runs,
  config,
} from "./schema";
import { eq, desc, and } from "drizzle-orm";
import { DEFAULT_CONFIG } from "../config";

/**
 * Get system config value with fallback to defaults
 */
export async function getConfig<T = unknown>(key: string): Promise<T> {
  try {
    const row = await db.query.config.findFirst({
      where: eq(config.key, key),
    });
    if (row && row.value !== undefined) {
      return row.value as T;
    }
  } catch (err) {
    console.error(`Failed to get config key ${key}:`, err);
  }

  if (key === "top_n") return (DEFAULT_CONFIG.top_n as unknown) as T;
  if (key === "weights") return (DEFAULT_CONFIG.weights as unknown) as T;
  if (key === "icp") return (DEFAULT_CONFIG.icp as unknown) as T;
  return null as T;
}

/**
 * Set system config value
 */
export async function setConfig(key: string, value: unknown) {
  await db
    .insert(config)
    .values({ key, value })
    .onConflictDoUpdate({
      target: config.key,
      set: { value },
    });
}

/**
 * Get all companies with their latest score and top signal
 */
export async function getCompaniesWithLatestScore() {
  const allCompanies = await db.select().from(companies).orderBy(desc(companies.created_at));

  const results = await Promise.all(
    allCompanies.map(async (company) => {
      const latestScore = await db.query.scores.findFirst({
        where: eq(scores.company_id, company.id),
        orderBy: desc(scores.computed_at),
      });

      const topSignal = await db.query.signals.findFirst({
        where: and(
          eq(signals.company_id, company.id),
          eq(signals.is_meaningful, true)
        ),
        orderBy: desc(signals.detected_at),
      });

      const latestSnapshot = await db.query.snapshots.findFirst({
        where: eq(snapshots.company_id, company.id),
        orderBy: desc(snapshots.captured_at),
      });

      return {
        ...company,
        score: latestScore || null,
        topSignal: topSignal || null,
        lastChecked: latestSnapshot?.captured_at || company.created_at,
      };
    })
  );

  return results;
}

/**
 * Get ranked Today list with Top N cutoff and Dropped list
 */
export async function getTodayRankedCompanies(limitN?: number) {
  const topN = limitN ?? ((await getConfig<number>("top_n")) || 10);
  const all = await getCompaniesWithLatestScore();

  // Sort by Total Score DESC, then Timing DESC, then Confidence DESC
  const sorted = all.sort((a, b) => {
    const scoreA = a.score?.total ?? 0;
    const scoreB = b.score?.total ?? 0;
    if (scoreA !== scoreB) return scoreB - scoreA;

    const timingA = a.score?.timing ?? 0;
    const timingB = b.score?.timing ?? 0;
    if (timingA !== timingB) return timingB - timingA;

    const confA = a.score ? Number(a.score.confidence) : 0;
    const confB = b.score ? Number(b.score.confidence) : 0;
    return confB - confA;
  });

  const topItems = sorted.slice(0, topN);
  const droppedItems = sorted.slice(topN).map((item, idx) => {
    // Generate explanation for why it missed the cut
    let dropReason = "Opportunity score below top cutoff";
    if ((item.score?.timing ?? 0) < 50) {
      dropReason = "No fresh triggers in the last 90 days";
    } else if ((item.score?.fit ?? 0) < 60) {
      dropReason = "Moderate ICP fit (stage or headcount out of sweet spot)";
    } else if (Number(item.score?.confidence ?? 0) < 0.6) {
      dropReason = "Lower confidence public data verified";
    } else {
      dropReason = `Ranked #${topN + idx + 1} behind higher urgency peer triggers`;
    }

    return {
      ...item,
      rank: topN + idx + 1,
      dropReason,
    };
  });

  // Attach primary decision-maker and outreach draft for top cards
  const topWithDetails = await Promise.all(
    topItems.map(async (company, idx) => {
      const topPerson = await db.query.people.findFirst({
        where: eq(people.company_id, company.id),
      });

      const topOutreach = await db.query.outreach.findFirst({
        where: eq(outreach.company_id, company.id),
        orderBy: desc(outreach.created_at),
      });

      return {
        ...company,
        rank: idx + 1,
        person: topPerson || null,
        outreach: topOutreach || null,
      };
    })
  );

  return {
    top: topWithDetails,
    dropped: droppedItems,
    topN,
    totalWatched: all.length,
  };
}

/**
 * Get full company detail with all relations
 */
export async function getCompanyDetail(id: number) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, id),
  });

  if (!company) return null;

  const companySnapshots = await db.query.snapshots.findMany({
    where: eq(snapshots.company_id, id),
    orderBy: desc(snapshots.captured_at),
  });

  const companySignals = await db.query.signals.findMany({
    where: eq(signals.company_id, id),
    orderBy: desc(signals.detected_at),
  });

  const companyPeople = await db.query.people.findMany({
    where: eq(people.company_id, id),
  });

  const companyScores = await db.query.scores.findMany({
    where: eq(scores.company_id, id),
    orderBy: desc(scores.computed_at),
  });

  const companyOutreach = await db.query.outreach.findMany({
    where: eq(outreach.company_id, id),
    orderBy: desc(outreach.created_at),
  });

  return {
    ...company,
    snapshots: companySnapshots,
    signals: companySignals,
    people: companyPeople,
    score: companyScores[0] || null,
    scores: companyScores,
    outreach: companyOutreach[0] || null,
  };
}

/**
 * Get full change feed (signals vs noise)
 */
export async function getChangeFeed() {
  const allSignals = await db.query.signals.findMany({
    orderBy: desc(signals.detected_at),
    with: {
      company: true,
    },
  });

  return allSignals;
}

/**
 * Get execution runs log
 */
export async function getRunsLog() {
  const allRuns = await db.query.runs.findMany({
    orderBy: desc(runs.started_at),
    with: {
      company: true,
    },
    limit: 50,
  });

  return allRuns;
}
