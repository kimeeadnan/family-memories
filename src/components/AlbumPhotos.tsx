"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AlbumBookView from "./AlbumBookView";
import AlbumSlideshow from "./AlbumSlideshow";
import FamilyTreeModal from "./FamilyTreeModal";
import PhotoGrid, { type PhotoItem } from "./PhotoGrid";

type Props = { albumId: string };

export default function AlbumPhotos({ albumId }: Props) {
  const [album, setAlbum] = useState<{ id: string; title: string } | null>(
    null
  );
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [view, setView] = useState<"slideshow" | "grid" | "book">("slideshow");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/albums/${albumId}`, { credentials: "include" }).then(
        (r) => (r.ok ? r.json() : null)
      ),
      fetch(`/api/albums/${albumId}/photos`, { credentials: "include" }).then(
        (r) => (r.ok ? r.json() : [])
      ),
    ])
      .then(([albumData, photosData]) => {
        if (cancelled) return;
        setAlbum(albumData);
        setPhotos(Array.isArray(photosData) ? photosData : []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load album");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [albumId]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl justify-center py-24">
        <div className="h-12 w-12 rounded-full border-2 border-champagne-400/30 border-t-regal-400 animate-spin" />
      </div>
    );
  }
  if (error || !album) {
    return (
      <div className="panel-glass mx-auto max-w-lg py-10 text-center text-mist-300">
        {error || "Album not found"}
        <Link
          href="/gallery"
          className="mt-4 block text-regal-300 hover:text-mist-100"
        >
          ← Back to albums
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 border-b border-champagne-400/15 pb-8">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-widest text-champagne-400/60">
            Album
          </p>
          <FamilyTreeModal />
        </div>
        <h1 className="font-display text-3xl font-semibold text-mist-50 sm:text-4xl">
          {album.title}
        </h1>
        <div className="rule-gold mt-5 !mx-0 w-24" />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setView("slideshow")}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              "border-champagne-400/20 bg-midnight-900/30 text-mist-100 shadow-glass hover:border-champagne-400/30 hover:bg-midnight-900/50",
              view === "slideshow"
                ? "border-champagne-400/45 bg-midnight-900/60"
                : "opacity-90",
            ].join(" ")}
          >
            Slideshow
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              "border-champagne-400/20 bg-midnight-900/30 text-mist-100 shadow-glass hover:border-champagne-400/30 hover:bg-midnight-900/50",
              view === "grid" ? "border-champagne-400/45 bg-midnight-900/60" : "opacity-90",
            ].join(" ")}
          >
            View entire album
          </button>
          <button
            type="button"
            onClick={() => setView("book")}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              "border-champagne-400/20 bg-midnight-900/30 text-mist-100 shadow-glass hover:border-champagne-400/30 hover:bg-midnight-900/50",
              view === "book"
                ? "border-champagne-400/45 bg-midnight-900/60"
                : "opacity-90",
            ].join(" ")}
          >
            Book
          </button>
          <Link
            href="/gallery"
            className="ml-auto text-sm text-mist-200 hover:text-mist-100"
          >
            ← Back to albums
          </Link>
        </div>
      </div>

      {view === "grid" ? (
        <PhotoGrid photos={photos} />
      ) : view === "book" ? (
        <AlbumBookView photos={photos} albumTitle={album.title ?? "Album"} />
      ) : (
        <AlbumSlideshow photos={photos} />
      )}
    </div>
  );
}
