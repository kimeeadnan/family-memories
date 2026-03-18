"use client";

import Link from "next/link";

export type Album = {
  id: string;
  title: string;
  created_at: string;
};

type Props = {
  album: Album;
  index: number;
  coverUrl?: string | null;
};

export default function AlbumCard({ album, index, coverUrl }: Props) {
  return (
    <Link
      href={`/gallery/${album.id}`}
      className="group animate-slide-up block overflow-hidden rounded-2xl border border-champagne-400/15 bg-midnight-850/40 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-champagne-400/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      style={{
        animationDelay: `${index * 70}ms`,
        animationFillMode: "backwards",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-midnight-900">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-midnight-800 to-midnight-900 text-regal-500/40">
            <svg
              className="h-16 w-16"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="font-display text-lg font-semibold text-mist-50 drop-shadow-sm sm:text-xl">
            {album.title}
          </h2>
          <p className="mt-0.5 text-xs text-mist-300/80">Open album →</p>
        </div>
      </div>
    </Link>
  );
}
