import { NextResponse } from "next/server";
import { clearFamilyCookie, clearAdminCookie } from "@/lib/auth";

export async function POST() {
  await clearFamilyCookie();
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
