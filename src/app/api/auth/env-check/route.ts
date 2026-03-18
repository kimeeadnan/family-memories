import { NextResponse } from "next/server";
import {
  envHasPlainFamilyPassword,
  envHasPlainAdminPassword,
} from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabase-server";

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
    supabaseUrlAndKeySet: supabaseConfigured(),
    hint:
      "Albums need supabaseUrlAndKeySet=true. Admin needs adminPlainPasswordSet=true (ADMIN_PASSWORD=2212529). Redeploy after any env change.",
  });
}
