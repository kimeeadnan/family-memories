import Link from "next/link";
import AdminAlbumUpload from "@/components/AdminAlbumUpload";

export default async function AdminAlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-screen p-6 bg-sky-50">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link
            href="/admin/albums"
            className="text-sky-600 hover:text-sky-800 transition"
          >
            ← Back to albums
          </Link>
        </header>
        <AdminAlbumUpload albumId={id} />
      </div>
    </main>
  );
}
