"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Album = {
  id: string;
  title: string;
  created_at: string;
  sort_order?: number;
};

export default function AdminAlbumsList() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");

  const loadAlbums = useCallback(async () => {
    const res = await fetch("/api/albums", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setAlbums(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  async function persistOrder(next: Album[]) {
    const previous = [...albums];
    setAlbums(next);
    setReordering(true);
    setError("");
    try {
      const res = await fetch("/api/albums", {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumIds: next.map((a) => a.id) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const hint =
          data.code === "NEEDS_MIGRATION_002"
            ? " Run supabase/migrations/002_album_sort_order.sql in Supabase SQL Editor."
            : "";
        setError((data.error || "Could not save order") + hint);
        setAlbums(previous);
        return;
      }
    } catch {
      setError("Could not save order");
      setAlbums(previous);
    } finally {
      setReordering(false);
    }
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    const next = [...albums];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    void persistOrder(next);
  }

  function moveDown(index: number) {
    if (index >= albums.length - 1) return;
    const next = [...albums];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    void persistOrder(next);
  }

  async function handleDelete(album: Album) {
    const ok = window.confirm(
      `Delete “${album.title}” and all photos in it? This cannot be undone.`
    );
    if (!ok) return;
    setError("");
    setDeletingId(album.id);
    try {
      const res = await fetch(`/api/albums/${album.id}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete album");
        return;
      }
      await loadAlbums();
    } catch {
      setError("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError("");
    setCreating(true);
    try {
      const res = await fetch("/api/albums", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create");
        return;
      }
      setNewTitle("");
      await loadAlbums();
    } catch {
      setError("Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 rounded-full border-2 border-champagne-400/30 border-t-regal-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="panel-glass flex flex-wrap items-end gap-4 p-6"
      >
        <div className="min-w-[200px] flex-1">
          <label
            htmlFor="new-album"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-mist-400"
          >
            New album
          </label>
          <input
            id="new-album"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Raya 2025"
            className="focus-regal w-full rounded-xl border border-champagne-400/15 bg-midnight-950/50 px-4 py-3 text-mist-100 placeholder-mist-500"
          />
        </div>
        <button
          type="submit"
          disabled={creating || !newTitle.trim()}
          className="rounded-xl border border-champagne-400/25 bg-gradient-to-b from-regal-500 to-regal-600 px-6 py-3 font-semibold text-midnight-950 transition hover:from-regal-400 hover:to-regal-500 disabled:opacity-40"
        >
          {creating ? "Creating…" : "Create"}
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {reordering && (
        <p className="text-xs text-mist-500" role="status">
          Saving order…
        </p>
      )}
      <ul className="space-y-3">
        {albums.map((album, index) => (
          <li key={album.id}>
            <div className="flex gap-2 rounded-xl border border-champagne-400/15 bg-midnight-850/40 p-2 sm:p-3">
              <Link
                href={`/admin/albums/${album.id}`}
                className="min-w-0 flex-1 rounded-lg px-3 py-3 font-medium text-mist-100 transition hover:bg-midnight-800/50"
              >
                {album.title}
                <span className="mt-1 block text-xs font-normal text-mist-500">
                  Upload photos →
                </span>
              </Link>
              <div className="flex shrink-0 flex-col justify-center gap-1 border-l border-champagne-400/10 pl-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0 || reordering}
                    className="rounded-lg border border-champagne-400/20 bg-midnight-950/60 px-2 py-1.5 text-sm text-mist-200 transition hover:border-champagne-400/35 hover:bg-midnight-800/60 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Move “${album.title}” up`}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === albums.length - 1 || reordering}
                    className="rounded-lg border border-champagne-400/20 bg-midnight-950/60 px-2 py-1.5 text-sm text-mist-200 transition hover:border-champagne-400/35 hover:bg-midnight-800/60 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Move “${album.title}” down`}
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(album)}
                  disabled={deletingId === album.id}
                  className="rounded-lg border border-red-500/25 bg-red-950/30 px-2 py-1.5 text-xs font-medium text-red-200/90 transition hover:border-red-400/40 hover:bg-red-900/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === album.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {!albums.length && (
        <p className="py-10 text-center text-mist-500">
          No albums yet. Create one above.
        </p>
      )}
    </div>
  );
}
