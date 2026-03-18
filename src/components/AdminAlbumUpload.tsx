"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type Props = { albumId: string };

type Album = { id: string; title: string };
type Photo = { id: string; url: string | null; caption: string | null };

export default function AdminAlbumUpload({ albumId }: Props) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const [albumRes, photosRes] = await Promise.all([
        fetch(`/api/albums/${albumId}`, { credentials: "include" }),
        fetch(`/api/albums/${albumId}/photos`, { credentials: "include" }),
      ]);
      if (!albumRes.ok) {
        setError("Album not found");
        setLoading(false);
        return;
      }
      const albumData = await albumRes.json();
      setAlbum(albumData);
      const photosData = photosRes.ok ? await photosRes.json() : [];
      setPhotos(Array.isArray(photosData) ? photosData : []);
    } catch {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [albumId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setError("");
    setUploading(true);
    setProgress(`Uploading ${files.length} file(s)…`);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      const res = await fetch(`/api/albums/${albumId}/photos`, {
        credentials: "include",
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload failed");
        return;
      }
      setProgress("Done!");
      await load();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      setProgress("");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 rounded-full border-2 border-champagne-400/30 border-t-regal-400 animate-spin" />
      </div>
    );
  }
  if (error && !album) {
    return (
      <div className="panel-glass py-10 text-center text-mist-300">
        {error}
        <Link
          href="/admin/albums"
          className="mt-4 block text-regal-300 hover:text-mist-100"
        >
          Back to albums
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-mist-50 sm:text-3xl">
          {album?.title ?? "Album"}
        </h1>
        <div className="rule-gold mt-4 !mx-0 w-16" />
      </div>

      <div className="panel-glass border-2 border-dashed border-champagne-400/25 p-10 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id="upload-photos"
        />
        <label
          htmlFor="upload-photos"
          className="cursor-pointer block text-mist-300 transition hover:text-mist-100"
        >
          {uploading ? (
            <span className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-champagne-400/30 border-t-regal-400 animate-spin" />
              <span className="text-sm text-regal-300">{progress}</span>
            </span>
          ) : (
            <>
              <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-champagne-400/20 bg-midnight-900/60 text-2xl text-regal-300">
                ✦
              </span>
              <span className="font-medium text-mist-100">
                Tap to select photos
              </span>
              <span className="mt-1 block text-sm text-mist-500">
                Multiple images supported
              </span>
            </>
          )}
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {photos.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg text-mist-200">
            In this album ({photos.length})
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((p) => (
              <div
                key={p.id}
                className="aspect-square overflow-hidden rounded-lg border border-champagne-400/10 bg-midnight-900"
              >
                {p.url ? (
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-mist-600">
                    —
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
