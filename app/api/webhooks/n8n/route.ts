import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-n8n-secret") || req.headers.get("authorization");
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET || "nextmove_n8n_secret_2026";

    if (authHeader !== expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid n8n webhook secret" },
        { status: 401 }
      );
    }

    const payload = await req.json();
    console.log("n8n webhook received:", payload);

    return NextResponse.json({
      success: true,
      received_at: new Date().toISOString(),
      action: "n8n callback processed",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
