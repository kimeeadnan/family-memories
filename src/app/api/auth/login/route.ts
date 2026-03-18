import { NextRequest, NextResponse } from "next/server";
import {
  verifyFamilyPassword,
  createFamilySession,
  setFamilyCookie,
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
  await setFamilyCookie(token);
  return NextResponse.json({ ok: true });
}
