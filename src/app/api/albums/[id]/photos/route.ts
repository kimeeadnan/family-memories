import { NextRequest, NextResponse } from "next/server";
import { getFamilySession, getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase-server";

const BUCKET = "memories";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getFamilySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: albumId } = await params;
  const { data: album } = await supabase
    .from("albums")
    .select("id")
    .eq("id", albumId)
    .single();
  if (!album) {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }
  const { data, error } = await supabase
    .from("photos")
    .select("id, storage_path, sort_order, caption, created_at")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }
  const photosWithUrls = await Promise.all(
    (data || []).map(async (p) => {
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(p.storage_path, 3600);
      return {
        id: p.id,
        url: signed?.signedUrl ?? null,
        sort_order: p.sort_order,
        caption: p.caption,
        created_at: p.created_at,
      };
    })
  );
  return NextResponse.json(photosWithUrls);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: albumId } = await params;
  const { data: album } = await supabase
    .from("albums")
    .select("id")
    .eq("id", albumId)
    .single();
  if (!album) {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  if (!files.length) {
    return NextResponse.json(
      { error: "No files provided" },
      { status: 400 }
    );
  }
  const inserted: { id: string; storage_path: string }[] = [];
  let sortOrder = 0;
  for (const file of files) {
    if (!(file instanceof File) || !file.size) continue;
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${albumId}/${crypto.randomUUID()}.${ext}`;
    const buf = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buf, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }
    const { data: row, error: insertError } = await supabase
      .from("photos")
      .insert({
        album_id: albumId,
        storage_path: path,
        sort_order: sortOrder++,
      })
      .select("id, storage_path")
      .single();
    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }
    if (row) inserted.push(row);
  }
  return NextResponse.json({ uploaded: inserted.length, photos: inserted });
}
