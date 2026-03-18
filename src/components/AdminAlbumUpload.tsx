"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
        <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error && !album) {
    return (
      <div className="text-center py-12 text-sky-600">
        {error}
        <Link href="/admin/albums" className="block mt-4 text-sky-600 underline">
          Back to albums
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-sky-800">
        {album?.title ?? "Album"}
      </h1>
      <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-sky-300 text-center">
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
          className="cursor-pointer block text-sky-700 hover:text-sky-800 transition"
        >
          {uploading ? (
            <span className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              {progress}
            </span>
          ) : (
            <>
              <span className="text-4xl block mb-2">📷</span>
              <span className="font-medium">Drop or select photos to upload</span>
            </>
          )}
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {photos.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-sky-800 mb-3">
            Photos in this album ({photos.length})
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p) => (
              <div
                key={p.id}
                className="aspect-square rounded-lg overflow-hidden bg-sky-100"
              >
                {p.url ? (
                  <img
                    src={p.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sky-400">
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
