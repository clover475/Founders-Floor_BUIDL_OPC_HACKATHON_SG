import { getRealtimeConfig } from "@/lib/realtime/config";

export function RealtimeStatus() {
  const config = getRealtimeConfig();

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-floor-ink">Live mode</p>
      <p className="text-sm leading-6 text-floor-muted">
        {config.enabled
          ? "Supabase realtime variables are present. Live rooms can be enabled by later tasks."
          : "Supabase variables are missing, so the app will use local demo mode without crashing."}
      </p>
      <div className="flex items-center gap-2 text-xs text-floor-muted">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            config.enabled ? "bg-floor-green" : "bg-floor-gold"
          }`}
          aria-hidden="true"
        />
        {config.enabled ? "Configured" : "Local fallback active"}
      </div>
    </div>
  );
}
