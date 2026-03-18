import { redirect } from "next/navigation";
import { getFamilySession } from "@/lib/auth";
import AlbumList from "@/components/AlbumList";
import LogoutButton from "@/components/LogoutButton";

export default async function GalleryPage() {
  const session = await getFamilySession();
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen p-6 pb-20 bg-sky-50">
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-sky-800">
          Family Memories
        </h1>
        <LogoutButton />
      </header>
      <AlbumList />
    </main>
  );
}
