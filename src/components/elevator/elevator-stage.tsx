"use client";

import { Check, MessageSquare, Mic2, RotateCcw, Save, Timer, UsersRound } from "lucide-react";
import { useState } from "react";
import { JitsiMeeting } from "@/components/live/jitsi-meeting";
import { getElevatorJitsiRoomName, getJitsiMeetingUrl } from "@/lib/live/jitsi";
import { useElevatorStage } from "@/lib/realtime/use-elevator-stage";

function statusCopy(status: ReturnType<typeof useElevatorStage>["status"]) {
  if (status === "connected") {
    return "Live stage connected.";
  }

  if (status === "connecting") {
    return "Connecting to the live stage.";
  }

  if (status === "error") {
    return "Live stage had a connection issue. The meeting link still works.";
  }

  if (status === "demo") {
    return "Local demo mode. Supabase variables are not configured.";
  }

  return "Ready to join.";
}

export function ElevatorStage() {
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
          <p className="text-sm font-medium text-floor-green">Elevator Stage</p>
          <h1 className="text-3xl font-semibold text-floor-ink">Thirty seconds, real listeners</h1>
          <p className="text-sm leading-6 text-floor-muted">
            One founder pitches while everyone else listens, reacts, and leaves a useful question.
          </p>
        </div>

        <div className="grid gap-3 border border-floor-line bg-white/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-floor-ink">
                {elevator.activeSpeaker ? `${elevator.activeSpeaker.nickname} is speaking` : "Stage open"}
              </p>
              <p className="mt-1 text-sm text-floor-muted">
                {elevator.audienceCount} audience members · {statusCopy(elevator.status)}
              </p>
            </div>
            <UsersRound size={22} className="text-floor-green" aria-hidden="true" />
          </div>

          {elevator.currentRound ? (
            <div className="border border-floor-line bg-floor-panel p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-floor-ink">
                  {elevator.currentRound.ended ? "Round ended" : "Round live"}
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
            Connecting to the shared stage before roles are tracked.
          </div>
        ) : null}

        {elevator.status === "error" ? (
          <div className="border border-floor-line bg-white p-3 text-sm text-floor-muted">
            Realtime is disconnected. You can still use the meeting room and save a local result.
          </div>
        ) : null}

        {elevator.speakerBlocked && !elevator.currentRound ? (
          <div className="border border-floor-line bg-white p-3 text-sm text-floor-muted">
            One speaker is already on stage. Join as audience or wait for reset.
          </div>
        ) : null}

        {!elevator.currentRound ? (
          <form onSubmit={onStart} className="grid gap-3 border border-floor-line bg-white/80 p-4">
            <label htmlFor="pitch" className="text-sm font-medium text-floor-ink">
              Your elevator pitch
            </label>
            <textarea
              id="pitch"
              value={pitch}
              onChange={(event) => setPitch(event.target.value)}
              placeholder="I help solo founders..."
              rows={4}
              className="border border-floor-line bg-white px-3 py-3 text-sm outline-none focus:border-floor-green"
            />
            <button
              type="submit"
              disabled={!pitch.trim() || elevator.speakerBlocked}
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-floor-muted"
            >
              <Mic2 size={16} aria-hidden="true" />
              {elevator.speakerBlocked ? "Speaker already live" : "Start 30-second round"}
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
                Join as audience
              </button>
            ) : null}

            <label className="flex items-center gap-2 text-sm text-floor-ink">
              <input
                type="checkbox"
                checked={understood}
                onChange={(event) => setUnderstood(event.target.checked)}
                className="h-4 w-4 accent-floor-green"
              />
              I understood the pitch
            </label>
            <label className="flex items-center gap-2 text-sm text-floor-ink">
              <input
                type="checkbox"
                checked={wantsFollowUp}
                onChange={(event) => setWantsFollowUp(event.target.checked)}
                className="h-4 w-4 accent-floor-green"
              />
              I want to hear more
            </label>
            <label className="flex items-center gap-2 text-sm text-floor-ink">
              <input
                type="checkbox"
                checked={couldBeUser}
                onChange={(event) => setCouldBeUser(event.target.checked)}
                className="h-4 w-4 accent-floor-green"
              />
              I could be a user or know one
            </label>
            <label htmlFor="audience-question" className="text-sm font-medium text-floor-ink">
              One useful question
            </label>
            <input
              id="audience-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Who is the first target user?"
              className="min-h-11 border border-floor-line bg-white px-3 text-sm outline-none focus:border-floor-green"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-floor-ink px-4 text-sm font-medium text-white"
            >
              <MessageSquare size={16} aria-hidden="true" />
              Send feedback
            </button>
          </form>
        ) : null}

        {elevator.currentRound && elevator.isSpeaker ? (
          <div className="grid gap-3 border border-floor-line bg-white/80 p-4">
            <p className="text-sm font-semibold text-floor-ink">Result card</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-floor-panel p-3">
                <p className="text-xl font-semibold text-floor-ink">{understoodCount}</p>
                <p className="text-xs text-floor-muted">understood</p>
              </div>
              <div className="bg-floor-panel p-3">
                <p className="text-xl font-semibold text-floor-ink">{followUpCount}</p>
                <p className="text-xs text-floor-muted">follow-up</p>
              </div>
              <div className="bg-floor-panel p-3">
                <p className="text-xl font-semibold text-floor-ink">{userCount}</p>
                <p className="text-xs text-floor-muted">user signal</p>
              </div>
            </div>
            {elevator.feedback.length ? (
              <div className="grid gap-2">
                {elevator.feedback.slice(0, 3).map((item) => (
                  <p key={`${item.participantId}-${item.submittedAt}`} className="text-sm text-floor-muted">
                    {item.question || "No question added."}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-floor-muted">Audience feedback will appear here in realtime.</p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void elevator.endRound()}
                className="inline-flex min-h-10 items-center gap-2 border border-floor-line bg-white px-3 text-sm font-medium text-floor-ink"
              >
                <Check size={16} aria-hidden="true" />
                End
              </button>
              <button
                type="button"
                onClick={elevator.saveResult}
                className="inline-flex min-h-10 items-center gap-2 bg-floor-green px-3 text-sm font-medium text-white"
              >
                <Save size={16} aria-hidden="true" />
                {elevator.saved ? "Saved" : "Save result"}
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
            Reset stale round
          </button>
        ) : null}
      </section>

      <section>
        {elevator.role ? (
          <JitsiMeeting roomName={roomName} meetingUrl={meetingUrl} title="Elevator Stage meeting" />
        ) : (
          <div className="grid min-h-[520px] place-items-center border border-floor-line bg-white/70 p-6 text-center">
            <div className="max-w-md">
              <p className="text-lg font-semibold text-floor-ink">Join the stage to open the room</p>
              <p className="mt-2 text-sm leading-6 text-floor-muted">
                Speakers and audience use the same deterministic Jitsi room for this event.
              </p>
              <p className="mt-5 break-all text-xs text-floor-muted">Room: {roomName}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
