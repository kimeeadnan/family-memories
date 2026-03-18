import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import {
  verifyFamilyPassword,
  createFamilySession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const password =
    typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    );
  }
  const ok = await verifyFamilyPassword(password);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }
  const token = await createFamilySession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
