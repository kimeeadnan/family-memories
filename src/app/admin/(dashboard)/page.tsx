import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen p-6 bg-sky-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-sky-800 mb-6">
          Admin — Family Memories
        </h1>
        <nav className="space-y-2">
          <Link
            href="/admin/albums"
            className="block p-4 rounded-xl bg-white border border-sky-200 text-sky-800 font-medium hover:bg-sky-50 hover:border-sky-300 transition"
          >
            Manage albums
          </Link>
          <Link
            href="/gallery"
            className="block p-4 rounded-xl bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition"
          >
            View as family
          </Link>
        </nav>
      </div>
    </main>
  );
}
