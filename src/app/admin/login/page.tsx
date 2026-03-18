import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLoginForm from "@/components/AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <AdminLoginForm />
    </main>
  );
}
