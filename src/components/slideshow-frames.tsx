"use client";

import type { PhotoItem } from "./PhotoGrid";

export type SlideshowFrameId = "camera" | "vintage" | "cinema";

export const SLIDESHOW_FRAME_OPTIONS: {
  id: SlideshowFrameId;
  label: string;
  hint: string;
}[] = [
  { id: "camera", label: "Instant", hint: "Clean white frame" },
  { id: "vintage", label: "Heritage", hint: "Warm paper & gold" },
  { id: "cinema", label: "Cinema", hint: "Film & dark mat" },
];

export const SLIDESHOW_FRAME_KEY = "family_memories_slideshow_frame";

export function parseSlideshowFrameId(raw: string | null): SlideshowFrameId {
  if (raw === "vintage" || raw === "cinema" || raw === "camera") return raw;
  return "camera";
}

function CaptionBelow({
  caption,
  frame,
}: {
  caption: string;
  frame: SlideshowFrameId;
}) {
  const has = caption.trim().length > 0;
  const fallback =
    frame === "cinema" ? "— no caption —" : "Moment";
  const text = has ? caption : fallback;

  if (frame === "camera") {
    return (
      <div className="px-2 pb-2 pt-3">
        {has ? (
          <p className="font-marker text-center text-lg leading-relaxed tracking-wide text-midnight-950 sm:text-xl">
            {text}
          </p>
        ) : (
          <p className="font-marker text-center text-lg leading-relaxed text-midnight-950/40 sm:text-xl">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (frame === "vintage") {
    return (
      <div className="border-t border-amber-900/15 bg-gradient-to-b from-[#ebe0cf] to-[#e5d8c4] px-4 py-3">
        {has ? (
          <p className="text-center font-display text-base italic leading-relaxed text-amber-950/90 sm:text-lg">
            {text}
          </p>
        ) : (
          <p className="text-center font-display text-base italic text-amber-900/45 sm:text-lg">
            {text}
          </p>
        )}
      </div>
    );
  }

  /* cinema */
  return (
    <div className="border-t border-white/10 bg-midnight-950 px-3 py-2.5">
      {has ? (
        <p className="text-center font-sans text-[11px] font-medium uppercase leading-relaxed tracking-[0.2em] text-mist-200 sm:text-xs">
          {text}
        </p>
      ) : (
        <p className="text-center font-sans text-[11px] uppercase tracking-[0.18em] text-mist-500 sm:text-xs">
          {text}
        </p>
      )}
    </div>
  );
}

/** One slide with image + caption, wrapped in the selected frame style */
export function SlideshowFramedSlide({
  photo,
  frame,
}: {
  photo: PhotoItem;
  frame: SlideshowFrameId;
}) {
  const url = photo.url!;
  const cap = photo.caption ?? "";

  const img = (
    <img
      src={url}
      alt={cap || "Photo"}
      className="h-full w-full object-cover"
      draggable={false}
    />
  );

  if (frame === "camera") {
    return (
      <div className="relative rounded-none border-2 border-white/90 bg-white/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-4">
        <div className="pointer-events-none absolute left-4 top-4 h-3 w-3 border border-midnight-950/25 bg-midnight-950/5 sm:left-5 sm:top-5" />
        <div className="pointer-events-none absolute right-4 top-4 h-2 w-2 bg-midnight-950/30 sm:right-5 sm:top-5" />
        <div className="aspect-square overflow-hidden rounded-none border border-midnight-950/15 bg-midnight-950/5">
          {img}
        </div>
        <CaptionBelow caption={cap} frame="camera" />
      </div>
    );
  }

  if (frame === "vintage") {
    return (
      <div
        className="relative overflow-hidden rounded-sm p-[10px] shadow-[0_20px_70px_rgba(40,30,20,0.5)] sm:p-3"
        style={{
          background:
            "linear-gradient(145deg, #faf3e4 0%, #ebe0cf 45%, #e2d4bc 100%)",
          boxShadow:
            "inset 0 0 0 1px rgba(184, 134, 11, 0.25), 0 24px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-2 rounded-sm border border-amber-800/20 sm:inset-3"
          aria-hidden
        />
        <div className="relative bg-[#2a2419]/10 p-2 sm:p-2.5">
          <div
            className="aspect-square overflow-hidden rounded-[2px] border border-amber-900/20 shadow-[inset_0_2px_12px_rgba(0,0,0,0.12)]"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255,252,245,0.4), 0 8px 24px rgba(60,45,30,0.2)",
            }}
          >
            {img}
          </div>
        </div>
        <CaptionBelow caption={cap} frame="vintage" />
      </div>
    );
  }

  /* cinema */
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-midnight-900 to-midnight-950 shadow-[0_28px_90px_rgba(0,0,0,0.65)]">
      {/* faux projector / window chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-500/70" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-amber-400/60" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-emerald-500/50" aria-hidden />
        <span className="ml-auto font-sans text-[9px] uppercase tracking-[0.35em] text-mist-500">
          Frame
        </span>
      </div>

      <div className="relative px-3 pb-1 pt-3 sm:px-4 sm:pt-4">
        {/* film sprockets */}
        <div
          className="pointer-events-none absolute bottom-4 left-1 top-4 flex w-2 flex-col justify-between py-2 sm:left-1.5"
          aria-hidden
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="mx-auto block h-1.5 w-2 rounded-[1px] bg-midnight-800/90"
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute bottom-4 right-1 top-4 flex w-2 flex-col justify-between py-2 sm:right-1.5"
          aria-hidden
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="mx-auto block h-1.5 w-2 rounded-[1px] bg-midnight-800/90"
            />
          ))}
        </div>

        <div className="mx-auto aspect-square overflow-hidden border border-white/15 bg-black shadow-[0_0_0_1px_rgba(0,0,0,0.85),inset_0_0_32px_rgba(0,0,0,0.35)]">
          {img}
        </div>
      </div>

      <CaptionBelow caption={cap} frame="cinema" />
    </div>
  );
}
