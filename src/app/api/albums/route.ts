import { NextRequest, NextResponse } from "next/server";
import { getFamilySession, getAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase-server";

export const runtime = "nodejs";

/** DB without migration 002 — family gallery must still work. */
function isMissingSortOrderColumn(error: { message?: string } | null): boolean {
  const m = (error?.message ?? "").toLowerCase();
  if (!m.includes("sort_order")) return false;
  return (
    m.includes("does not exist") ||
    m.includes("not find") ||
    m.includes("schema cache") ||
    m.includes("42703")
  );
}

export async function GET() {
  const session = await getFamilySession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", code: "NO_SESSION" },
      { status: 401 }
    );
  }
  try {
    const ordered = await supabase
      .from("albums")
      .select("id, title, created_at, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (ordered.error && isMissingSortOrderColumn(ordered.error)) {
      const legacy = await supabase
        .from("albums")
        .select("id, title, created_at")
        .order("created_at", { ascending: false });
      if (legacy.error) {
        return NextResponse.json(
          { error: legacy.error.message, code: "SUPABASE" },
          { status: 500 }
        );
      }
      return NextResponse.json(legacy.data ?? []);
    }

    if (ordered.error) {
      return NextResponse.json(
        { error: ordered.error.message, code: "SUPABASE" },
        { status: 500 }
      );
    }
    return NextResponse.json(ordered.data ?? []);
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
    const probe = await supabase.from("albums").select("sort_order").limit(1);

    if (probe.error && isMissingSortOrderColumn(probe.error)) {
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

    if (probe.error) {
      return NextResponse.json({ error: probe.error.message }, { status: 500 });
    }

    const { data: minRows } = await supabase
      .from("albums")
      .select("sort_order")
      .order("sort_order", { ascending: true })
      .limit(1);

    const minSort = minRows?.[0]?.sort_order;
    const nextSort =
      minSort === undefined || minSort === null ? 0 : minSort - 1;

    const { data, error } = await supabase
      .from("albums")
      .insert({ title, sort_order: nextSort })
      .select("id, title, created_at, sort_order")
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

/** Admin: set album order. Body: { albumIds: string[] } in display order (first = top). */
export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const albumIds = (body as { albumIds?: unknown }).albumIds;
  if (!Array.isArray(albumIds) || albumIds.length === 0) {
    return NextResponse.json(
      { error: "albumIds must be a non-empty array" },
      { status: 400 }
    );
  }
  if (!albumIds.every((id) => typeof id === "string" && id.length > 0)) {
    return NextResponse.json(
      { error: "albumIds must be non-empty strings" },
      { status: 400 }
    );
  }

  try {
    for (let i = 0; i < albumIds.length; i++) {
      const { error } = await supabase
        .from("albums")
        .update({ sort_order: i })
        .eq("id", albumIds[i]);
      if (error) {
        if (isMissingSortOrderColumn(error)) {
          return NextResponse.json(
            {
              error:
                "Album order needs the sort_order column. In Supabase SQL Editor, run supabase/migrations/002_album_sort_order.sql",
              code: "NEEDS_MIGRATION_002",
            },
            { status: 400 }
          );
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase error";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
