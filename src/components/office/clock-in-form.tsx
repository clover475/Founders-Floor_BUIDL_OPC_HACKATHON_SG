"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, HelpCircle, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { createLocalId, getOrCreateParticipant, saveParticipantNickname } from "@/lib/identity";
import { officeRooms } from "@/lib/demo-data";
import { loadSession, saveSession } from "@/lib/storage/repository";
import type { Activity, FounderSession, RoomId } from "@/types/domain";

const activities: { value: Activity; label: string }[] = [
  { value: "focused", label: "Focused" },
  { value: "open_to_chat", label: "Open to chat" },
];

export function ClockInForm() {
  const router = useRouter();
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

    const session: FounderSession = {
      sessionId: createLocalId("session"),
      participant: { ...participant, nickname: displayName },
      room,
      activity,
      goal: goal.trim() || "Make one visible piece of progress today",
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
          Display name
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
          Project or idea, optional
        </label>
        <input
          id="projectName"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          placeholder="Leave this blank if you are exploring"
          className="min-h-12 border border-floor-line bg-white px-3 text-sm outline-none focus:border-floor-green"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="goal" className="text-sm font-medium text-floor-ink">
          Today I want to finish
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="Clarify my one-line pitch, test onboarding, or send first-user outreach"
          rows={3}
          className="border border-floor-line bg-white px-3 py-3 text-sm outline-none focus:border-floor-green"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="helpNeed" className="text-sm font-medium text-floor-ink">
          I may need help with
        </label>
        <div className="flex items-center gap-2 border border-floor-line bg-white px-3">
          <HelpCircle size={17} className="text-floor-muted" aria-hidden="true" />
          <input
            id="helpNeed"
            value={helpNeed}
            onChange={(event) => setHelpNeed(event.target.value)}
            placeholder="A quick positioning check"
            className="min-h-12 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-floor-ink">Choose a room</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {officeRooms.filter((item) => item.id !== "break").map((item) => (
            <label
              key={item.id}
              className={`cursor-pointer border p-3 text-sm transition ${
                room === item.id
                  ? "border-floor-green bg-white text-floor-ink"
                  : "border-floor-line bg-white/60 text-floor-muted"
              }`}
            >
              <input
                type="radio"
                name="room"
                value={item.id}
                checked={room === item.id}
                onChange={() => setRoom(item.id)}
                className="sr-only"
              />
              <span className="font-medium">{item.name}</span>
              <span className="mt-1 block leading-5">{item.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-floor-ink">Status</legend>
        <div className="flex flex-wrap gap-2">
          {activities.map((item) => (
            <label
              key={item.value}
              className={`cursor-pointer border px-3 py-2 text-sm ${
                activity === item.value
                  ? "border-floor-blue bg-white text-floor-ink"
                  : "border-floor-line bg-white/60 text-floor-muted"
              }`}
            >
              <input
                type="radio"
                name="activity"
                value={item.value}
                checked={activity === item.value}
                onChange={() => setActivity(item.value)}
                className="sr-only"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 bg-floor-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
      >
        Enter the floor
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
