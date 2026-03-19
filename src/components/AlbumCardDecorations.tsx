"use client";

/** Alya / Alyas — baby girl: roses, bows + extra baby motifs (duck, rattle, moon, etc.) */
export function BabyGirlThemeDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,200,230,0.35),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_70%,rgba(230,210,255,0.28),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,245,200,0.12),transparent_40%)]" />

      {/* rose cluster */}
      <svg
        className="absolute -right-3 top-6 h-32 w-32 text-rose-400/55"
        viewBox="0 0 120 120"
        fill="currentColor"
      >
        <circle cx="78" cy="32" r="11" />
        <circle cx="62" cy="26" r="9" opacity="0.9" />
        <circle cx="70" cy="44" r="8" opacity="0.85" />
        <circle cx="52" cy="38" r="7" opacity="0.75" />
        <circle cx="88" cy="44" r="6" opacity="0.65" />
      </svg>

      {/* bow */}
      <svg
        className="absolute left-[8%] top-[26%] h-14 w-20 text-pink-300/50"
        viewBox="0 0 80 56"
        fill="currentColor"
      >
        <ellipse cx="22" cy="28" rx="18" ry="14" />
        <ellipse cx="58" cy="28" rx="18" ry="14" />
        <rect x="34" y="22" width="12" height="14" rx="2" />
      </svg>

      {/* rubber duck */}
      <svg
        className="absolute left-[6%] top-[12%] h-11 w-14 text-amber-300/50"
        viewBox="0 0 56 44"
        fill="currentColor"
      >
        <ellipse cx="28" cy="26" rx="18" ry="14" />
        <circle cx="38" cy="18" r="9" />
        <polygon points="46,20 52,22 46,24" fill="rgba(251,191,36,0.65)" />
        <circle cx="41" cy="16" r="2" fill="rgba(55,40,30,0.45)" />
      </svg>

      {/* rattle */}
      <svg
        className="absolute right-[8%] top-[38%] h-14 w-10 text-pink-200/55"
        viewBox="0 0 40 56"
        fill="currentColor"
      >
        <rect x="17" y="22" width="6" height="28" rx="2" opacity="0.85" />
        <circle cx="20" cy="14" r="11" />
        <circle cx="20" cy="14" r="6" fill="rgba(255,255,255,0.35)" />
        <circle cx="16" cy="11" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="24" cy="16" r="1.8" fill="rgba(255,255,255,0.45)" />
      </svg>

      {/* moon + lullaby stars */}
      <svg
        className="absolute right-[14%] top-[10%] h-16 w-16 text-violet-200/45"
        viewBox="0 0 64 64"
        fill="currentColor"
      >
        <path
          d="M44 10c-10 2-18 11-18 22s8 20 18 22c-8-5-14-14-14-24s6-19 14-24z"
          opacity="0.9"
        />
        <path d="M12 18l2 4 4 1-4 3 1 4-3-3-4 1 3-4-3-3 4 1z" opacity="0.55" />
        <path d="M22 48l1.5 3 3 0.8-3 2.2 0.8 3-2.7-2.5-3 0.9 2.4-2.8-2.8-2.4 3 1z" opacity="0.45" />
      </svg>

      {/* tiny footprints */}
      <svg
        className="absolute bottom-[36%] left-[18%] h-10 w-14 text-rose-300/35"
        viewBox="0 0 56 40"
        fill="currentColor"
      >
        <ellipse cx="14" cy="28" rx="6" ry="4" transform="rotate(-20 14 28)" />
        <ellipse cx="22" cy="22" rx="3.5" ry="5" transform="rotate(8 22 22)" />
        <ellipse cx="38" cy="26" rx="6" ry="4" transform="rotate(15 38 26)" />
        <ellipse cx="46" cy="20" rx="3.5" ry="5" transform="rotate(-5 46 20)" />
      </svg>

      {/* pacifier */}
      <svg
        className="absolute bottom-[14%] left-[12%] h-9 w-12 text-sky-200/45"
        viewBox="0 0 48 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="24" cy="14" r="9" fill="rgba(186,230,253,0.25)" />
        <path d="M15 14H9M33 14h6" strokeLinecap="round" />
        <path d="M12 22c4 6 20 6 24 0" opacity="0.7" />
      </svg>

      {/* teddy-ish round ears (soft) */}
      <svg
        className="absolute bottom-[18%] right-[18%] h-12 w-14 text-amber-200/35"
        viewBox="0 0 56 48"
        fill="currentColor"
      >
        <circle cx="16" cy="18" r="12" />
        <circle cx="40" cy="18" r="12" />
        <ellipse cx="28" cy="32" rx="14" ry="12" opacity="0.85" />
        <ellipse cx="28" cy="34" rx="5" ry="4" fill="rgba(253,230,200,0.5)" />
      </svg>

      {/* pearls arc */}
      <svg
        className="absolute bottom-[30%] right-[12%] h-14 w-24 text-rose-100/55"
        viewBox="0 0 96 64"
        fill="currentColor"
      >
        <circle cx="12" cy="48" r="4" />
        <circle cx="28" cy="36" r="4.5" />
        <circle cx="48" cy="28" r="5" />
        <circle cx="68" cy="34" r="4.5" />
        <circle cx="84" cy="46" r="4" />
      </svg>

      {/* butterfly */}
      <svg
        className="absolute left-[12%] bottom-[22%] h-11 w-11 text-fuchsia-300/38"
        viewBox="0 0 48 48"
        fill="currentColor"
      >
        <ellipse cx="18" cy="24" rx="14" ry="10" transform="rotate(-25 18 24)" />
        <ellipse cx="30" cy="24" rx="14" ry="10" transform="rotate(25 30 24)" />
        <rect x="22" y="18" width="4" height="14" rx="1" fill="rgba(244,114,182,0.45)" />
      </svg>

      <span
        className="absolute right-[26%] top-[22%] text-base text-pink-400/42"
        style={{ transform: "rotate(6deg)" }}
      >
        ♡
      </span>
      <span
        className="absolute left-[42%] top-[8%] text-xs text-amber-200/50"
        aria-hidden
      >
        ✦
      </span>
    </div>
  );
}

