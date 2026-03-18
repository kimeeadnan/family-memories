import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminLoginForm from "@/components/AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-sky-50">
      <AdminLoginForm />
    </main>
  );
}
