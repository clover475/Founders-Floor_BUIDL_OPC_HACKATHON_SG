"use client";

import { Coffee, ExternalLink, LogOut, PencilLine, UsersRound, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { JitsiMeeting } from "@/components/live/jitsi-meeting";
import { getCoffeeJitsiRoomName, getJitsiMeetingUrl } from "@/lib/live/jitsi";
import { useCoffeePresence } from "@/lib/realtime/use-coffee-presence";

const coffeeRooms = ["founder-lounge", "ai-builders", "first-users", "quiet-build"] as const;

export function CoffeeCorner() {
  const t = useTranslations("coffee");
  const [selectedRoomId, setSelectedRoomId] = useState<(typeof coffeeRooms)[number]>("founder-lounge");
  const [customTitle, setCustomTitle] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  // previewMode: loads Jitsi iframe without taking a seat
  const [previewMode, setPreviewMode] = useState(false);

  const roomTitle = customTitle.trim() || t(`rooms.${selectedRoomId}.name`);
  const roomTopic = customTopic.trim() || t(`rooms.${selectedRoomId}.description`);
  const coffee = useCoffeePresence(selectedRoomId, roomTitle, roomTopic);
  const roomName = getCoffeeJitsiRoomName(selectedRoomId);
  const meetingUrl = getJitsiMeetingUrl(roomName);
  const emptySeats = Math.max(coffee.capacity - coffee.participants.length, 0);
  const firstPresence = coffee.participants[0];
  const displayedRoomTitle = firstPresence?.roomTitle || roomTitle;
  const displayedRoomTopic = firstPresence?.roomTopic || roomTopic;
  const canEditRoom = coffee.participants.length === 0 || coffee.joined;
  const statusCopy = {
    connected: t("connected"),
    connecting: t("connecting"),
    error: t("errorStatus"),
    demo: t("demo"),
    idle: t("ready"),
  }[coffee.status];

  const selectedRoomLabel = useMemo(
    () => t(`rooms.${selectedRoomId}.name`),
    [selectedRoomId, t],
  );

  function selectRoom(roomId: (typeof coffeeRooms)[number]) {
    if (coffee.joined) {
      return;
    }
    setSelectedRoomId(roomId);
    setCustomTitle("");
    setCustomTopic("");
    // Reset preview when switching rooms
    setPreviewMode(false);
  }

  function handlePreview() {
    setPreviewMode(true);
  }

  // Show meeting when joined OR in preview mode
  const showMeeting = coffee.joined || previewMode;

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.42fr_0.58fr]">
      {/* ── Left column ── */}
      <section className="space-y-5">
        {/* Heading */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-floor-green">{t("eyebrow")}</p>
          <h1 className="text-3xl font-semibold text-floor-ink">{t("title")}</h1>
          <p className="text-sm leading-6 text-floor-muted">
            {t("description")}
          </p>
        </div>

        {/* Room selector */}
        <div className="grid gap-2">
          {coffeeRooms.map((roomId) => {
            const selected = roomId === selectedRoomId;
            return (
              <button
                key={roomId}
                type="button"
                onClick={() => selectRoom(roomId)}
                disabled={coffee.joined}
                className={`border p-4 text-left transition ${
                  selected
                    ? "border-floor-green bg-white"
                    : "border-floor-line bg-white/70 hover:border-floor-green"
                } ${coffee.joined ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <p className="text-sm font-semibold text-floor-ink">{t(`rooms.${roomId}.name`)}</p>
                <p className="mt-1 text-xs leading-5 text-floor-muted">{t(`rooms.${roomId}.description`)}</p>
              </button>
            );
          })}
        </div>

        {/* Status card */}
        <div className="border border-floor-line bg-white/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-floor-muted">{selectedRoomLabel}</p>
              <p className="mt-1 text-sm font-semibold text-floor-ink">
                {t("filled", { count: coffee.participants.length, capacity: coffee.capacity })}
              </p>
              <p className="mt-1 text-sm text-floor-muted">{t("open", { count: emptySeats })}</p>
            </div>
            <UsersRound size={22} className="text-floor-green" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm leading-6 text-floor-muted">{statusCopy}</p>
        </div>

        {/* Status notices */}
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

        {/* ── Seat list — clickable empty seats join the room ── */}
        <div className="grid gap-2">
          {Array.from({ length: coffee.capacity }).map((_, index) => {
            const participant = coffee.participants[index];
            const isOccupied = Boolean(participant);
            const isMe = participant?.participantId === undefined
              ? false
              : coffee.joined && index === coffee.participants.findIndex(
                  (p) => p.participantId === participant.participantId,
                );

            if (isOccupied) {
              // Occupied seat — read-only display
              return (
                <div key={participant.participantId} className="border border-floor-line bg-white/70 p-3">
                  <p className="text-sm font-medium text-floor-ink">{participant.nickname}</p>
                  <p className="mt-1 text-xs uppercase text-floor-muted">{t("joined")}</p>
                </div>
              );
            }

            // Empty seat — clickable to join (disabled if already joined or table is full)
            return (
              <button
                key={`empty-${index}`}
                type="button"
                onClick={coffee.join}
                disabled={coffee.joined || coffee.tableFull}
                className={`border border-floor-line p-3 text-left transition ${
                  coffee.joined || coffee.tableFull
                    ? "cursor-not-allowed bg-white/40 opacity-60"
                    : "bg-white/70 hover:border-floor-green hover:bg-white"
                }`}
              >
                <p className="text-sm font-medium text-floor-ink">
                  {t("openSeat", { number: index + 1 })}
                </p>
                <p className="mt-1 text-xs uppercase text-floor-muted">
                  {coffee.joined ? t("available") : t("takeSeat", { number: index + 1 })}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Room setup — moved below seat list ── */}
        {canEditRoom ? (
          <div className="grid gap-3 border border-floor-line bg-white/80 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-floor-ink">
              <PencilLine size={16} aria-hidden="true" />
              {coffee.joined ? t("editLiveRoom") : t("setupRoom")}
            </div>
            <input
              value={customTitle}
              onChange={(event) => setCustomTitle(event.target.value)}
              placeholder={t(`rooms.${selectedRoomId}.name`)}
              className="min-h-11 border border-floor-line bg-white px-3 text-sm outline-none focus:border-floor-green"
            />
            <input
              value={customTopic}
              onChange={(event) => setCustomTopic(event.target.value)}
              placeholder={t("topicPlaceholder")}
              className="min-h-11 border border-floor-line bg-white px-3 text-sm outline-none focus:border-floor-green"
            />
          </div>
        ) : null}

        {/* ── Primary action button ── */}
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

      {/* ── Right column — video panel ── */}
      <section>
        {showMeeting ? (
          <div className="grid gap-3">
            {previewMode && !coffee.joined ? (
              <div className="flex items-center justify-between border border-floor-line bg-floor-panel px-4 py-2">
                <p className="text-xs text-floor-muted">{t("previewNote")}</p>
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-floor-green hover:underline"
                >
                  <ExternalLink size={13} aria-hidden="true" />
                  {t("open", { count: 0 })}
                </a>
              </div>
            ) : null}
            <JitsiMeeting roomName={roomName} meetingUrl={meetingUrl} />
          </div>
        ) : (
          <div className="grid min-h-[420px] place-items-center border border-floor-line bg-white/70 p-6 text-center">
            <div className="max-w-md space-y-5">
              <p className="text-xs uppercase text-floor-green">{displayedRoomTitle}</p>
              <p className="mt-2 text-lg font-semibold text-floor-ink">{t("joinTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-floor-muted">
                {displayedRoomTopic}
              </p>
              <p className="mt-2 text-sm leading-6 text-floor-muted">{t("joinDescription")}</p>

              {/* ── Preview video button ── */}
              <div className="mt-4 border-t border-floor-line pt-4">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="inline-flex min-h-10 w-full items-center justify-center gap-2 border border-floor-line bg-white px-4 text-sm font-medium text-floor-ink transition hover:border-floor-green hover:text-floor-green"
                >
                  <Video size={16} aria-hidden="true" />
                  {t("previewVideo")}
                </button>
                <p className="mt-2 text-xs text-floor-muted">{t("previewNote")}</p>
              </div>

              <p className="break-all text-xs text-floor-muted">{t("room", { room: roomName })}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
