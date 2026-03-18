"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid password");
        return;
      }
      // Full navigation so the session cookie is always sent on the next page
      window.location.href = "/gallery";
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <div className="rounded-2xl bg-white/80 shadow-lg border border-sky-200/60 p-8 animate-slide-up">
        <h1 className="text-2xl font-semibold text-sky-800 mb-2 text-center">
          Family Memories
        </h1>
        <p className="text-sky-600 text-sm text-center mb-6">
          Enter the family password to view
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 text-sky-900 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
            required
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? "Checking…" : "View memories"}
          </button>
        </form>
      </div>
    </div>
  );
}
