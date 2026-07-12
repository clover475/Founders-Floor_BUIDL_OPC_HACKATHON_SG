"use client";

import { Coffee, LogOut, UsersRound } from "lucide-react";
import { useTranslations } from "use-intl";
import { JitsiMeeting } from "@/components/live/jitsi-meeting";
import { getCoffeeJitsiRoomName, getJitsiMeetingUrl } from "@/lib/live/jitsi";
import { useCoffeePresence } from "@/lib/realtime/use-coffee-presence";

export function CoffeeCorner() {
  const t = useTranslations("coffee");
  const coffee = useCoffeePresence();
  const roomName = getCoffeeJitsiRoomName();
  const meetingUrl = getJitsiMeetingUrl(roomName);
  const emptySeats = Math.max(coffee.capacity - coffee.participants.length, 0);
  const statusCopy = {
    connected: t("connected"),
    connecting: t("connecting"),
    error: t("errorStatus"),
    demo: t("demo"),
    idle: t("ready"),
  }[coffee.status];

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.38fr_0.62fr]">
      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-floor-green">{t("eyebrow")}</p>
          <h1 className="text-3xl font-semibold text-floor-ink">{t("title")}</h1>
          <p className="text-sm leading-6 text-floor-muted">
            {t("description")}
          </p>
        </div>

        <div className="border border-floor-line bg-white/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-floor-ink">
                {t("filled", { count: coffee.participants.length, capacity: coffee.capacity })}
              </p>
              <p className="mt-1 text-sm text-floor-muted">{t("open", { count: emptySeats })}</p>
            </div>
            <UsersRound size={22} className="text-floor-green" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm leading-6 text-floor-muted">{statusCopy}</p>
        </div>

        {coffee.status === "connecting" ? (
          <div className="border border-floor-line bg-floor-panel p-3 text-sm text-floor-muted">
            {t("watching")}
          </div>
        ) : null}

        {coffee.status === "error" ? (
          <div className="border border-floor-line bg-white p-3 text-sm text-floor-muted">
            {t("disconnected")}
          </div>
        ) : null}

        {coffee.tableFull ? (
          <div className="border border-floor-line bg-white p-3 text-sm text-floor-muted">
            {t("fullNotice")}
          </div>
        ) : null}

        <div className="grid gap-2">
          {Array.from({ length: coffee.capacity }).map((_, index) => {
            const participant = coffee.participants[index];
            return (
              <div key={participant?.participantId ?? index} className="border border-floor-line bg-white/70 p-3">
                <p className="text-sm font-medium text-floor-ink">
                  {participant ? participant.nickname : t("openSeat", { number: index + 1 })}
                </p>
                <p className="mt-1 text-xs uppercase text-floor-muted">
                  {participant ? t("joined") : t("available")}
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
            {t("leave")}
          </button>
        ) : (
          <button
            type="button"
            onClick={coffee.join}
            disabled={coffee.tableFull}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-floor-muted"
          >
            <Coffee size={16} aria-hidden="true" />
            {coffee.tableFull ? t("full") : t("join")}
          </button>
        )}
      </section>

      <section>
        {coffee.joined ? (
          <JitsiMeeting roomName={roomName} meetingUrl={meetingUrl} />
        ) : (
          <div className="grid min-h-[520px] place-items-center border border-floor-line bg-white/70 p-6 text-center">
            <div className="max-w-md">
              <p className="text-lg font-semibold text-floor-ink">{t("joinTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-floor-muted">
                {t("joinDescription")}
              </p>
              <p className="mt-5 break-all text-xs text-floor-muted">{t("room", { room: roomName })}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
