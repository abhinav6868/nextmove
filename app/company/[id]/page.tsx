import { notFound } from "next/navigation";
import { getCompanyDetail } from "@/lib/db/queries";
import { CompanyView } from "@/components/company/company-view";

export const dynamic = "force-dynamic";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const companyId = parseInt(id, 10);

  if (isNaN(companyId)) {
    notFound();
  }

  const company = await getCompanyDetail(companyId);

  if (!company) {
    notFound();
  }

  return <CompanyView company={company} />;
}
