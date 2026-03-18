"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { PhotoItem } from "./PhotoGrid";

type Props = {
  photos: PhotoItem[];
};

export default function AlbumSlideshow({ photos }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const validPhotos = useMemo(() => photos.filter((p) => p.url), [photos]);
  const count = validPhotos.length;

  useEffect(() => {
    setIndex(0);
  }, [count]);

  function scrollTo(i: number) {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const safeEl = el;

    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const width = safeEl.clientWidth || 1;
        const next = Math.round(safeEl.scrollLeft / width);
        setIndex((prev) => (prev === next ? prev : next));
      });
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [count]);

  if (!count) {
    return <p className="py-16 text-center text-mist-400">No photos in this album yet.</p>;
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne-400/70">
          Slide
        </p>
        <p className="text-xs text-mist-400">
          {index + 1} / {count}
        </p>
      </div>

      {/* Swipeable camera-frame slideshow */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-3xl border border-champagne-400/10 bg-midnight-900/30 shadow-[0_18px_80px_rgba(0,0,0,0.55)] [-webkit-overflow-scrolling:touch]"
        style={{ scrollBehavior: "smooth" }}
      >
        {validPhotos.map((p, i) => (
          <div
            key={p.id}
            className="snap-center shrink-0 w-full px-3 py-6 sm:px-6"
          >
            <div className="mx-auto w-full max-w-sm">
              <div className="relative rounded-[32px] border border-white/75 bg-white/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                {/* Faux lens / camera ornament (subtle on white frame) */}
                <div className="pointer-events-none absolute left-6 top-6 h-4 w-4 rounded-full border border-midnight-950/20 bg-midnight-950/5" />
                <div className="pointer-events-none absolute right-6 top-6 h-2.5 w-2.5 rounded-full bg-champagne-400/25" />

                <div className="aspect-square overflow-hidden rounded-[20px] border border-midnight-950/10 bg-midnight-950/5">
                  <img
                    src={p.url!}
                    alt={p.caption ?? ""}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                {/* Divider: photo | text — crisp black rule */}
                <div
                  className="mx-2 my-3 h-[2px] rounded-full bg-midnight-950 shadow-[0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.08)]"
                  aria-hidden
                />

                {/* Caption / moment — marker-style font */}
                <div className="px-2 pb-2 pt-0">
                  {(p.caption || "").trim() ? (
                    <p className="font-marker text-center text-base leading-relaxed tracking-wide text-midnight-950 sm:text-lg">
                      {p.caption}
                    </p>
                  ) : (
                    <p className="font-marker text-center text-base leading-relaxed text-midnight-950/40 sm:text-lg">
                      Moment
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next buttons (desktop + fallback for accessibility) */}
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => scrollTo(index - 1)}
            disabled={index <= 0}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-champagne-400/20 bg-midnight-900/50 px-3 py-2 text-sm text-mist-100 shadow-glass disabled:opacity-40"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollTo(index + 1)}
            disabled={index >= count - 1}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-champagne-400/20 bg-midnight-900/50 px-3 py-2 text-sm text-mist-100 shadow-glass disabled:opacity-40"
          >
            →
          </button>
        </>
      ) : null}
    </div>
  );
}

