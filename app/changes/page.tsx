import { getChangeFeed } from "@/lib/db/queries";
import { ChangesView } from "@/components/changes/changes-view";

export const dynamic = "force-dynamic";

export default async function ChangesPage() {
  const feed = await getChangeFeed();

  return <ChangesView signals={feed} />;
}
