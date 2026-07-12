"use client";

import { Check, MessageSquare, Mic2, RotateCcw, Save, Timer, UsersRound } from "lucide-react";
import { useTranslations } from "use-intl";
import { useState } from "react";
import { JitsiMeeting } from "@/components/live/jitsi-meeting";
import { getElevatorJitsiRoomName, getJitsiMeetingUrl } from "@/lib/live/jitsi";
import { useElevatorStage } from "@/lib/realtime/use-elevator-stage";

export function ElevatorStage() {
  const t = useTranslations("elevator");
  const elevator = useElevatorStage();
  const [pitch, setPitch] = useState("");
  const [understood, setUnderstood] = useState(true);
  const [wantsFollowUp, setWantsFollowUp] = useState(false);
  const [couldBeUser, setCouldBeUser] = useState(false);
  const [question, setQuestion] = useState("");
  const roomName = getElevatorJitsiRoomName();
  const meetingUrl = getJitsiMeetingUrl(roomName);
  const understoodCount = elevator.feedback.filter((item) => item.understood).length;
  const followUpCount = elevator.feedback.filter((item) => item.wantsFollowUp).length;
  const userCount = elevator.feedback.filter((item) => item.couldBeUser).length;
  const statusCopy = {
    connected: t("connected"),
    connecting: t("connecting"),
    error: t("errorStatus"),
    demo: t("demo"),
    idle: t("ready"),
  }[elevator.status];

  function onStart(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void elevator.startRound(pitch);
  }

  function onFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void elevator.submitFeedback({
      understood,
      wantsFollowUp,
      couldBeUser,
      question: question.trim(),
    });
    setQuestion("");
  }

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

        <div className="grid gap-3 border border-floor-line bg-white/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-floor-ink">
                {elevator.activeSpeaker
                  ? t("speaking", { name: elevator.activeSpeaker.nickname })
                  : t("open")}
              </p>
              <p className="mt-1 text-sm text-floor-muted">
                {t("audience", { count: elevator.audienceCount })} · {statusCopy}
              </p>
            </div>
            <UsersRound size={22} className="text-floor-green" aria-hidden="true" />
          </div>

          {elevator.currentRound ? (
            <div className="border border-floor-line bg-floor-panel p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-floor-ink">
                  {elevator.currentRound.ended ? t("roundEnded") : t("roundLive")}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-floor-ink">
                  <Timer size={16} aria-hidden="true" />
                  {elevator.secondsLeft}s
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-floor-muted">{elevator.currentRound.pitch}</p>
            </div>
          ) : null}
        </div>

        {elevator.status === "connecting" ? (
          <div className="border border-floor-line bg-floor-panel p-3 text-sm text-floor-muted">
            {t("tracking")}
          </div>
        ) : null}

        {elevator.status === "error" ? (
          <div className="border border-floor-line bg-white p-3 text-sm text-floor-muted">
            {t("disconnected")}
          </div>
        ) : null}

        {elevator.speakerBlocked && !elevator.currentRound ? (
          <div className="border border-floor-line bg-white p-3 text-sm text-floor-muted">
            {t("blocked")}
          </div>
        ) : null}

        {!elevator.currentRound ? (
          <form onSubmit={onStart} className="grid gap-3 border border-floor-line bg-white/80 p-4">
            <label htmlFor="pitch" className="text-sm font-medium text-floor-ink">
              {t("pitch")}
            </label>
            <textarea
              id="pitch"
              value={pitch}
              onChange={(event) => setPitch(event.target.value)}
              placeholder={t("pitchPlaceholder")}
              rows={4}
              className="border border-floor-line bg-white px-3 py-3 text-sm outline-none focus:border-floor-green"
            />
            <button
              type="submit"
              disabled={!pitch.trim() || elevator.speakerBlocked}
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-floor-muted"
            >
              <Mic2 size={16} aria-hidden="true" />
              {elevator.speakerBlocked ? t("speakerLive") : t("start")}
            </button>
          </form>
        ) : null}

        {elevator.currentRound && !elevator.isSpeaker ? (
          <form onSubmit={onFeedback} className="grid gap-3 border border-floor-line bg-white/80 p-4">
            {!elevator.role ? (
              <button
                type="button"
                onClick={() => void elevator.joinAudience()}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-floor-line bg-white px-4 text-sm font-medium text-floor-ink"
              >
                <UsersRound size={16} aria-hidden="true" />
                {t("joinAudience")}
              </button>
            ) : null}

            <label className="flex items-center gap-2 text-sm text-floor-ink">
              <input
                type="checkbox"
                checked={understood}
                onChange={(event) => setUnderstood(event.target.checked)}
                className="h-4 w-4 accent-floor-green"
              />
              {t("understoodPitch")}
            </label>
            <label className="flex items-center gap-2 text-sm text-floor-ink">
              <input
                type="checkbox"
                checked={wantsFollowUp}
                onChange={(event) => setWantsFollowUp(event.target.checked)}
                className="h-4 w-4 accent-floor-green"
              />
              {t("hearMore")}
            </label>
            <label className="flex items-center gap-2 text-sm text-floor-ink">
              <input
                type="checkbox"
                checked={couldBeUser}
                onChange={(event) => setCouldBeUser(event.target.checked)}
                className="h-4 w-4 accent-floor-green"
              />
              {t("couldBeUser")}
            </label>
            <label htmlFor="audience-question" className="text-sm font-medium text-floor-ink">
              {t("question")}
            </label>
            <input
              id="audience-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t("questionPlaceholder")}
              className="min-h-11 border border-floor-line bg-white px-3 text-sm outline-none focus:border-floor-green"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white"
            >
              <MessageSquare size={16} aria-hidden="true" />
              {t("send")}
            </button>
          </form>
        ) : null}

        {elevator.currentRound && elevator.isSpeaker ? (
          <div className="grid gap-3 border border-floor-line bg-white/80 p-4">
            <p className="text-sm font-semibold text-floor-ink">{t("result")}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-floor-panel p-3">
                <p className="text-xl font-semibold text-floor-ink">{understoodCount}</p>
                <p className="text-xs text-floor-muted">{t("understood")}</p>
              </div>
              <div className="bg-floor-panel p-3">
                <p className="text-xl font-semibold text-floor-ink">{followUpCount}</p>
                <p className="text-xs text-floor-muted">{t("followUp")}</p>
              </div>
              <div className="bg-floor-panel p-3">
                <p className="text-xl font-semibold text-floor-ink">{userCount}</p>
                <p className="text-xs text-floor-muted">{t("userSignal")}</p>
              </div>
            </div>
            {elevator.feedback.length ? (
              <div className="grid gap-2">
                {elevator.feedback.slice(0, 3).map((item) => (
                  <p key={`${item.participantId}-${item.submittedAt}`} className="text-sm text-floor-muted">
                    {item.question || t("noQuestion")}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-floor-muted">{t("feedbackPending")}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void elevator.endRound()}
                className="inline-flex min-h-10 items-center gap-2 border border-floor-line bg-white px-3 text-sm font-medium text-floor-ink"
              >
                <Check size={16} aria-hidden="true" />
                {t("end")}
              </button>
              <button
                type="button"
                onClick={elevator.saveResult}
                className="inline-flex min-h-10 items-center gap-2 bg-floor-green px-3 text-sm font-medium text-white"
              >
                <Save size={16} aria-hidden="true" />
                {elevator.saved ? t("saved") : t("save")}
              </button>
            </div>
          </div>
        ) : null}

        {elevator.currentRound ? (
          <button
            type="button"
            onClick={() => void elevator.resetRound()}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-floor-line bg-white px-4 text-sm font-medium text-floor-ink"
          >
            <RotateCcw size={16} aria-hidden="true" />
            {t("reset")}
          </button>
        ) : null}
      </section>

      <section>
        {elevator.role ? (
          <JitsiMeeting roomName={roomName} meetingUrl={meetingUrl} title={t("meetingTitle")} />
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
