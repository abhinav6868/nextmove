import { NextRequest, NextResponse } from "next/server";
import { runCompanyPipeline } from "@/lib/pipeline";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, name } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "A valid company URL is required" },
        { status: 400 }
      );
    }

    const result = await runCompanyPipeline(url.trim(), name?.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Pipeline execution failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      companyId: result.companyId,
      runId: result.runId,
      totalScore: result.totalScore,
      signalsCount: result.signalsCount,
      logs: result.logs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
