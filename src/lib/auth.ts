import { timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "family_memories_session";
export const ADMIN_COOKIE = "family_memories_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Use on NextResponse in Route Handlers (Vercel ignores cookies().set() there). */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "change-me-in-production"
);

export type SessionPayload = { role: "family"; exp: number };
export type AdminPayload = { role: "admin"; exp: number };

function normalizeB64(raw: string | undefined): string | undefined {
  if (!raw) return;
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s.replace(/\s/g, "");
}

function bcryptHashFromEnv(b64Name: string, plainName: string): string | null {
  const b64 = normalizeB64(process.env[b64Name]);
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      if (decoded.startsWith("$2") && decoded.length >= 50) return decoded;
    } catch {
      /* ignore */
    }
  }
  const plain = process.env[plainName]?.trim();
  return plain && plain.startsWith("$2") ? plain : null;
}

/** Normalize password strings (fullwidth digits, BOM, ZW*, etc.) */
export function normalizePasswordString(value: string | undefined): string {
  if (value == null) return "";
  let s = String(value).normalize("NFKC").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  s = s.replace(/\u200b/g, "");
  s = s.replace(/\ufeff/g, "");
  s = s.replace(/[\u200c\u200d\u2060]/g, "");
  s = s.replace(/\r\n|\r|\n/g, "");
  s = s.replace(/\s/g, "");
  return s;
}

function normalizePlainEnv(value: string | undefined): string {
  return normalizePasswordString(value);
}

function plainPasswordMatches(
  input: string,
  envName: "FAMILY_PASSWORD" | "ADMIN_PASSWORD"
): boolean {
  const expected = normalizePlainEnv(process.env[envName]);
  return plainMatchesInput(input, expected);
}

function plainMatchesInput(input: string, expected: string): boolean {
  if (expected === "") return false;
  const got = normalizePasswordString(input);
  const exp = normalizePasswordString(expected);
  if (got === "" || exp === "") return false;
  const a = Buffer.from(got, "utf8");
  const b = Buffer.from(exp, "utf8");
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Admin plain password: ADMIN_PASSWORD or ADMIN_PASS (Vercel typos). */
export function adminPlainFromEnv(): string {
  return (
    normalizePlainEnv(process.env.ADMIN_PASSWORD) ||
    normalizePlainEnv(process.env.ADMIN_PASS) ||
    ""
  );
}

/** True if server will accept plain-password login (for diagnostics). */
export function envHasPlainFamilyPassword(): boolean {
  return normalizePlainEnv(process.env.FAMILY_PASSWORD) !== "";
}
export function envHasPlainAdminPassword(): boolean {
  return adminPlainFromEnv() !== "";
}

export async function verifyFamilyPassword(password: string): Promise<boolean> {
  if (plainPasswordMatches(password, "FAMILY_PASSWORD")) return true;
  const hash = bcryptHashFromEnv(
    "FAMILY_PASSWORD_HASH_B64",
    "FAMILY_PASSWORD_HASH"
  );
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const got = normalizePasswordString(password);
  if (!got) return false;

  // Every env key Vercel might use (shared vs project naming)
  const plainCandidates = [
    process.env.ADMIN_PASSWORD,
    process.env.ADMIN_PASS,
    process.env.ADMIN_SECRET,
    process.env.ADMIN_CODE,
  ]
    .map((v) => normalizePasswordString(v))
    .filter(Boolean);

  for (const exp of plainCandidates) {
    if (plainMatchesInput(got, exp)) return true;
    if (got === exp) return true;
  }

  const hash = bcryptHashFromEnv(
    "ADMIN_PASSWORD_HASH_B64",
    "ADMIN_PASSWORD_HASH"
  );
  if (hash) {
    const bcryptOk = await bcrypt.compare(password.trim(), hash);
    if (bcryptOk) return true;
  }

  if (plainCandidates.length === 0) {
    return verifyFamilyPassword(password);
  }
  return false;
}

export async function createFamilySession(): Promise<string> {
  return new SignJWT({ role: "family" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(SESSION_MAX_AGE + "s")
    .setIssuedAt()
    .sign(SECRET);
}

export async function createAdminSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(SESSION_MAX_AGE + "s")
    .setIssuedAt()
    .sign(SECRET);
}

export async function getFamilySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role !== "family") return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role !== "admin") return null;
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export async function setFamilyCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearFamilyCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
