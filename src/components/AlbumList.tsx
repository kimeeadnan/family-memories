"use client";

import { useEffect, useState } from "react";
import AlbumCard, { type Album } from "./AlbumCard";
import AlbumStackViewer from "./AlbumStackViewer";

const VIEW_KEY = "family_memories_album_layout";
type AlbumView = "stack" | "list";

export default function AlbumList() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<AlbumView>("stack");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(VIEW_KEY);
      if (saved === "list" || saved === "stack") {
        setView(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function setViewPersist(next: AlbumView) {
    setView(next);
    try {
      sessionStorage.setItem(VIEW_KEY, next);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/albums", { credentials: "include" });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401) {
            setError("Session missing — try logging in again.");
          } else if (body.code === "CONFIG") {
            setError(
              "Database not configured. Check Supabase env in Vercel and redeploy."
            );
          } else {
            setError(body.error || "Could not load albums");
          }
          return;
        }
        const data = body;
        if (!cancelled) setAlbums(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-champagne-400/30 border-t-regal-400 animate-spin" />
          <p className="text-sm text-mist-400">Opening albums…</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="panel-glass mx-auto max-w-lg py-10 text-center text-mist-300">
        {error}
      </div>
    );
  }
  if (!albums.length) {
    return (
      <div className="panel-glass mx-auto max-w-lg py-14 text-center">
        <div className="rule-gold mb-4" />
        <p className="font-display text-lg text-mist-200">No albums yet</p>
        <p className="mt-2 text-sm text-mist-400">
          Ask your curator to add memories from the admin area.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3 sm:justify-end">
        <span className="w-full text-center text-[10px] uppercase tracking-[0.2em] text-mist-500 sm:w-auto sm:text-left">
          View
        </span>
        <div className="flex rounded-xl border border-champagne-400/20 bg-midnight-950/50 p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setViewPersist("stack")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              view === "stack"
                ? "bg-regal-600/90 text-midnight-950 shadow-sm"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            Swipe cards
          </button>
          <button
            type="button"
            onClick={() => setViewPersist("list")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              view === "list"
                ? "bg-regal-600/90 text-midnight-950 shadow-sm"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {view === "stack" ? (
        <AlbumStackViewer albums={albums} />
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12">
          {albums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
