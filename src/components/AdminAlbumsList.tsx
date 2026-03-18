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
    const res = await fetch("/api/albums");
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
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="p-4 rounded-xl bg-white border border-sky-200 flex flex-wrap gap-3 items-end"
      >
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="new-album" className="block text-sm font-medium text-sky-700 mb-1">
            New album title
          </label>
          <input
            id="new-album"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Raya 2025"
            className="w-full px-4 py-2 rounded-lg border border-sky-200 text-sky-900 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <button
          type="submit"
          disabled={creating || !newTitle.trim()}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition"
        >
          {creating ? "Creating…" : "Create album"}
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="space-y-2">
        {albums.map((album) => (
          <li key={album.id}>
            <Link
              href={`/admin/albums/${album.id}`}
              className="block p-4 rounded-xl bg-white border border-sky-200 text-sky-800 font-medium hover:bg-sky-50 hover:border-sky-300 transition"
            >
              {album.title}
            </Link>
          </li>
        ))}
      </ul>
      {!albums.length && (
        <p className="text-sky-600 text-center py-8">No albums yet. Create one above.</p>
      )}
    </div>
  );
}
