import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase-server";

export const runtime = "nodejs";

const BUCKET = "memories";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: albumId, photoId } = await params;
  const body = await request.json().catch(() => ({} as unknown));

  const captionRaw = (body as { caption?: unknown }).caption;
  const caption =
    typeof captionRaw === "string"
      ? captionRaw.trim().length > 0
        ? captionRaw.trim().slice(0, 3000)
        : null
      : null;

  try {
    const { error } = await supabase
      .from("photos")
      .update({ caption })
      .eq("id", photoId)
      .eq("album_id", albumId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: albumId, photoId } = await params;

  try {
    const { data: photo, error: photoError } = await supabase
      .from("photos")
      .select("id, storage_path")
      .eq("id", photoId)
      .eq("album_id", albumId)
      .single();

    if (photoError || !photo) {
      return NextResponse.json(
        { error: photoError?.message || "Photo not found" },
        { status: 404 }
      );
    }

    if (!photo.storage_path) {
      return NextResponse.json(
        { error: "Photo storage path missing" },
        { status: 500 }
      );
    }

    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([photo.storage_path]);

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId)
      .eq("album_id", albumId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}

