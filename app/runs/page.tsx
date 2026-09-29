import { getRunsLog } from "@/lib/db/queries";
import { RunsView } from "@/components/runs/runs-view";

export const dynamic = "force-dynamic";

export default async function RunsPage() {
  const allRuns = await getRunsLog();

  return <RunsView runs={allRuns} />;
}
