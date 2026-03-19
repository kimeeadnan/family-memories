"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";

import type { PhotoItem } from "./PhotoGrid";
import {
  parseSlideshowFrameId,
  SLIDESHOW_FRAME_KEY,
  SLIDESHOW_FRAME_OPTIONS,
  SlideshowFramedSlide,
  type SlideshowFrameId,
} from "./slideshow-frames";

type Props = {
  photos: PhotoItem[];
};

export default function AlbumSlideshow({ photos }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [frame, setFrame] = useState<SlideshowFrameId>("camera");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const validPhotos = useMemo(() => photos.filter((p) => p.url), [photos]);
  const count = validPhotos.length;
  const currentPhotoId = validPhotos[index]?.id ?? "";

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SLIDESHOW_FRAME_KEY);
      setFrame(parseSlideshowFrameId(saved));
    } catch {
      /* ignore */
    }
  }, []);

  function setFramePersist(next: SlideshowFrameId) {
    setFrame(next);
    try {
      sessionStorage.setItem(SLIDESHOW_FRAME_KEY, next);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    setIndex(0);
  }, [count]);

  function scrollTo(i: number) {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }

  async function handleExportPng() {
    if (exporting) return;
    const node = exportRef.current;
    if (!node) return;

    setExporting(true);
    setExportError("");
    try {
      // Ensure images are decoded before rendering to canvas.
      const imgs = Array.from(node.querySelectorAll("img"));
      await Promise.all(
        imgs.map(async (img) => {
          if (img instanceof HTMLImageElement && img.complete) return;
          await new Promise<void>((resolve) => {
            const i = img as HTMLImageElement;
            i.addEventListener("load", () => resolve(), { once: true });
            i.addEventListener("error", () => resolve(), { once: true });
          });
        })
      );

      const blob = await toBlob(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#050a12", // midnight-950
      });

      if (!blob) {
        throw new Error("Could not create PNG.");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const shortId = currentPhotoId ? currentPhotoId.slice(0, 8) : "photo";
      a.href = url;
      a.download = `slideshow-${shortId}-${frame}-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setExportError(
        e instanceof Error ? e.message : "Export failed (CORS may be blocked)."
      );
    } finally {
      setExporting(false);
    }
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
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-champagne-400/70">
            Frame
          </p>
          <div
            className="flex flex-wrap rounded-full border border-champagne-400/15 bg-midnight-900/40 p-1"
            role="group"
            aria-label="Slideshow frame style"
          >
            {SLIDESHOW_FRAME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFramePersist(opt.id)}
                title={opt.hint}
                aria-pressed={frame === opt.id}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:text-sm ${
                  frame === opt.id
                    ? "bg-regal-600/90 text-midnight-950 shadow-sm"
                    : "text-mist-400 hover:text-mist-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          {exportError ? (
            <p className="text-xs text-red-400">{exportError}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void handleExportPng()}
            disabled={exporting}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              "border-champagne-400/20 bg-midnight-900/30 text-mist-100 shadow-glass hover:border-champagne-400/30 hover:bg-midnight-900/50 disabled:opacity-40",
            ].join(" ")}
            aria-label="Export current framed slide as PNG"
            title="Download the current slide as PNG"
          >
            {exporting ? "Exporting…" : "Export PNG"}
          </button>
          <p className="text-xs text-mist-400 sm:text-right">{index + 1} / {count}</p>
        </div>
      </div>

      <p className="mb-3 text-[11px] text-mist-500">
        {
          SLIDESHOW_FRAME_OPTIONS.find((o) => o.id === frame)?.hint
        }
      </p>
      <p className="mb-4 text-[11px] text-mist-500">
        Export downloads the <span className="text-mist-200">full framed slide</span>{" "}
        (frame + caption). Some photos may block export due to CORS.
      </p>

      {/* Swipeable slideshow */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-3xl border border-champagne-400/10 bg-midnight-900/30 shadow-[0_18px_80px_rgba(0,0,0,0.55)] [-webkit-overflow-scrolling:touch]"
        style={{ scrollBehavior: "smooth" }}
      >
        {validPhotos.map((p) => (
          <div
            key={p.id}
            ref={p.id === currentPhotoId ? exportRef : null}
            className="snap-center shrink-0 w-full px-2 py-5 sm:px-4 sm:py-6"
          >
            <div className="mx-auto w-full max-w-md sm:max-w-lg">
              <SlideshowFramedSlide photo={p} frame={frame} />
            </div>
          </div>
        ))}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => scrollTo(index - 1)}
            disabled={index <= 0}
            aria-label="Previous photo"
            className="absolute left-3 top-[58%] -translate-y-1/2 rounded-full border border-champagne-400/20 bg-midnight-900/50 px-3 py-2 text-sm text-mist-100 shadow-glass disabled:opacity-40 sm:top-1/2"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollTo(index + 1)}
            disabled={index >= count - 1}
            aria-label="Next photo"
            className="absolute right-3 top-[58%] -translate-y-1/2 rounded-full border border-champagne-400/20 bg-midnight-900/50 px-3 py-2 text-sm text-mist-100 shadow-glass disabled:opacity-40 sm:top-1/2"
          >
            →
          </button>
        </>
      ) : null}
    </div>
  );
}
