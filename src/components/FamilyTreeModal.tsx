"use client";

import { useEffect, useState } from "react";

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3l-4 7h2.5L6 15h3l-3.5 6h15l-3.5-6h3l-4.5-5H16L12 3z" />
    </svg>
  );
}

function Node({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="rounded-xl border border-champagne-400/25 bg-midnight-850/80 px-3 py-2 text-center shadow-sm backdrop-blur-sm">
      <div className="font-display text-sm font-semibold text-mist-100 sm:text-base">
        {children}
      </div>
      {subtitle ? (
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-champagne-400/70">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

export default function FamilyTreeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne-400/30 bg-midnight-850/70 text-champagne-300/90 shadow-glass transition hover:border-champagne-400/50 hover:bg-midnight-800/80 hover:text-champagne-200 focus-regal"
        aria-label="View family tree"
      >
        <TreeIcon className="h-4 w-4" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="family-tree-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-midnight-950/85 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-champagne-400/20 bg-midnight-900/95 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="family-tree-title"
                  className="font-display text-xl font-semibold text-mist-50 sm:text-2xl"
                >
                  Family tree
                </h2>
                <p className="mt-1 text-sm text-mist-400">Adnan&apos;s family</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-champagne-400/20 px-3 py-1.5 text-sm text-mist-300 transition hover:bg-midnight-800 hover:text-mist-100"
              >
                Close
              </button>
            </div>

            {/* Tree: Humaidi → Hana | Alya | Adnan+Hapizah → Hafiz, Hakimi */}
            <div className="family-tree mx-auto text-mist-200">
              <div className="flex flex-col items-center">
                <Node>Humaidi</Node>
                <div className="tree-vline h-6 w-px bg-champagne-400/35" />
                <div className="relative flex w-full max-w-xl justify-center">
                  <div className="absolute left-[12%] right-[12%] top-0 h-px bg-champagne-400/35 sm:left-[10%] sm:right-[10%]" />
                  <div className="relative z-[1] flex w-full justify-between gap-1 px-0 sm:gap-2 sm:px-2">
                    <div className="flex flex-1 flex-col items-center">
                      <div className="h-6 w-px bg-champagne-400/35" />
                      <Node>Hana</Node>
                    </div>
                    <div className="flex flex-1 flex-col items-center">
                      <div className="h-6 w-px bg-champagne-400/35" />
                      <Node>Alya</Node>
                    </div>
                    <div className="flex flex-[1.4] flex-col items-center sm:flex-[1.6]">
                      <div className="h-6 w-px bg-champagne-400/35" />
                      <div className="flex w-full flex-wrap items-stretch justify-center gap-2">
                        <Node subtitle="Dad">Adnan</Node>
                        <div className="hidden self-center text-champagne-400/50 sm:block" aria-hidden>
                          ·
                        </div>
                        <Node subtitle="Mom">Hapizah</Node>
                      </div>
                      <div className="mt-3 flex flex-col items-center">
                        <div className="h-5 w-px bg-champagne-400/35" />
                        <div className="h-px w-[min(12rem,50vw)] bg-champagne-400/35" />
                        <div className="flex w-full max-w-xs justify-center gap-4 sm:gap-8">
                          <div className="flex flex-col items-center">
                            <div className="h-5 w-px bg-champagne-400/35" />
                            <Node subtitle="Son">Hafiz</Node>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-5 w-px bg-champagne-400/35" />
                            <Node subtitle="Son">Hakimi</Node>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
