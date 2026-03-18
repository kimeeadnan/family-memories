"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-champagne-400/20 bg-midnight-850/40 px-4 py-2 text-sm font-medium text-mist-200 transition hover:border-champagne-400/35 hover:bg-midnight-800/60 hover:text-mist-50"
    >
      Sign out
    </button>
  );
}
