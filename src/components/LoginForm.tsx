"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      try {
        sessionStorage.setItem("family_memories_welcome_music", "1");
      } catch {
        /* private mode / blocked storage */
      }
      window.location.href = "/gallery";
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md px-4 animate-fade-in">
      {/* Ornament widget */}
      <div className="mb-8 flex flex-col items-center text-champagne-300/80">
        <div className="mb-3 flex items-center gap-3 text-center text-xs tracking-wide text-champagne-300/90">
          <span className="h-px w-6 shrink-0 bg-gradient-to-r from-transparent to-champagne-400/40" />
          <span className="max-w-[14rem] leading-snug sm:max-w-none">
            By Hakimi Adnan
          </span>
          <span className="h-px w-6 shrink-0 bg-gradient-to-l from-transparent to-champagne-400/40" />
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border border-champagne-400/25 bg-midnight-850/60 font-display text-2xl font-semibold text-regal-300 shadow-card backdrop-blur-sm"
          aria-hidden
        >
          H
        </div>
      </div>

      <div className="panel-glass animate-slide-up overflow-hidden p-8 sm:p-10">
        <div className="rule-gold mb-6" />
        <h1 className="font-display text-center text-3xl font-semibold tracking-tight text-mist-50 sm:text-4xl">
          Family Memories
        </h1>
        <p className="mt-2 text-center text-sm text-mist-300">
          A private collection —{" "}
          <span className="font-bold text-mist-50">Adnan&apos;s family</span>
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="family-pw"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist-400"
            >
              Password
            </label>
            <input
              id="family-pw"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="focus-regal w-full rounded-xl border border-champagne-400/15 bg-midnight-950/50 px-4 py-3.5 text-mist-100 placeholder-mist-500 transition hover:border-champagne-400/25"
              required
              autoFocus
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-mist-500/80">
                Family only — no admin access.
              </span>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-lg border border-champagne-400/20 bg-midnight-900/40 px-3 py-2 text-xs font-medium text-mist-100 transition hover:bg-midnight-900/60"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-center text-sm text-red-400/90">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-champagne-400/20 bg-gradient-to-b from-regal-500/90 to-regal-600 py-3.5 font-semibold text-midnight-950 shadow-lg transition hover:from-regal-400 hover:to-regal-500 disabled:opacity-50"
          >
            {loading ? "Entering…" : "Enter the gallery"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-mist-500">
          With love, for family eyes only
        </p>
      </div>
    </div>
  );
}
