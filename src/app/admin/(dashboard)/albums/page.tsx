import Link from "next/link";
import AdminAlbumsList from "@/components/AdminAlbumsList";

export default function AdminAlbumsPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/admin"
            className="text-sm font-medium text-regal-300 transition hover:text-mist-100"
          >
            ← Dashboard
          </Link>
        </header>
        <h1 className="font-display text-2xl font-semibold text-mist-50 sm:text-3xl">
          Manage albums
        </h1>
        <p className="mt-2 text-sm text-mist-400">
          Create a new album, then open it to add photos.
        </p>
        <div className="rule-gold mt-6 !mx-0 w-16" />
        <div className="mt-10">
          <AdminAlbumsList />
        </div>
      </div>
    </main>
  );
}