/** Hana — lush flowers & botanicals */
export function HanaFlowerDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(255,220,220,0.2),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_30%,rgba(200,230,200,0.22),transparent_50%)]" />

      {/* large peony-style bloom */}
      <svg
        className="absolute -left-4 top-10 h-36 w-36 text-rose-300/45"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <circle cx="50" cy="42" r="14" opacity="0.9" />
        <ellipse cx="32" cy="48" rx="12" ry="16" transform="rotate(-35 32 48)" />
        <ellipse cx="68" cy="48" rx="12" ry="16" transform="rotate(35 68 48)" />
        <ellipse cx="50" cy="62" rx="16" ry="12" />
        <circle cx="50" cy="46" r="6" fill="rgba(254,243,199,0.55)" />
      </svg>

      {/* cherry blossom branch feel */}
      <svg
        className="absolute -right-2 top-4 h-40 w-40 text-pink-200/50"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path
          d="M70 8 Q85 25 78 45 Q72 60 55 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
        <circle cx="82" cy="22" r="5" />
        <circle cx="74" cy="32" r="4" />
        <circle cx="88" cy="36" r="4.5" />
        <circle cx="68" cy="48" r="3.5" />
        <circle cx="58" cy="58" r="4" />
      </svg>

      {/* small daisies bottom */}
      <svg
        className="absolute bottom-8 left-[20%] h-20 w-20 text-amber-200/45"
        viewBox="0 0 80 80"
        fill="currentColor"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <ellipse
            key={i}
            cx="40"
            cy="18"
            rx="6"
            ry="14"
            transform={`rotate(${deg} 40 40)`}
            opacity={0.85 - i * 0.05}
          />
        ))}
        <circle cx="40" cy="40" r="8" fill="rgba(252,211,77,0.65)" />
      </svg>

      {/* leaves */}
      <svg
        className="absolute bottom-[12%] right-[8%] h-24 w-20 text-emerald-600/25"
        viewBox="0 0 60 72"
        fill="currentColor"
      >
        <ellipse cx="30" cy="20" rx="10" ry="22" transform="rotate(-15 30 20)" />
        <ellipse cx="38" cy="44" rx="8" ry="18" transform="rotate(25 38 44)" />
      </svg>
    </div>
  );
}

