import { redirect } from "next/navigation";
import { getFamilySession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await getFamilySession();
  if (session) {
    redirect("/gallery");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <LoginForm />
    </main>
  );
}
