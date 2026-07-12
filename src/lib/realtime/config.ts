export type RealtimeConfig = {
  enabled: boolean;
  supabaseUrl?: string;
  supabasePublishableKey?: string;
  eventSlug: string;
  jitsiDomain: string;
};

export function getRealtimeConfig(): RealtimeConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return {
    enabled: Boolean(supabaseUrl && supabasePublishableKey),
    supabaseUrl,
    supabasePublishableKey,
    eventSlug: process.env.NEXT_PUBLIC_EVENT_SLUG ?? "founders-floor-hackathon",
    jitsiDomain: process.env.NEXT_PUBLIC_JITSI_DOMAIN ?? "meet.jit.si",
  };
}
