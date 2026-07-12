import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRealtimeConfig } from "./config";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  const config = getRealtimeConfig();
  if (!config.enabled || !config.supabaseUrl || !config.supabasePublishableKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return browserClient;
}
