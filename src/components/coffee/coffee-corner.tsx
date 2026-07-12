"use client";

import { Coffee, LogOut, UsersRound } from "lucide-react";
import { JitsiMeeting } from "@/components/live/jitsi-meeting";
import { getCoffeeJitsiRoomName, getJitsiMeetingUrl } from "@/lib/live/jitsi";
import { useCoffeePresence } from "@/lib/realtime/use-coffee-presence";

function statusCopy(status: ReturnType<typeof useCoffeePresence>["status"]) {
  if (status === "connected") {
    return "Live table connected.";
  }

  if (status === "connecting") {
    return "Connecting to the live table.";
  }

  if (status === "error") {
    return "Live table had a connection issue. The meeting link still works.";
  }

  if (status === "demo") {
    return "Local demo mode. Supabase variables are not configured.";
  }

  return "Ready to join.";
}

export function CoffeeCorner() {
  const coffee = useCoffeePresence();
  const roomName = getCoffeeJitsiRoomName();
  const meetingUrl = getJitsiMeetingUrl(roomName);
  const emptySeats = Math.max(coffee.capacity - coffee.participants.length, 0);

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.38fr_0.62fr]">
      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-floor-green">Coffee Corner</p>
          <h1 className="text-3xl font-semibold text-floor-ink">Four seats for a quick break</h1>
          <p className="text-sm leading-6 text-floor-muted">
            Join the public table when you want a short live conversation. This
            room is for casual founder talk, not private information.
          </p>
        </div>

        <div className="border border-floor-line bg-white/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-floor-ink">
                {coffee.participants.length}/{coffee.capacity} seats filled
              </p>
              <p className="mt-1 text-sm text-floor-muted">{emptySeats} seats open</p>
            </div>
            <UsersRound size={22} className="text-floor-green" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm leading-6 text-floor-muted">{statusCopy(coffee.status)}</p>
        </div>

        {coffee.status === "connecting" ? (
          <div className="border border-floor-line bg-floor-panel p-3 text-sm text-floor-muted">
            Watching the live seat state before you join.
          </div>
        ) : null}

        {coffee.status === "error" ? (
          <div className="border border-floor-line bg-white p-3 text-sm text-floor-muted">
            Realtime is disconnected. The meeting room can still open, and the personal demo flow is unaffected.
          </div>
        ) : null}

        {coffee.tableFull ? (
          <div className="border border-floor-line bg-white p-3 text-sm text-floor-muted">
            The four-seat table is full. Stay on this page to watch for an open seat.
          </div>
        ) : null}

        <div className="grid gap-2">
          {Array.from({ length: coffee.capacity }).map((_, index) => {
            const participant = coffee.participants[index];
            return (
              <div key={participant?.participantId ?? index} className="border border-floor-line bg-white/70 p-3">
                <p className="text-sm font-medium text-floor-ink">
                  {participant ? participant.nickname : `Open seat ${index + 1}`}
                </p>
                <p className="mt-1 text-xs uppercase text-floor-muted">
                  {participant ? "joined" : "available"}
                </p>
              </div>
            );
          })}
        </div>

        {coffee.joined ? (
          <button
            type="button"
            onClick={() => void coffee.leave()}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-floor-line bg-white px-4 text-sm font-medium text-floor-ink"
          >
            <LogOut size={16} aria-hidden="true" />
            Leave table
          </button>
        ) : (
          <button
            type="button"
            onClick={coffee.join}
            disabled={coffee.tableFull}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-floor-muted"
          >
            <Coffee size={16} aria-hidden="true" />
            {coffee.tableFull ? "Table full" : "Join Coffee Corner"}
          </button>
        )}
      </section>

      <section>
        {coffee.joined ? (
          <JitsiMeeting roomName={roomName} meetingUrl={meetingUrl} />
        ) : (
          <div className="grid min-h-[520px] place-items-center border border-floor-line bg-white/70 p-6 text-center">
            <div className="max-w-md">
              <p className="text-lg font-semibold text-floor-ink">Join to open the live table</p>
              <p className="mt-2 text-sm leading-6 text-floor-muted">
                The meeting is embedded only after you take a seat. The same
                deterministic room is used by every participant for this event.
              </p>
              <p className="mt-5 break-all text-xs text-floor-muted">Room: {roomName}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
