import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { companies } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(companies).orderBy(desc(companies.created_at));
    return NextResponse.json({ companies: list });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
