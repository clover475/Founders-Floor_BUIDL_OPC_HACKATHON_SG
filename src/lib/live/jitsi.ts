import { getRealtimeConfig } from "@/lib/realtime/config";

function sanitizeRoomSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCoffeeJitsiRoomName() {
  const { eventSlug } = getRealtimeConfig();
  return `founders-floor-${sanitizeRoomSegment(eventSlug)}-coffee`;
}

export function getJitsiMeetingUrl(roomName: string) {
  const { jitsiDomain } = getRealtimeConfig();
  const params = new URLSearchParams({
    "config.startWithAudioMuted": "true",
    "config.startWithVideoMuted": "true",
    "config.prejoinConfig.enabled": "true",
    "interfaceConfig.SHOW_JITSI_WATERMARK": "false",
  });

  return `https://${jitsiDomain}/${encodeURIComponent(roomName)}#${params.toString()}`;
}
