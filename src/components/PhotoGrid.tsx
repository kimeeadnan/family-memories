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
    return (
      photos.slice(0, photoIndex + 1).filter((p) => p.url).length - 1
    );
  };

  if (!photos.length) {
    return (
      <p className="py-16 text-center text-mist-400">
        No photos in this album yet.
      </p>
    );
  }

  return (
    <>
      <div
        className="columns-2 gap-4 space-y-4 sm:columns-3"
        style={{ columnFill: "balance" }}
      >
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => photo.url && open(getSlideIndex(i))}
            className="focus-regal animate-fade-in break-inside-avoid block w-full overflow-hidden rounded-xl border border-champagne-400/15 bg-midnight-900/50 shadow-card transition-all duration-300 hover:border-champagne-400/30 hover:shadow-lg focus:ring-offset-midnight-900"
            style={{
              animationDelay: `${i * 40}ms`,
              animationFillMode: "backwards",
            }}
          >
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.caption ?? ""}
                className="w-full object-cover transition duration-300 hover:brightness-110"
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
