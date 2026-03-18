import { redirect } from "next/navigation";
import { getFamilySession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await getFamilySession();
  if (session) {
    redirect("/gallery");
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}
