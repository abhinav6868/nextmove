import { getCompaniesWithLatestScore } from "@/lib/db/queries";
import { PipelineView } from "@/components/pipeline/pipeline-view";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const list = await getCompaniesWithLatestScore();

  return <PipelineView companies={list} />;
}
