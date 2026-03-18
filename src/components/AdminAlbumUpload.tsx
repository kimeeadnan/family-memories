"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type Props = { albumId: string };

type Album = { id: string; title: string };
type Photo = { id: string; url: string | null; caption: string | null };

export default function AdminAlbumUpload({ albumId }: Props) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [captionDrafts, setCaptionDrafts] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingCaptionId, setSavingCaptionId] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
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
      const normalizedPhotos = Array.isArray(photosData) ? photosData : [];
      setPhotos(normalizedPhotos);
      setCaptionDrafts(
        Object.fromEntries(
          normalizedPhotos.map((p) => [p.id, (p.caption ?? "") as string])
        )
      );
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

  async function saveCaption(photoId: string) {
    setError("");
    setSavingCaptionId(photoId);
    try {
      const draft = captionDrafts[photoId] ?? "";
      const caption =
        draft.trim().length > 0 ? draft.trim().slice(0, 3000) : null;

      const res = await fetch(`/api/albums/${albumId}/photos/${photoId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Save failed");
        return;
      }

      await load();
    } catch {
      setError("Save failed");
    } finally {
      setSavingCaptionId(null);
    }
  }

  async function deletePhoto(photoId: string) {
    if (!window.confirm("Delete this photo? This cannot be undone.")) return;
    setError("");
    setDeletingPhotoId(photoId);
    try {
      const res = await fetch(`/api/albums/${albumId}/photos/${photoId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Delete failed");
        return;
      }

      await load();
    } catch {
      setError("Delete failed");
    } finally {
      setDeletingPhotoId(null);
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => (
              <div
                key={p.id}
                className="space-y-3 rounded-xl border border-champagne-400/10 bg-midnight-900/35 p-3 shadow-glass"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg border border-champagne-400/10 bg-midnight-900">
                  {p.url ? (
                    <img
                      src={p.url}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 hover:brightness-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-mist-600">
                      —
                    </div>
                  )}
                  {deletingPhotoId === p.id ? (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-midnight-950/40">
                      <div className="h-8 w-8 rounded-full border-2 border-champagne-400/30 border-t-regal-400 animate-spin" />
                    </div>
                  ) : null}
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-champagne-400/70">
                    Description / moment
                  </p>
                  <textarea
                    rows={2}
                    value={captionDrafts[p.id] ?? ""}
                    onChange={(e) =>
                      setCaptionDrafts((prev) => ({
                        ...prev,
                        [p.id]: e.target.value,
                      }))
                    }
                    placeholder="e.g. Raya 2024, Family Day..."
                    disabled={savingCaptionId === p.id || deletingPhotoId === p.id}
                    className="focus-regal w-full resize-none rounded-lg border border-champagne-400/15 bg-midnight-950/35 px-3 py-2 text-sm text-mist-100 placeholder-mist-500 disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => saveCaption(p.id)}
                    disabled={savingCaptionId === p.id || deletingPhotoId === p.id}
                    className="rounded-full border border-champagne-400/20 bg-midnight-900/30 px-4 py-2 text-sm text-mist-100 shadow-glass hover:border-champagne-400/35 disabled:opacity-50"
                  >
                    {savingCaptionId === p.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePhoto(p.id)}
                    disabled={deletingPhotoId === p.id || savingCaptionId === p.id}
                    className="rounded-full border border-red-400/25 bg-red-400/10 px-4 py-2 text-sm text-red-200 shadow-glass hover:border-red-400/40 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
