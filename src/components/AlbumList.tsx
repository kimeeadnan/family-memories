"use client";

import { useEffect, useState } from "react";
import AlbumCard, { type Album } from "./AlbumCard";
import type { PhotoItem } from "./PhotoGrid";

export default function AlbumList() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [covers, setCovers] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/albums");
        if (!res.ok) {
          setError("Could not load albums");
          return;
        }
        const data = await res.json();
        if (!cancelled) setAlbums(data);
        data.forEach((a: Album) => {
          fetch(`/api/albums/${a.id}/photos`)
            .then((r) => r.ok ? r.json() : [])
            .then((photos: PhotoItem[]) => {
              if (cancelled) return;
              const first = photos.find((p) => p.url);
              setCovers((prev) => ({
                ...prev,
                [a.id]: first?.url ?? null,
              }));
            })
            .catch(() => {});
        });
      } catch {
        if (!cancelled) setError("Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-sky-600">
        {error}
      </div>
    );
  }
  if (!albums.length) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-sky-600">
        No albums yet. Add some from the admin.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
      {albums.map((album, i) => (
        <AlbumCard
          key={album.id}
          album={album}
          index={i}
          coverUrl={covers[album.id]}
        />
      ))}
    </div>
  );
}
