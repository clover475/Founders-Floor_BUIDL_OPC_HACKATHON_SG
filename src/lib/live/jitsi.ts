import { getRealtimeConfig } from "@/lib/realtime/config";

function sanitizeRoomSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCoffeeJitsiRoomName(roomId = "main") {
  const { eventSlug } = getRealtimeConfig();
  return `founders-floor-${sanitizeRoomSegment(eventSlug)}-coffee-${sanitizeRoomSegment(roomId)}`;
}

export function getElevatorJitsiRoomName() {
  const { eventSlug } = getRealtimeConfig();
  return `founders-floor-${sanitizeRoomSegment(eventSlug)}-elevator`;
}

export function getJitsiMeetingUrl(roomName: string) {
  const { jitsiDomain } = getRealtimeConfig();
  const params = new URLSearchParams({
    // Start muted by default to avoid echo
    "config.startWithAudioMuted": "true",
    "config.startWithVideoMuted": "false",
    // Skip the pre-join waiting room — enter directly
    "config.prejoinConfig.enabled": "false",
    // Disable the lobby (no host required to start)
    "config.lobby.enabled": "false",
    "config.lobby.autoKnock": "false",
    // Clean up the UI
    "interfaceConfig.SHOW_JITSI_WATERMARK": "false",
    "interfaceConfig.SHOW_BRAND_WATERMARK": "false",
    "interfaceConfig.TOOLBAR_BUTTONS": JSON.stringify([
      "microphone", "camera", "closedcaptions", "desktop",
      "fullscreen", "fodeviceselection", "hangup", "chat", "raisehand", "tileview",
    ]),
  });

  return `https://${jitsiDomain}/${encodeURIComponent(roomName)}#${params.toString()}`;
}
