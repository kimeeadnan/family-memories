"use client";

import Link from "next/link";

export type Album = {
  id: string;
  title: string;
  created_at: string;
  sort_order?: number;
};

type SurfaceProps = {
  album: Album;
  className?: string;
  /** list = grid cards (hover hint); stack = swipe deck */
  variant?: "list" | "stack";
};

function seedFromId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const WASHI = [
  { from: "#e8a598", to: "#f5d4c8" },
  { from: "#9ec5e8", to: "#d4e8f7" },
  { from: "#c4e0a8", to: "#e8f2d4" },
  { from: "#d4b8e8", to: "#efe4f7" },
  { from: "#f0d878", to: "#f8ecc0" },
];

/** Shared album “tape & frame” visuals — use inside Link or stack. */
export function AlbumCardSurface({
  album,
  className = "",
  variant = "list",
}: SurfaceProps) {
  const seed = seedFromId(album.id);
  const tilt = ((seed % 11) - 5) * 0.35;
  const washiA = WASHI[seed % WASHI.length];
  const washiB = WASHI[(seed + 2) % WASHI.length];

  return (
    <div
      className={`relative mx-auto max-w-md ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div
        className="absolute -bottom-1 left-3 right-3 top-3 rounded-sm bg-midnight-950/50 blur-[2px]"
        aria-hidden
      />
      <div
        className="absolute -bottom-0.5 left-2 right-2 top-4 rounded-sm bg-midnight-900/40"
        aria-hidden
      />

      <article className="relative overflow-hidden rounded-sm border border-champagne-500/25 shadow-[0_18px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]">
        <div className="album-cover-paper relative aspect-[4/3.35] p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -left-1 top-3 h-7 w-[42%] rotate-[-4deg] rounded-[2px] opacity-90 shadow-sm"
            style={{
              background: `linear-gradient(180deg, ${washiA.from}cc, ${washiA.to}dd)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-2 top-[18%] h-6 w-[38%] rotate-[5deg] rounded-[2px] opacity-88 shadow-sm"
            style={{
              background: `linear-gradient(180deg, ${washiB.from}cc, ${washiB.to}dd)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
            aria-hidden
          />

          <div className="relative mx-auto flex h-full max-h-[min(78%,220px)] flex-col items-center justify-center">
            <div className="relative w-full max-w-[88%] rounded-[3px] border-[10px] border-[#faf6ef] bg-[#f0ebe3] shadow-[0_4px_14px_rgba(45,35,25,0.12),inset_0_0_0_1px_rgba(74,55,40,0.06)]">
              <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 px-4 py-8 sm:min-h-[140px] sm:py-10">
                <svg
                  className="absolute left-2 top-2 h-5 w-5 text-[#8b7355]/45"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden
                >
                  <path d="M8 4H4v4M16 4h4v4M4 16v4h4M20 16v4h-4" />
                </svg>
                <svg
                  className="absolute bottom-2 right-2 h-5 w-5 text-[#8b7355]/45"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden
                >
                  <path d="M8 4H4v4M16 4h4v4M4 16v4h4M20 16v4h-4" />
                </svg>

                <span
                  className="font-marker text-center text-[1.35rem] leading-snug tracking-wide text-[#3d2f24] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)] sm:text-2xl"
                  style={{
                    transform: `rotate(${((seed % 5) - 2) * 0.4}deg)`,
                  }}
                >
                  {album.title}
                </span>

                <span className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-[#6b5344]/70">
                  Album
                </span>
              </div>
            </div>

            <div
              className="absolute -top-1 right-[12%] h-8 w-3 rounded-sm border border-[#9a8b78]/35 bg-gradient-to-b from-[#d4cec4] to-[#b8aea2] shadow-md"
              aria-hidden
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-[#c9b8a4]/35 bg-gradient-to-t from-[#e5dccf]/90 to-transparent px-4 py-3">
            <p
              className={
                variant === "list"
                  ? "text-center font-sans text-xs text-[#5c4a3d]/85 transition group-hover:text-[#4a3728]"
                  : "text-center font-sans text-xs text-[#5c4a3d]/85"
              }
            >
              {variant === "list"
                ? "Open album →"
                : "Tap to open · Swipe for another album"}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

type Props = {
  album: Album;
  index: number;
};

export default function AlbumCard({ album, index }: Props) {
  return (
    <Link
      href={`/gallery/${album.id}`}
      className="group album-card-link animate-slide-up block focus-regal outline-none"
      style={{
        animationDelay: `${index * 70}ms`,
        animationFillMode: "backwards",
      }}
    >
      <div className="transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:scale-[1.02]">
        <AlbumCardSurface album={album} variant="list" />
      </div>
    </Link>
  );
}
