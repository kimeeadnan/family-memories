import { NextRequest, NextResponse } from "next/server";
import { getFamilySession, getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  const session = await getFamilySession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", code: "NO_SESSION" },
      { status: 401 }
    );
  }
  try {
    const { data, error } = await supabase
      .from("albums")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json(
        { error: error.message, code: "SUPABASE" },
        { status: 500 }
      );
    }
    return NextResponse.json(data ?? []);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase error";
    return NextResponse.json({ error: msg, code: "CONFIG" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : null;
  if (!title) {
    return NextResponse.json(
      { error: "title is required" },
      { status: 400 }
    );
  }
  try {
    const { data, error } = await supabase
      .from("albums")
      .insert({ title })
      .select("id, title, created_at")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
