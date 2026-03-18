import { NextRequest, NextResponse } from "next/server";
import { getFamilySession, getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase-server";

export async function GET() {
  const session = await getFamilySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabase
    .from("albums")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
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
  const { data, error } = await supabase
    .from("albums")
    .insert({ title })
    .select("id, title, created_at")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
