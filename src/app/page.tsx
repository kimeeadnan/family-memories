import { redirect } from "next/navigation";
import { getFamilySession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getFamilySession();
  if (session) {
    redirect("/gallery");
  }
  redirect("/login");
}
