import { NextResponse } from "next/server";
import {
  envHasPlainFamilyPassword,
  envHasPlainAdminPassword,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Open in browser on your live site to verify Vercel Production env.
 * Does not reveal secrets — only whether variables are present.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV,
    onVercel: process.env.VERCEL === "1",
    vercelEnv: process.env.VERCEL_ENV ?? null,
    familyPlainPasswordSet: envHasPlainFamilyPassword(),
    adminPlainPasswordSet: envHasPlainAdminPassword(),
    hint:
      "If familyPlainPasswordSet is false: either vars are missing, or this deploy is Preview — enable variables for Preview too, or use your production .vercel.app URL. Then Redeploy.",
  });
}
