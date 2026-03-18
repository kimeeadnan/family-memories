import Link from "next/link";
import AdminAlbumUpload from "@/components/AdminAlbumUpload";

export default async function AdminAlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <Link
            href="/admin/albums"
            className="text-sm font-medium text-regal-300 transition hover:text-mist-100"
          >
            ← All albums
          </Link>
        </header>
        <AdminAlbumUpload albumId={id} />
      </div>
    </main>
  );
}
