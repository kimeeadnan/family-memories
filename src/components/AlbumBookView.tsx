"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PhotoItem } from "./PhotoGrid";

type Props = {
  photos: PhotoItem[];
  albumTitle: string;
};

function spreadCountFor(n: number): number {
  if (n <= 0) return 0;
  return 1 + Math.ceil((n - 1) / 2);
}

function photosForSpread(
  s: number,
  valid: PhotoItem[]
): {
  top: PhotoItem | undefined;
  bottom: PhotoItem | undefined;
  topIsTitle: boolean;
} {
  if (s === 0) {
    return {
      top: undefined,
      bottom: valid[0],
      topIsTitle: true,
    };
  }
  return {
    top: valid[2 * s - 1],
    bottom: valid[2 * s],
    topIsTitle: false,
  };
}

export default function AlbumBookView({ photos, albumTitle }: Props) {
  const valid = useMemo(
    () => (Array.isArray(photos) ? photos : []).filter((p) => p?.url),
    [photos]
  );
  const n = valid.length;
  const title = albumTitle?.trim() ? albumTitle : "Album";

  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0);

  const spreads = spreadCountFor(n);

  useEffect(() => {
    setSpread(0);
  }, [n]);

  const go = useCallback(
    (d: -1 | 1) => {
      setSpread((prev) => {
        const next = prev + d;
        if (next < 0 || next >= spreads) return prev;
        return next;
      });
    },
    [spreads]
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  if (!n) {
    return (
      <p className="py-16 text-center text-mist-400">
        No photos in this album yet.
      </p>
    );
  }

  const { top, bottom, topIsTitle } = photosForSpread(spread, valid);

  return (
    <div className="pb-6">
      <p className="mb-4 text-center text-xs uppercase tracking-[0.35em] text-champagne-400/70">
        Book
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="album-book-page focus-regal mx-auto flex min-h-[260px] w-full max-w-md flex-col items-center justify-center rounded-lg border border-[#c9b8a4]/45 px-8 py-10 text-center shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition hover:border-champagne-400/35 hover:shadow-[0_20px_48px_rgba(0,0,0,0.4)]"
        >
          <span className="relative z-[1] flex flex-col items-center">
            <span className="font-display text-2xl font-semibold text-[#3d2f24] sm:text-3xl">
              {title}
            </span>
            <span className="mt-6 font-sans text-sm text-[#5c4a3d]/85 underline decoration-[#8b7355]/45 underline-offset-4">
              Open book
            </span>
          </span>
        </button>
      ) : (
        <div className="space-y-6">
          <div
            key={spread}
            className="mx-auto max-w-md animate-fade-in overflow-hidden rounded-lg border border-champagne-500/20 bg-midnight-950/30 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          >
            {/* Stacked spread: top page */}
            <div className="album-book-page min-h-[200px] border-b border-[#b8a690]/35 p-6 sm:min-h-[220px] sm:p-8">
              <div className="relative z-[1]">
                {topIsTitle ? (
                  <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2">
                    <span className="font-display text-xl font-semibold text-[#3d2f24] sm:text-2xl">
                      {title}
                    </span>
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#6b5344]/65">
                      Beginning
                    </span>
                  </div>
                ) : top?.url ? (
                  <BookPhoto photo={top} />
                ) : (
                  <EmptyPage label="—" />
                )}
              </div>
            </div>

            {/* Crease between pages */}
            <div
              className="h-px w-full bg-gradient-to-r from-transparent via-[#3d2f24]/35 to-transparent"
              aria-hidden
            />

            {/* Bottom page */}
            <div className="album-book-page min-h-[200px] p-6 sm:min-h-[220px] sm:p-8">
              <div className="relative z-[1]">
                {bottom?.url ? (
                  <BookPhoto photo={bottom} />
                ) : (
                  <EmptyPage label="The end" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={spread <= 0}
              className="rounded-full border border-champagne-400/25 bg-midnight-900/50 px-4 py-2 text-sm text-mist-100 shadow-glass transition hover:border-champagne-400/40 disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={spread >= spreads - 1}
              className="rounded-full border border-champagne-400/25 bg-midnight-900/50 px-4 py-2 text-sm text-mist-100 shadow-glass transition hover:border-champagne-400/40 disabled:opacity-40"
            >
              Next →
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-champagne-400/20 bg-midnight-850/40 px-4 py-2 text-sm text-mist-300 transition hover:border-champagne-400/30 hover:text-mist-100"
            >
              Close book
            </button>
          </div>

          <p className="text-center text-xs text-mist-500">
            Spread {spread + 1} of {spreads}
            <span className="mx-2 text-champagne-500/40">·</span>
            Arrow keys
          </p>
        </div>
      )}
    </div>
  );
}

function BookPhoto({ photo }: { photo: PhotoItem }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[280px] overflow-hidden rounded-sm border border-[#d4c9bc] bg-[#e8e0d8] shadow-inner">
        <img
          src={photo.url!}
          alt={photo.caption ?? ""}
          className="aspect-[4/3] w-full object-cover sm:aspect-square"
          draggable={false}
        />
      </div>
      {(photo.caption || "").trim() ? (
        <p
          className="book-photo-caption font-pencil max-w-sm text-center text-xl font-semibold leading-snug tracking-wide text-black sm:text-2xl"
          style={{
            textShadow: "0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          {photo.caption}
        </p>
      ) : null}
    </div>
  );
}

function EmptyPage({ label }: { label: string }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <p className="font-display text-sm italic text-[#8b7355]/55">{label}</p>
    </div>
  );
}
