import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // During builds we might not have env vars, but we still want `next build` to typecheck.
  // If someone actually hits an API without proper env, Supabase calls will fail at runtime.
  if (!url || !key) {
    _supabase = createClient("https://example.supabase.co", "public-anon-key");
    return _supabase;
  }
  _supabase = createClient(url, key);
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop as any];
  },
}) as unknown as SupabaseClient;
