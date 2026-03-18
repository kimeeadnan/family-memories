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
      className="block group rounded-2xl overflow-hidden border border-sky-200 bg-white shadow-sm hover:shadow-md hover:border-sky-300 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      <div className="aspect-[4/3] bg-sky-100 relative overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sky-400">
            <svg
              className="w-16 h-16"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-sky-800 group-hover:text-sky-700 truncate">
          {album.title}
        </h2>
      </div>
    </Link>
  );
}
