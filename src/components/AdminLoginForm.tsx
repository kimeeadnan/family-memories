"use client";

import { useState } from "react";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
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
      window.location.href = "/admin";
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md px-4 animate-fade-in">
      <div className="mb-6 text-center">
        <span className="inline-block rounded-full border border-champagne-400/20 bg-midnight-850/50 px-4 py-1 text-xs font-medium uppercase tracking-widest text-champagne-300/90">
          Administration
        </span>
      </div>
      <div className="panel-glass p-8 sm:p-10">
        <div className="rule-gold mb-5" />
        <h1 className="font-display text-center text-2xl font-semibold text-mist-50 sm:text-3xl">
          Curator access
        </h1>
        <p className="mt-2 text-center text-sm text-mist-400">
          Manage albums and uploads
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="focus-regal w-full rounded-xl border border-champagne-400/15 bg-midnight-950/50 px-4 py-3.5 text-mist-100 placeholder-mist-500"
            required
            autoFocus
          />
          {error && (
            <p className="text-center text-sm text-red-400/90">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-champagne-400/25 bg-midnight-800 py-3.5 font-semibold text-mist-100 transition hover:bg-midnight-750 hover:border-champagne-400/40 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
