import { NextRequest, NextResponse } from "next/server";
import { getConfig, setConfig } from "@/lib/db/queries";

export async function GET() {
  const top_n = (await getConfig<number>("top_n")) || 10;
  const weights = await getConfig("weights");
  const icp = await getConfig("icp");

  return NextResponse.json({
    top_n,
    weights,
    icp,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: "key and value are required" },
        { status: 400 }
      );
    }

    await setConfig(key, value);
    return NextResponse.json({ success: true, key, value });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
