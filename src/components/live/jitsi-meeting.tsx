"use client";

import { ExternalLink, Headphones } from "lucide-react";
import { useState } from "react";

export function JitsiMeeting({
  roomName,
  meetingUrl,
}: {
  roomName: string;
  meetingUrl: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-floor-line bg-floor-panel p-3">
        <div className="flex items-center gap-2 text-sm text-floor-muted">
          <Headphones size={17} aria-hidden="true" />
          Audio and video start muted. Use headphones in the venue.
        </div>
        <a
          href={meetingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center gap-2 border border-floor-line bg-white px-3 text-sm font-medium text-floor-ink"
        >
          <ExternalLink size={16} aria-hidden="true" />
          Open meeting
        </a>
      </div>

      <div className="overflow-hidden border border-floor-line bg-white">
        {failed ? (
          <div className="grid min-h-[360px] place-items-center p-5 text-center">
            <div>
              <p className="font-semibold text-floor-ink">Meeting embed did not load</p>
              <p className="mt-2 text-sm text-floor-muted">
                Use the external meeting button. Room: {roomName}
              </p>
            </div>
          </div>
        ) : (
          <iframe
            title={`Coffee Corner meeting ${roomName}`}
            src={meetingUrl}
            allow="camera; microphone; fullscreen; display-capture"
            onError={() => setFailed(true)}
            className="h-[520px] w-full border-0"
          />
        )}
      </div>
    </section>
  );
}
