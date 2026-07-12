"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, HelpCircle, MapPin, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import { createLocalId, getOrCreateParticipant, saveParticipantNickname } from "@/lib/identity";
import { loadSession, saveSession } from "@/lib/storage/repository";
import type { Activity, FounderSession, RoomId } from "@/types/domain";

const roomIds: RoomId[] = ["idea", "build", "feedback", "growth"];
const activities: Activity[] = ["focused", "open_to_chat"];

// Regions: emoji flag + city / region label
export const REGIONS = [
  { value: "sg", label: "🇸🇬 Singapore" },
  { value: "cn", label: "🇨🇳 China" },
  { value: "hk", label: "🇭🇰 Hong Kong" },
  { value: "tw", label: "🇹🇼 Taiwan" },
  { value: "jp", label: "🇯🇵 Japan" },
  { value: "kr", label: "🇰🇷 Korea" },
  { value: "in", label: "🇮🇳 India" },
  { value: "id", label: "🇮🇩 Indonesia" },
  { value: "th", label: "🇹🇭 Thailand" },
  { value: "vn", label: "🇻🇳 Vietnam" },
  { value: "my", label: "🇲🇾 Malaysia" },
  { value: "ph", label: "🇵🇭 Philippines" },
  { value: "au", label: "🇦🇺 Australia" },
  { value: "nz", label: "🇳🇿 New Zealand" },
  { value: "gb", label: "🇬🇧 United Kingdom" },
  { value: "de", label: "🇩🇪 Germany" },
  { value: "fr", label: "🇫🇷 France" },
  { value: "nl", label: "🇳🇱 Netherlands" },
  { value: "se", label: "🇸🇪 Sweden" },
  { value: "es", label: "🇪🇸 Spain" },
  { value: "us", label: "🇺🇸 United States" },
  { value: "ca", label: "🇨🇦 Canada" },
  { value: "br", label: "🇧🇷 Brazil" },
  { value: "mx", label: "🇲🇽 Mexico" },
  { value: "ae", label: "🇦🇪 UAE" },
  { value: "il", label: "🇮🇱 Israel" },
  { value: "ng", label: "🇳🇬 Nigeria" },
  { value: "za", label: "🇿🇦 South Africa" },
  { value: "other", label: "🌍 Elsewhere" },
] as const;

export function ClockInForm() {
  const router = useRouter();
  const t = useTranslations("clockIn");
  const roomT = useTranslations("rooms");
  const [nickname, setNickname] = useState("");
  const [room, setRoom] = useState<RoomId>("idea");
  const [activity, setActivity] = useState<Activity>("open_to_chat");
  const [goal, setGoal] = useState("");
  const [helpNeed, setHelpNeed] = useState("");
  const [projectName, setProjectName] = useState("");
  const [region, setRegion] = useState("sg"); // default Singapore (hackathon location)

  useEffect(() => {
    const participant = getOrCreateParticipant();
    const existing = loadSession();

    setNickname(participant.nickname === "Solo founder" ? "" : participant.nickname);
    if (existing) {
      setRoom(existing.room);
      setActivity(existing.activity);
      setGoal(existing.goal);
      setHelpNeed(existing.helpNeed ?? "");
      setProjectName(existing.projectName ?? "");
      if (existing.region) setRegion(existing.region);
    }
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const participant = getOrCreateParticipant();
    const displayName = nickname.trim() || participant.nickname;
    saveParticipantNickname(displayName);

    const session: FounderSession = {
      sessionId: createLocalId("session"),
      participant: { ...participant, nickname: displayName },
      room,
      activity,
      goal: goal.trim() || t("defaultGoal"),
      helpNeed: helpNeed.trim() || undefined,
      projectName: projectName.trim() || undefined,
      region,
      checkedInAt: new Date().toISOString(),
    };

    saveSession(session);
    router.push(`/office/${room}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {/* Display name */}
      <div className="grid gap-2">
        <label htmlFor="nickname" className="text-sm font-medium text-floor-ink">
          {t("displayName")}
        </label>
        <div className="flex items-center gap-2 border border-floor-line bg-white px-3">
          <UserRound size={17} className="text-floor-muted" aria-hidden="true" />
          <input
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Clover"
            className="min-h-12 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Region picker */}
      <div className="grid gap-2">
        <label htmlFor="region" className="text-sm font-medium text-floor-ink">
          {t("region")}
        </label>
        <div className="flex items-center gap-2 border border-floor-line bg-white px-3">
          <MapPin size={17} className="text-floor-muted" aria-hidden="true" />
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="min-h-12 flex-1 bg-transparent text-sm outline-none cursor-pointer"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project */}
      <div className="grid gap-2">
        <label htmlFor="projectName" className="text-sm font-medium text-floor-ink">
          {t("project")}
        </label>
        <input
          id="projectName"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          placeholder={t("projectPlaceholder")}
          className="min-h-12 border border-floor-line bg-white px-3 text-sm outline-none focus:border-floor-green"
        />
      </div>

      {/* Goal */}
      <div className="grid gap-2">
        <label htmlFor="goal" className="text-sm font-medium text-floor-ink">
          {t("goal")}
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder={t("goalPlaceholder")}
          rows={3}
          className="border border-floor-line bg-white px-3 py-3 text-sm outline-none focus:border-floor-green"
        />
      </div>

      {/* Help need */}
      <div className="grid gap-2">
        <label htmlFor="helpNeed" className="text-sm font-medium text-floor-ink">
          {t("help")}
        </label>
        <div className="flex items-center gap-2 border border-floor-line bg-white px-3">
          <HelpCircle size={17} className="text-floor-muted" aria-hidden="true" />
          <input
            id="helpNeed"
            value={helpNeed}
            onChange={(event) => setHelpNeed(event.target.value)}
            placeholder={t("helpPlaceholder")}
            className="min-h-12 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Room selector */}
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-floor-ink">{t("chooseRoom")}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {roomIds.map((roomId) => (
            <label
              key={roomId}
              className={`cursor-pointer border p-3 text-sm transition ${
                room === roomId
                  ? "border-floor-green bg-white text-floor-ink"
                  : "border-floor-line bg-white/60 text-floor-muted"
              }`}
            >
              <input
                type="radio"
                name="room"
                value={roomId}
                checked={room === roomId}
                onChange={() => setRoom(roomId)}
                className="sr-only"
              />
              <span className="font-medium">{roomT(`${roomId}.name`)}</span>
              <span className="mt-1 block leading-5">{roomT(`${roomId}.description`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Status */}
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-floor-ink">{t("status")}</legend>
        <div className="flex flex-wrap gap-2">
          {activities.map((item) => (
            <label
              key={item}
              className={`cursor-pointer border px-3 py-2 text-sm ${
                activity === item
                  ? "border-floor-blue bg-white text-floor-ink"
                  : "border-floor-line bg-white/60 text-floor-muted"
              }`}
            >
              <input
                type="radio"
                name="activity"
                value={item}
                checked={activity === item}
                onChange={() => setActivity(item)}
                className="sr-only"
              />
              {t(item === "focused" ? "focused" : "openToChat")}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 bg-floor-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
      >
        {t("enter")}
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
