"use client";

import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Loader2,
  Mic,
  MicOff,
  RefreshCw,
  RotateCcw,
  Square,
  Type,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PitchAnalysisResult, StructureScore } from "@/app/api/analyse-pitch/route";
import { computeLocalMetrics } from "@/lib/pitch/analyse";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

type Stage = "record" | "review" | "analysing" | "result" | "error";
type Language = "en" | "zh";

// Web Speech API stubs for TypeScript
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 8) return "bg-floor-green";
  if (score >= 5) return "bg-amber-400";
  return "bg-red-400";
}

function scoreTextColor(score: number): string {
  if (score >= 8) return "text-floor-green";
  if (score >= 5) return "text-amber-500";
  return "text-red-500";
}

function ScoreBar({ label, data }: { label: string; data: StructureScore }) {
  const pct = Math.round((data.score / 10) * 100);
  return (
    <div className="space-y-1.5 border border-floor-line bg-floor-panel px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-floor-ink">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${scoreTextColor(data.score)}`}>
          {data.score}
          <span className="ml-0.5 text-xs font-normal text-floor-muted">/10</span>
        </span>
      </div>
      {/* progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-floor-line">
        <div
          className={`h-full rounded-full transition-all ${scoreColor(data.score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs leading-5 text-floor-muted">{data.note}</p>
    </div>
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fmtDuration(s: number) {
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

// ── Main component ─────────────────────────────────────────────────────────

export function PitchCoach() {
  // ── core state ──
  const [stage, setStage] = useState<Stage>("record");
  const [language, setLanguage] = useState<Language>("en");
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [result, setResult] = useState<PitchAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ── recording state ──
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);

  // refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const interimRef = useRef("");

  // ── speech recognition setup ──
  // Re-initialise when language changes so lang attribute is correct
  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    setSpeechSupported(true);
    const rec = new SpeechRecognitionCtor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = language === "zh" ? "zh-CN" : "en-US";

    rec.onresult = (event: SpeechRecognitionEvent) => {
      // IMPORTANT: start from event.resultIndex to avoid reprocessing
      // already-finalised results (which caused empty transcript bug)
      let newFinal = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          newFinal += res[0].transcript + " ";
        } else {
          interim += res[0].transcript;
        }
      }
      // Show interim in real-time as greyed-out text
      setInterimText(interim);
      if (newFinal) {
        setTranscript((prev) => prev + newFinal);
      }
    };

    rec.onend = () => {
      setInterimText("");
    };

    rec.onerror = () => {
      setInterimText("");
      /* silently ignore — user can type manually */
    };

    recognitionRef.current = rec;
  }, [language]);

  // ── countdown auto-stop at 45s ──
  useEffect(() => {
    if (elapsed >= 45 && isRecording) {
      void stopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, isRecording]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      // show live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        void videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        recordedBlobRef.current = new Blob(chunks, { type: "video/webm" });
        // show recorded preview
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(recordedBlobRef.current);
          videoRef.current.muted = false;
          videoRef.current.controls = true;
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();

      // start speech recognition
      if (recognitionRef.current && speechSupported) {
        setTranscript("");
        interimRef.current = "";
        recognitionRef.current.lang = language === "zh" ? "zh-CN" : "en-US";
        try {
          recognitionRef.current.start();
        } catch {
          /* already started */
        }
      }

      // start timer
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);

      setIsRecording(true);
    } catch (err) {
      console.error("Camera access denied", err);
      setErrorMsg(
        "Cannot access camera or microphone. Please allow access and try again.",
      );
    }
  }, [language, speechSupported]);

  const stopRecording = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    // stop all tracks
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    setStage("review");
  }, []);

  async function handleAnalyse() {
    if (!transcript.trim()) return;
    setStage("analysing");
    setErrorMsg("");
    try {
      const res = await fetch("/api/analyse-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcript.trim(),
          language,
          durationSeconds: elapsed,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as PitchAnalysisResult;
      setResult(data);
      setStage("result");
    } catch (err) {
      console.error(err);
      setErrorMsg("AI analysis failed. Please check your connection and try again.");
      setStage("error");
    }
  }

  function handleTryAgain() {
    // stop any lingering streams
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) {
      videoRef.current.src = "";
      videoRef.current.srcObject = null;
      videoRef.current.controls = false;
    }
    recordedBlobRef.current = null;
    setTranscript("");
    setElapsed(0);
    setResult(null);
    setErrorMsg("");
    setStage("record");
  }

  // ── local metrics (compute on result stage) ──
  const metrics =
    result && transcript
      ? computeLocalMetrics(transcript, elapsed, language)
      : null;

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">
      {/* ── Page header ── */}
      <div className="mb-8 space-y-2">
        <p className="text-sm font-medium text-floor-green">AI Elevator Pitch Coach</p>
        <h1 className="text-3xl font-semibold text-floor-ink">
          {stage === "result" ? "Your Pitch Feedback" : "Record Your 30-Second Pitch"}
        </h1>
        <p className="text-sm leading-6 text-floor-muted">
          {stage === "result"
            ? "Here is what an AI pitch coach heard — and how to say it more clearly."
            : "Record your pitch, get a transcript, then receive structured AI feedback in seconds."}
        </p>
      </div>

      {/* ── Language picker (only before result) ── */}
      {stage !== "result" && stage !== "analysing" ? (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-xs text-floor-muted">Pitch language:</span>
          {(["en", "zh"] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLanguage(l)}
              className={`border px-3 py-1 text-xs font-medium transition ${
                language === l
                  ? "border-floor-green bg-white text-floor-green"
                  : "border-floor-line bg-white/60 text-floor-muted hover:border-floor-green"
              }`}
            >
              {l === "en" ? "English" : "中文"}
            </button>
          ))}
        </div>
      ) : null}

      {/* ══════════════════════════════════════════════════
          STAGE: record
      ══════════════════════════════════════════════════ */}
      {stage === "record" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Video / camera panel — clicking the frame starts or stops recording */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                if (isRecording) void stopRecording();
                else void startRecording();
              }}
              className="group relative w-full overflow-hidden border border-floor-line bg-black aspect-video cursor-pointer focus:outline-none"
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
              />

              {/* idle — not yet started */}
              {!isRecording && elapsed === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 transition group-hover:bg-black/70">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/70 text-white group-hover:border-white">
                    <Mic size={26} />
                  </div>
                  <p className="text-sm font-medium text-white/80 group-hover:text-white">Click to start recording</p>
                </div>
              ) : null}

              {/* recording — show stop hint on hover */}
              {isRecording ? (
                <>
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-red-600 px-2 py-1">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    <span className="text-xs font-medium text-white">REC {fmtDuration(elapsed)}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-black/50">
                      <Square size={22} className="text-white" />
                    </div>
                  </div>
                </>
              ) : null}
            </button>

            {!speechSupported ? (
              <div className="flex items-start gap-2 border border-amber-200 bg-amber-50 p-3">
                <MicOff size={14} className="mt-0.5 shrink-0 text-amber-500" />
                <p className="text-xs text-amber-700">
                  Speech recognition is not supported in this browser. You can type or paste your transcript manually below.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 border border-floor-line bg-white/60 p-3">
                <Mic size={14} className="mt-0.5 shrink-0 text-floor-green" />
                <p className="text-xs text-floor-muted">
                  Browser speech recognition is active. Transcript will appear automatically while you record.
                </p>
              </div>
            )}
          </div>

          {/* Transcript panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-floor-ink">
                <Type size={15} />
                Transcript
              </div>
              <span className="text-xs text-floor-muted">
                {language === "zh" ? "支持实时语音转写或手动粘贴" : "Auto-transcribed or paste manually"}
              </span>
            </div>
            <div className="relative">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={
                  language === "zh"
                    ? "录制时自动转写，或在此手动粘贴文字……"
                    : "Auto-transcribed during recording, or paste manually here…"
                }
                rows={10}
                className="w-full border border-floor-line bg-white px-3 py-3 text-sm leading-6 text-floor-ink outline-none focus:border-floor-green relative z-10 bg-transparent"
              />
              {interimText && isRecording ? (
                <div className="absolute inset-0 px-3 py-3 text-sm leading-6 text-floor-muted/50 pointer-events-none z-0 whitespace-pre-wrap overflow-hidden">
                  {transcript}
                  <span className="text-floor-muted/70">{interimText}</span>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => void handleAnalyse()}
              disabled={!transcript.trim()}
              className="inline-flex w-full items-center justify-center gap-2 bg-floor-ink px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-floor-muted"
            >
              Analyse My Pitch
            </button>
            {!transcript.trim() ? (
              <p className="text-center text-xs text-floor-muted">
                Record a pitch or paste a transcript to continue.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ══════════════════════════════════════════════════
          STAGE: review (recorded, not yet analysed)
      ══════════════════════════════════════════════════ */}
      {stage === "review" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Video playback */}
          <div className="space-y-3">
            <div className="overflow-hidden border border-floor-line bg-black aspect-video">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                controls
              />
            </div>
            <p className="text-center text-xs text-floor-muted">
              <Clock size={12} className="mr-1 inline" />
              Recorded: {fmtDuration(elapsed)}
            </p>
            <button
              type="button"
              onClick={handleTryAgain}
              className="inline-flex w-full items-center justify-center gap-2 border border-floor-line bg-white px-4 py-2 text-sm font-medium text-floor-ink hover:border-floor-green"
            >
              <RotateCcw size={14} />
              Record Again
            </button>
          </div>

          {/* Edit transcript */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-floor-ink">
              <Type size={15} />
              Edit Transcript
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={10}
              placeholder={
                language === "zh"
                  ? "在此修改或补充文字……"
                  : "Edit or complete the transcript here…"
              }
              className="w-full border border-floor-line bg-white px-3 py-3 text-sm leading-6 text-floor-ink outline-none focus:border-floor-green"
            />
            <button
              type="button"
              onClick={() => void handleAnalyse()}
              disabled={!transcript.trim()}
              className="inline-flex w-full items-center justify-center gap-2 bg-floor-ink px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-floor-muted"
            >
              Analyse My Pitch
            </button>
          </div>
        </div>
      ) : null}

      {/* ══════════════════════════════════════════════════
          STAGE: analysing
      ══════════════════════════════════════════════════ */}
      {stage === "analysing" ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 border border-floor-line bg-white/70 p-10 text-center">
          <Loader2 size={32} className="animate-spin text-floor-green" />
          <p className="text-lg font-medium text-floor-ink">Analyzing your pitch…</p>
          <p className="text-sm text-floor-muted">The AI coach is reading your transcript.</p>
        </div>
      ) : null}

      {/* ══════════════════════════════════════════════════
          STAGE: error
      ══════════════════════════════════════════════════ */}
      {stage === "error" ? (
        <div className="space-y-4 border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-red-500" size={20} />
            <div>
              <p className="font-medium text-red-700">Analysis failed</p>
              <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void handleAnalyse()}
              className="inline-flex items-center gap-2 border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <RefreshCw size={14} />
              Retry Analysis
            </button>
            <button
              type="button"
              onClick={() => setStage("review")}
              className="inline-flex items-center gap-2 border border-floor-line bg-white px-4 py-2 text-sm font-medium text-floor-ink hover:border-floor-green"
            >
              Back to Transcript
            </button>
          </div>
        </div>
      ) : null}

      {/* ══════════════════════════════════════════════════
          STAGE: result
      ══════════════════════════════════════════════════ */}
      {stage === "result" && result ? (
        <div className="space-y-5">
          {/* Demo mode banner */}
          {result.demoMode ? (
            <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 p-4">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-amber-700">Demo Mode — Illustrative Feedback</p>
                <p className="mt-1 text-xs text-amber-600">
                  No <code>OPENAI_API_KEY</code> is configured. The feedback below is a fixed example and does not reflect your actual pitch.
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-5">
              {/* Video playback */}
              {recordedBlobRef.current ? (
                <div className="overflow-hidden border border-floor-line bg-black aspect-video">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    playsInline
                    controls
                  />
                </div>
              ) : null}

              {/* Delivery snapshot */}
              {metrics ? (
                <div className="border border-floor-line bg-white/80 p-4">
                  <p className="mb-3 text-sm font-semibold text-floor-ink">Delivery Snapshot</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-floor-panel p-3">
                      <p className="text-xl font-semibold text-floor-ink">
                        {fmtDuration(metrics.durationSeconds)}
                      </p>
                      <p className="mt-1 text-xs text-floor-muted">Duration</p>
                    </div>
                    <div className="bg-floor-panel p-3">
                      <p className="text-xl font-semibold text-floor-ink">{metrics.wordCount}</p>
                      <p className="mt-1 text-xs text-floor-muted">Words</p>
                    </div>
                    <div className="bg-floor-panel p-3">
                      <p className="text-xl font-semibold text-floor-ink">{metrics.fillerTotal}</p>
                      <p className="mt-1 text-xs text-floor-muted">Fillers</p>
                    </div>
                  </div>
                  {metrics.fillerWords.length > 0 ? (
                    <p className="mt-3 text-xs text-floor-muted">
                      Filler words:{" "}
                      {metrics.fillerWords.map((f) => `"${f.word}" ×${f.count}`).join(", ")}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Transcript display */}
              <div className="border border-floor-line bg-white/80 p-4">
                <p className="mb-2 text-sm font-semibold text-floor-ink">Your Transcript</p>
                <p className="text-sm leading-6 text-floor-muted">{transcript}</p>
              </div>
            </div>

            {/* Right column — AI feedback */}
            <div className="space-y-5">
              {/* What I understood */}
              <div className="border border-floor-line bg-white/80 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-floor-green">
                  What I Understood
                </p>
                <p className="text-sm leading-6 text-floor-ink">{result.summary}</p>
              </div>

              {/* Message structure */}
              <div className="border border-floor-line bg-white/80 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-floor-green">
                  Message Structure
                </p>
                <div className="grid gap-2">
                  {(
                    [
                      ["Target User", result.structure.targetUser],
                      ["Problem", result.structure.problem],
                      ["Solution", result.structure.solution],
                      ["Call to Action", result.structure.callToAction],
                    ] as [string, StructureScore][]
                  ).map(([label, scoreData]) => (
                    <ScoreBar key={label} label={label} data={scoreData} />
                  ))}
                </div>
              </div>

              {/* One thing to improve */}
              <div className="border border-floor-line bg-white p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-floor-green">
                  One Thing to Improve
                </p>
                <p className="text-sm leading-6 text-floor-ink">{result.priorityImprovement}</p>
              </div>

              {/* Suggested rewrite */}
              <div className="border border-floor-green bg-white p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-floor-green">
                  Suggested 30-Second Pitch
                </p>
                <p className="text-sm leading-6 text-floor-ink">{result.suggestedRewrite}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="inline-flex w-full items-center justify-center gap-2 bg-floor-ink px-4 py-3 text-sm font-medium text-white hover:bg-black"
                >
                  <RotateCcw size={15} />
                  Try Again
                </button>
                <Link
                  href="/elevator"
                  className="inline-flex w-full items-center justify-center gap-2 border border-floor-line bg-white px-4 py-2 text-sm font-medium text-floor-ink hover:border-floor-green"
                >
                  <ArrowLeft size={14} />
                  Back to Break Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
