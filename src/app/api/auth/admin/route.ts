import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminSession,
  ADMIN_COOKIE,
  sessionCookieOptions,
  normalizePasswordString,
} from "@/lib/auth";

export const runtime = "nodejs";

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
  // Direct read from process.env (bypasses any stale module state)
  const envAdmin = normalizePasswordString(process.env.ADMIN_PASSWORD);
  const inputNorm = normalizePasswordString(password);
  const directOk =
    envAdmin.length > 0 &&
    inputNorm.length > 0 &&
    envAdmin === inputNorm;
  const ok = directOk || (await verifyAdminPassword(password));
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }
  const token = await createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
  return res;
}
