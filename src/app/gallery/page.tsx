import { redirect } from "next/navigation";
import { getFamilySession } from "@/lib/auth";
import AlbumList from "@/components/AlbumList";
import FamilyTreeModal from "@/components/FamilyTreeModal";
import LogoutButton from "@/components/LogoutButton";

export default async function GalleryPage() {
  const session = await getFamilySession();
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <header className="mx-auto mb-12 flex max-w-4xl flex-col gap-6 border-b border-champagne-400/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-champagne-400/70">
            Our collection
          </p>
          <div className="flex items-end justify-between gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-mist-50 sm:text-4xl">
              Albums
            </h1>
            <FamilyTreeModal />
          </div>
          <div className="rule-gold mt-4 !mx-0 w-20" />
        </div>
        <LogoutButton />
      </header>
      <AlbumList />
      <footer className="mx-auto mt-20 max-w-4xl border-t border-champagne-400/10 pt-8 text-center text-xs text-mist-500">
        Family Memories · Private gallery
      </footer>
    </main>
  );
}