/** Soft florals + bottle for generic baby albums */
export function BabyThemeDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
      aria-hidden
    >
      {/* corner blooms */}
      <svg
        className="absolute -right-1 top-8 h-24 w-24 text-pink-300/50"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <circle cx="72" cy="28" r="9" opacity="0.85" />
        <circle cx="58" cy="22" r="7" opacity="0.7" />
        <circle cx="64" cy="38" r="6" opacity="0.65" />
        <circle cx="48" cy="32" r="5" opacity="0.55" />
        <circle cx="78" cy="42" r="5" opacity="0.5" />
      </svg>
      <svg
        className="absolute -left-2 bottom-16 h-28 w-28 text-emerald-300/45"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <ellipse cx="30" cy="70" rx="10" ry="6" transform="rotate(-25 30 70)" />
        <ellipse cx="22" cy="62" rx="8" ry="5" transform="rotate(15 22 62)" />
        <ellipse cx="38" cy="58" rx="7" ry="4" transform="rotate(-8 38 58)" />
        <circle cx="28" cy="52" r="4" opacity="0.6" />
        <circle cx="42" cy="48" r="3" opacity="0.5" />
      </svg>
      {/* tiny hearts */}
      <span
        className="absolute left-[14%] top-[22%] text-lg text-rose-300/40"
        style={{ transform: "rotate(-12deg)" }}
      >
        ♥
      </span>
      <span
        className="absolute right-[18%] bottom-[38%] text-sm text-violet-300/35"
        style={{ transform: "rotate(8deg)" }}
      >
        ♥
      </span>
      {/* bottle silhouette — simple rounded */}
      <svg
        className="absolute left-[10%] top-[40%] h-10 w-6 text-sky-200/35"
        viewBox="0 0 24 40"
        fill="currentColor"
      >
        <rect x="8" y="4" width="8" height="6" rx="2" />
        <path d="M6 12h12v22a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V12z" opacity="0.9" />
      </svg>
      {/* soft vignette */}
      <div className="absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,220,235,0.25),transparent_55%)]" />
      <div className="absolute inset-0 rounded-sm bg-[radial-gradient(ellipse_at_80%_80%,rgba(200,230,210,0.2),transparent_50%)]" />
    </div>
  );
}

/** Crescent, stars, subtle ketupat hint for Raya / Eid */
export function EidThemeDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_100%,rgba(26,107,74,0.08),transparent_45%)]" />

      {/* stars */}
      <svg
        className="absolute left-[8%] top-[12%] h-8 w-8 text-amber-400/50"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l2.2 6.8h7.1l-5.7 4.1 2.2 6.8-6-4.4-6 4.4 2.2-6.8-5.7-4.1h7.1z" />
      </svg>
      <svg
        className="absolute right-[12%] top-[20%] h-5 w-5 text-amber-300/45"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l2.2 6.8h7.1l-5.7 4.1 2.2 6.8-6-4.4-6 4.4 2.2-6.8-5.7-4.1h7.1z" />
      </svg>
      <svg
        className="absolute bottom-[32%] left-[6%] h-6 w-6 text-emerald-600/25"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l2.2 6.8h7.1l-5.7 4.1 2.2 6.8-6-4.4-6 4.4 2.2-6.8-5.7-4.1h7.1z" />
      </svg>

      {/* crescent */}
      <svg
        className="absolute right-[6%] bottom-[14%] h-16 w-16 text-amber-500/35"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M46 12c-12 0-22 10-22 22s10 22 22 22c-6-4-10-11-10-19 0-10 4-18 10-25z"
          fill="currentColor"
        />
      </svg>

      {/* woven diamond (ketupat-inspired) */}
      <svg
        className="absolute left-[12%] bottom-[12%] h-14 w-14 text-emerald-700/30"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M24 6l16 16-16 16L8 22z" />
        <path d="M24 6v36M8 22h32" opacity="0.6" />
        <path d="M16 14l16 16M32 14L16 30" opacity="0.45" />
      </svg>

      {/* gold filigree line */}
      <div
        className="absolute left-4 right-4 top-[18%] h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent"
        aria-hidden
      />
    </div>
  );
}
