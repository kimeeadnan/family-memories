import { redirect } from "next/navigation";
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
    <main className="min-h-screen px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
      <header className="mx-auto mb-10 max-w-4xl">
        <Link
          href="/gallery"
          className="group inline-flex items-center gap-2 text-sm font-medium text-regal-300 transition hover:text-mist-100"
        >
          <span
            className="inline-block transition group-hover:-translate-x-0.5"
            aria-hidden
          >
            ←
          </span>
          Back to albums
        </Link>
      </header>
      <AlbumPhotos albumId={id} />
    </main>
  );
}
