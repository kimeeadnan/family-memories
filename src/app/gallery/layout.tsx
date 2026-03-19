import { redirect } from "next/navigation";
import { getFamilySession } from "@/lib/auth";
import GalleryMusicPlayer from "@/components/GalleryMusicPlayer";

export default async function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getFamilySession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      {children}
      <GalleryMusicPlayer />
    </>
  );
}
