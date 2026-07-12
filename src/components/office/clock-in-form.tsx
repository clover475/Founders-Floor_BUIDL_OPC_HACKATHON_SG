"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, HelpCircle, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import { createLocalId, getOrCreateParticipant, saveParticipantNickname } from "@/lib/identity";
import { archiveSession, loadSession, saveSession } from "@/lib/storage/repository";
import type { Activity, FounderSession, RoomId } from "@/types/domain";

const roomIds: RoomId[] = ["idea", "build", "feedback", "growth"];
const activities: Activity[] = ["focused", "open_to_chat"];

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
    }
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const participant = getOrCreateParticipant();
    const displayName = nickname.trim() || participant.nickname;
    saveParticipantNickname(displayName);

    const existing = loadSession();
    if (existing && existing.room !== room) {
      archiveSession(existing, "switchedSession");
    }

    const session: FounderSession = {
      sessionId: createLocalId("session"),
      participant: { ...participant, nickname: displayName },
      room,
      activity,
      goal: goal.trim() || t("defaultGoal"),
      helpNeed: helpNeed.trim() || undefined,
      projectName: projectName.trim() || undefined,
      checkedInAt: new Date().toISOString(),
    };

    saveSession(session);
    router.push(`/office/${room}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
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
