"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlbumCardSurface, type Album } from "./AlbumCard";

const SWIPE_OUT = 110;
const DRAG_COMMIT = 0.22; // fraction of card width

type Props = {
  albums: Album[];
};

export default function AlbumStackViewer({ albums }: Props) {
  const router = useRouter();
  const n = albums.length;
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerId = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const top = albums[index % n];
  const second = n > 1 ? albums[(index + 1) % n] : null;
  const third = n > 2 ? albums[(index + 2) % n] : null;

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % n);
  }, [n]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const resetDrag = useCallback(() => {
    setDragX(0);
    setDragY(0);
    setIsDragging(false);
    pointerId.current = null;
    moved.current = false;
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    pointerId.current = e.pointerId;
    start.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved.current = true;
    setDragX(dx);
    setDragY(dy);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    const width = cardRef.current?.offsetWidth ?? 320;
    const threshold = Math.max(SWIPE_OUT, width * DRAG_COMMIT);

    if (moved.current && (Math.abs(dragX) > threshold || Math.abs(dragY) > threshold)) {
      if (Math.abs(dragX) >= Math.abs(dragY)) {
        if (dragX < 0) goNext();
        else goPrev();
      } else {
        if (dragY < 0) goNext();
        else goPrev();
      }
    } else if (!moved.current) {
      router.push(`/gallery/${top.id}`);
    }

    resetDrag();
  };

  const onPointerCancel = () => {
    resetDrag();
  };

  const rotate = dragX * 0.04;
  const topStyle: React.CSSProperties = {
    transform: `translate(${dragX}px, ${dragY}px) rotate(${rotate}deg)`,
    transition: isDragging
      ? "none"
      : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
    touchAction: "none",
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center">
      <p className="mb-4 text-center text-xs text-mist-500">
        {n > 1
          ? "Swipe the top card in any direction for the next album"
          : "Tap the card to open"}
      </p>

      <div
        className="relative w-full select-none"
        style={{ minHeight: "min(72vw, 420px)" }}
      >
        {/* Back cards */}
        {third && (
          <div
            className="pointer-events-none absolute inset-x-0 top-6 scale-[0.86] opacity-55"
            style={{ zIndex: 1 }}
            aria-hidden
          >
            <AlbumCardSurface album={third} variant="stack" />
          </div>
        )}
        {second && (
          <div
            className="pointer-events-none absolute inset-x-0 top-3 scale-[0.93] opacity-75"
            style={{ zIndex: 2 }}
            aria-hidden
          >
            <AlbumCardSurface album={second} variant="stack" />
          </div>
        )}

        {/* Top (interactive) */}
        <div
          ref={cardRef}
          role="button"
          tabIndex={0}
          className="relative cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-regal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-950"
          style={{ ...topStyle, zIndex: 3 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push(`/gallery/${top.id}`);
            }
            if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
          }}
          aria-label={`Album ${top.title}. Tap to open, or swipe for another.`}
        >
          <AlbumCardSurface album={top} variant="stack" />
        </div>
      </div>

      {n > 1 && (
        <p className="mt-6 text-center text-[11px] uppercase tracking-wider text-mist-600">
          {index + 1} / {n}
        </p>
      )}
    </div>
  );
}
