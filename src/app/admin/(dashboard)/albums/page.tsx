import Link from "next/link";
import AdminAlbumsList from "@/components/AdminAlbumsList";

export default function AdminAlbumsPage() {
  return (
    <main className="min-h-screen p-6 bg-sky-50">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="text-sky-600 hover:text-sky-800 transition"
          >
            ← Back
          </Link>
        </header>
        <h1 className="text-2xl font-semibold text-sky-800 mb-6">
          Manage albums
        </h1>
        <AdminAlbumsList />
      </div>
    </main>
  );
}
