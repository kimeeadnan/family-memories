/**
 * Album cover look is chosen from the title (no DB field).
 * Adjust matchers anytime for new albums.
 */
export type AlbumVisualTheme =
  | "default"
  | "baby"
  | "babyGirl"
  | "eid"
  | "hana";

export type ThemeWashi = { from: string; to: string };

export type AlbumThemeTokens = {
  washiA: ThemeWashi;
  washiB: ThemeWashi;
  /** Inner “photo mat” */
  matBorder: string;
  matBg: string;
  matShadow: string;
  titleColor: string;
  subtitleColor: string;
  cornerIcon: string;
  articleBorder: string;
  articleShadow: string;
  footerBorder: string;
  footerBg: string;
  footerText: string;
};

/** Title contains “hana” as its own word (not “Johanna”). */
function titleHasHanaAsName(title: string): boolean {
  const t = title.trim().toLowerCase();
  return /(?:^|[\s_'-])hana(?:$|[\s_'-]|'s|’s)/i.test(t);
}

const BABY_TOKENS: AlbumThemeTokens = {
  washiA: { from: "#f8b8d0", to: "#ffe0ec" },
  washiB: { from: "#a8e6cf", to: "#d4f4e8" },
  matBorder: "#fff6f9",
  matBg: "linear-gradient(165deg, #fffafd 0%, #f5f0ff 45%, #fff8f2 100%)",
  matShadow:
    "0 6px 20px rgba(200, 120, 160, 0.12), inset 0 0 0 1px rgba(255, 182, 200, 0.25)",
  titleColor: "#5c3d4a",
  subtitleColor: "rgba(92, 61, 74, 0.65)",
  cornerIcon: "rgba(196, 120, 150, 0.4)",
  articleBorder: "rgba(255, 182, 200, 0.45)",
  articleShadow:
    "0 20px 56px rgba(80, 40, 60, 0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
  footerBorder: "rgba(248, 184, 208, 0.4)",
  footerBg: "linear-gradient(to top, rgba(255, 240, 248, 0.95), transparent)",
  footerText: "rgba(92, 61, 74, 0.82)",
};

/** Alyas — baby girl: rosier, softer pearls & bows */
const BABY_GIRL_TOKENS: AlbumThemeTokens = {
  washiA: { from: "#ff9ec5", to: "#ffd6e8" },
  washiB: { from: "#e8c4ff", to: "#f5e6ff" },
  matBorder: "#fff5fb",
  matBg:
    "linear-gradient(168deg, #fff8fc 0%, #ffeef8 35%, #f8f0ff 70%, #fff5f9 100%)",
  matShadow:
    "0 8px 26px rgba(220, 100, 150, 0.18), inset 0 0 0 1px rgba(255, 150, 190, 0.35)",
  titleColor: "#6b3d52",
  subtitleColor: "rgba(107, 61, 82, 0.68)",
  cornerIcon: "rgba(230, 130, 170, 0.45)",
  articleBorder: "rgba(255, 140, 180, 0.5)",
  articleShadow:
    "0 22px 58px rgba(90, 35, 55, 0.38), inset 0 1px 0 rgba(255,255,255,0.5)",
  footerBorder: "rgba(255, 160, 200, 0.45)",
  footerBg: "linear-gradient(to top, rgba(255, 245, 252, 0.97), transparent)",
  footerText: "rgba(107, 61, 82, 0.86)",
};

const EID_TOKENS: AlbumThemeTokens = {
  washiA: { from: "#c9a227", to: "#f5e6b8" },
  washiB: { from: "#1a6b4a", to: "#5cbf8a" },
  matBorder: "#fffef6",
  matBg: "linear-gradient(160deg, #fffef8 0%, #f8f4e8 40%, #eef8f0 100%)",
  matShadow:
    "0 6px 22px rgba(180, 140, 40, 0.15), inset 0 0 0 1px rgba(201, 162, 39, 0.2)",
  titleColor: "#1a3d2e",
  subtitleColor: "rgba(26, 61, 46, 0.68)",
  cornerIcon: "rgba(26, 107, 74, 0.38)",
  articleBorder: "rgba(201, 162, 39, 0.5)",
  articleShadow:
    "0 22px 60px rgba(30, 60, 40, 0.4), inset 0 1px 0 rgba(255,255,255,0.45)",
  footerBorder: "rgba(201, 162, 39, 0.35)",
  footerBg: "linear-gradient(to top, rgba(255, 252, 240, 0.96), transparent)",
  footerText: "rgba(26, 61, 46, 0.85)",
};

/** Hana — garden florals */
const HANA_TOKENS: AlbumThemeTokens = {
  washiA: { from: "#f0b8b8", to: "#fce2e2" },
  washiB: { from: "#9fd4a8", to: "#d4efd9" },
  matBorder: "#fffdf8",
  matBg:
    "linear-gradient(155deg, #fffef9 0%, #fff5f2 30%, #f3faf4 65%, #fef9ff 100%)",
  matShadow:
    "0 6px 24px rgba(120, 90, 100, 0.1), inset 0 0 0 1px rgba(200, 160, 170, 0.2)",
  titleColor: "#4a3d42",
  subtitleColor: "rgba(74, 61, 66, 0.7)",
  cornerIcon: "rgba(180, 120, 140, 0.42)",
  articleBorder: "rgba(220, 180, 190, 0.45)",
  articleShadow:
    "0 20px 54px rgba(60, 45, 50, 0.32), inset 0 1px 0 rgba(255,255,255,0.4)",
  footerBorder: "rgba(220, 190, 200, 0.4)",
  footerBg: "linear-gradient(to top, rgba(255, 250, 252, 0.95), transparent)",
  footerText: "rgba(74, 61, 66, 0.84)",
};

export function resolveAlbumVisualTheme(title: string): AlbumVisualTheme {
  const t = title.trim().toLowerCase();

  if (
    t === "testing" ||
    t === "test" ||
    t.startsWith("test ") ||
    t.includes("testing")
  ) {
    return "default";
  }

  // Raya 2025, Eid, etc.
  if (
    t.includes("raya") ||
    t.includes("eid") ||
    t.includes("lebaran") ||
    t.includes("hari raya") ||
    t.includes("syawal") ||
    t.includes("fitr")
  ) {
    return "eid";
  }

  // “Hana” as a name (whole word)
  if (titleHasHanaAsName(title)) {
    return "hana";
  }

  // Alya, Alya's album, Alyas, Aliyas — baby girl cover
  if (/\b(aliyas|alyas|alya)\b/i.test(title.trim())) {
    return "babyGirl";
  }

  // Other baby albums (not Alyas)
  if (
    t.includes(" baby") ||
    t.startsWith("baby ") ||
    t === "baby" ||
    t.includes("little one") ||
    t.includes("nursery")
  ) {
    return "baby";
  }

  return "default";
}

export function getAlbumThemeTokens(theme: AlbumVisualTheme): AlbumThemeTokens | null {
  if (theme === "baby") return BABY_TOKENS;
  if (theme === "babyGirl") return BABY_GIRL_TOKENS;
  if (theme === "eid") return EID_TOKENS;
  if (theme === "hana") return HANA_TOKENS;
  return null;
}
