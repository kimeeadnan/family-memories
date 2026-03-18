"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PhotoGrid, { type PhotoItem } from "./PhotoGrid";

type Props = { albumId: string };

export default function AlbumPhotos({ albumId }: Props) {
  const [album, setAlbum] = useState<{ id: string; title: string } | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/albums/${albumId}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/albums/${albumId}/photos`).then((r) => (r.ok ? r.json() : [])),
    ]).then(([albumData, photosData]) => {
      if (cancelled) return;
      setAlbum(albumData);
      setPhotos(Array.isArray(photosData) ? photosData : []);
    }).catch(() => {
      if (!cancelled) setError("Could not load album");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [albumId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error || !album) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-sky-600">
        {error || "Album not found"}
        <Link href="/gallery" className="block mt-4 text-sky-600 underline">
          Back to albums
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-sky-800 mb-6">{album.title}</h1>
      <PhotoGrid photos={photos} />
    </div>
  );
}
