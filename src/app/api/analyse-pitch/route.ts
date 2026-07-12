import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type PitchAnalysisRequest = {
  transcript: string;
  language: "en" | "zh";
  durationSeconds: number;
};

export type StructureRating = "clear" | "partial" | "missing";

export type PitchAnalysisResult = {
  summary: string;
  structure: {
    targetUser: StructureRating;
    problem: StructureRating;
    solution: StructureRating;
    callToAction: StructureRating;
  };
  priorityImprovement: string;
  suggestedRewrite: string;
  demoMode?: boolean;
};

// Fixed demo response — clearly labeled, not presented as real AI output
const DEMO_RESULT_EN: PitchAnalysisResult = {
  demoMode: true,
  summary:
    "A listener would understand that this founder is building something for a broad audience, but the specific user and problem remain unclear.",
  structure: {
    targetUser: "partial",
    problem: "partial",
    solution: "partial",
    callToAction: "missing",
  },
  priorityImprovement:
    "Name your target user in the first sentence. Who specifically has this problem every day?",
  suggestedRewrite:
    "Solo founders lose hours each week to solo decisions with no one to sanity-check them. Founders' Floor is a virtual co-working room where you clock in, see who else is building, and ask for a 10-minute desk check — no meetings, just momentum. We're looking for 10 founders to join today's beta.",
};

const DEMO_RESULT_ZH: PitchAnalysisResult = {
  demoMode: true,
  summary:
    "听众会理解这位创业者在做某件和创业者相关的事，但目标用户和具体问题还不清晰。",
  structure: {
    targetUser: "partial",
    problem: "partial",
    solution: "partial",
    callToAction: "missing",
  },
  priorityImprovement:
    "在第一句话中点名你的目标用户。具体是谁每天面对这个问题？",
  suggestedRewrite:
    "一人公司的创业者每周都会因为没有人可以商量而浪费大量时间。Founders' Floor 是一个虚拟共同办公室，你可以签到上班、看到谁在 build、发起十分钟快速检查——不用开会，只需推进。我们今天在寻找 10 位创始人加入内测。",
};

const SYSTEM_PROMPT = `You are an elevator pitch coach for solo founders.

Analyse the provided pitch transcript.

Do not invent users, traction, revenue, evidence, partnerships, or product features that are not present in the transcript.

First, explain in one sentence what a listener would understand from the pitch.

Then evaluate only four elements:
1. Target user
2. Problem
3. Solution
4. Call to action

Each element must be rated as exactly one of: "clear", "partial", or "missing".

Give only one priority improvement — the single most important thing to fix in the next attempt.

Rewrite the pitch into a clearer 30-second version (approximately 75 words) while preserving the founder's original facts and intent. Do not add invented facts.

Return ONLY valid JSON matching this exact schema, with no markdown fences or extra text:
{
  "summary": "string",
  "structure": {
    "targetUser": "clear | partial | missing",
    "problem": "clear | partial | missing",
    "solution": "clear | partial | missing",
    "callToAction": "clear | partial | missing"
  },
  "priorityImprovement": "string",
  "suggestedRewrite": "string"
}`;

function buildUserMessage(req: PitchAnalysisRequest): string {
  const lang = req.language === "zh" ? "Chinese" : "English";
  return `Language: ${lang}
Duration: ${req.durationSeconds} seconds
Transcript:
${req.transcript}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PitchAnalysisRequest;

    if (!body.transcript?.trim()) {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // No API key → return clearly labeled demo result
    if (!apiKey) {
      const demo = body.language === "zh" ? DEMO_RESULT_ZH : DEMO_RESULT_EN;
      return NextResponse.json(demo);
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(body) },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error", openaiRes.status, errText);
      return NextResponse.json(
        { error: "AI service error", detail: openaiRes.status },
        { status: 502 },
      );
    }

    const openaiData = (await openaiRes.json()) as {
      choices: { message: { content: string } }[];
    };

    const raw = openaiData.choices[0]?.message?.content ?? "{}";
    const result = JSON.parse(raw) as PitchAnalysisResult;
    result.demoMode = false;

    return NextResponse.json(result);
  } catch (err) {
    console.error("analyse-pitch error", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
