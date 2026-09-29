import { getTodayRankedCompanies } from "@/lib/db/queries";
import { TodayView } from "@/components/today/today-view";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const data = await getTodayRankedCompanies();

  return (
    <TodayView
      top={data.top}
      dropped={data.dropped}
      topN={data.topN}
      totalWatched={data.totalWatched}
      lastRunTime="06:02"
    />
  );
}
