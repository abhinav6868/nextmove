import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { runCompanyPipeline } from "@/lib/pipeline";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (idParam) {
      const companyId = parseInt(idParam, 10);
      const company = await db.query.companies.findFirst({
        where: eq(companies.id, companyId),
      });

      if (!company) {
        return NextResponse.json(
          { success: false, error: "Company not found" },
          { status: 404 }
        );
      }

      const result = await runCompanyPipeline(company.url, company.name);
      return NextResponse.json({ success: result.success, result });
    }

    // Refresh all companies
    const allCompanies = await db.select().from(companies);
    const results = [];

    for (const comp of allCompanies) {
      const res = await runCompanyPipeline(comp.url, comp.name);
      results.push({ id: comp.id, name: comp.name, success: res.success });
    }

    return NextResponse.json({ success: true, count: results.length, results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
