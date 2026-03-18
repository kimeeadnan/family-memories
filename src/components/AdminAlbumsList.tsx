"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Album = { id: string; title: string; created_at: string };

export default function AdminAlbumsList() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");

  async function loadAlbums() {
    const res = await fetch("/api/albums", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setAlbums(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAlbums();
  }, []);

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
      <ul className="space-y-3">
        {albums.map((album) => (
          <li key={album.id}>
            <Link
              href={`/admin/albums/${album.id}`}
              className="block rounded-xl border border-champagne-400/15 bg-midnight-850/40 p-5 font-medium text-mist-100 transition hover:border-champagne-400/30 hover:bg-midnight-800/50"
            >
              {album.title}
              <span className="mt-1 block text-xs font-normal text-mist-500">
                Upload photos →
              </span>
            </Link>
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
