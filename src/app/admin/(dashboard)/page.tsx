import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-xl">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-champagne-400/70">
          Dashboard
        </p>
        <h1 className="font-display text-3xl font-semibold text-mist-50">
          Family Memories
        </h1>
        <div className="rule-gold mt-4 !mx-0 w-20" />
        <nav className="mt-10 space-y-4">
          <Link
            href="/admin/albums"
            className="group block rounded-2xl border border-champagne-400/20 bg-midnight-850/50 p-6 shadow-card backdrop-blur-sm transition hover:border-champagne-400/35 hover:bg-midnight-800/60"
          >
            <span className="font-display text-lg text-mist-100 group-hover:text-mist-50">
              Manage albums
            </span>
            <p className="mt-1 text-sm text-mist-400">
              Create albums and upload photos
            </p>
          </Link>
          <Link
            href="/gallery"
            className="block rounded-2xl border border-regal-500/20 bg-regal-600/10 p-6 text-center font-medium text-regal-200 transition hover:bg-regal-600/20 hover:text-mist-50"
          >
            View as family →
          </Link>
        </nav>
      </div>
    </main>
  );
}
