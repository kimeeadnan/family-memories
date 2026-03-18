import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getFamilySession } from "@/lib/auth";
import AlbumPhotos from "@/components/AlbumPhotos";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getFamilySession();
  if (!session) {
    redirect("/login");
  }
  const { id } = await params;
  return (
    <main className="min-h-screen p-6 pb-20 bg-sky-50">
      <header className="max-w-4xl mx-auto mb-6 flex items-center gap-4">
        <Link
          href="/gallery"
          className="text-sky-600 hover:text-sky-800 transition flex items-center gap-1"
        >
          <span aria-hidden>←</span> Back
        </Link>
      </header>
      <AlbumPhotos albumId={id} />
    </main>
  );
}
