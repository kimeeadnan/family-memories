import { NextRequest, NextResponse } from "next/server";
import { getFamilySession, getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase-server";

export const runtime = "nodejs";

const BUCKET = "memories";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getFamilySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { data, error } = await supabase
    .from("albums")
    .select("id, title, created_at")
    .eq("id", id)
    .single();
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const { data: photos, error: photosError } = await supabase
      .from("photos")
      .select("storage_path")
      .eq("album_id", id);

    if (photosError) {
      return NextResponse.json(
        { error: photosError.message },
        { status: 500 }
      );
    }

    const paths =
      photos
        ?.map((p) => p.storage_path)
        .filter((p): p is string => typeof p === "string" && p.length > 0) ??
      [];

    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove(paths);
      if (storageError) {
        return NextResponse.json(
          { error: storageError.message },
          { status: 500 }
        );
      }
    }

    const { error } = await supabase.from("albums").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
