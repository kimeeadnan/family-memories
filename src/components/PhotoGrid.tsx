"use client";

import { useState, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export type PhotoItem = {
  id: string;
  url: string | null;
  sort_order: number;
  caption: string | null;
  created_at: string;
};

type Props = {
  photos: PhotoItem[];
};

export default function PhotoGrid({ photos }: Props) {
  const [index, setIndex] = useState(-1);
  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(-1), []);

  const slides = photos
    .filter((p) => p.url)
    .map((p) => ({ src: p.url!, alt: p.caption ?? undefined }));

  const getSlideIndex = (photoIndex: number) => {
    return photos
      .slice(0, photoIndex + 1)
      .filter((p) => p.url).length - 1;
  };

  if (!photos.length) {
    return (
      <p className="text-sky-600 text-center py-12">No photos in this album yet.</p>
    );
  }

  return (
    <>
      <div
        className="columns-2 sm:columns-3 gap-3 space-y-3"
        style={{ columnFill: "balance" }}
      >
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => photo.url && open(getSlideIndex(i))}
            className="break-inside-avoid block w-full rounded-xl overflow-hidden border border-sky-200 bg-white shadow-sm hover:shadow-md hover:border-sky-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
          >
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.caption ?? ""}
                className="w-full h-auto object-cover hover:brightness-110 transition"
              />
            ) : null}
          </button>
        ))}
      </div>
      <Lightbox
        open={index >= 0}
        close={close}
        index={index}
        slides={slides}
        carousel={{ finite: photos.length <= 1 }}
      />
    </>
  );
}
