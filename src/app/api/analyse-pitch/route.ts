import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type PitchAnalysisRequest = {
  transcript: string;
  language: "en" | "zh";
  durationSeconds: number;
};

export type StructureScore = {
  score: number; // 0-10
  note: string;  // one-line coaching note
};

export type PitchAnalysisResult = {
  summary: string;
  structure: {
    targetUser: StructureScore;
    problem: StructureScore;
    solution: StructureScore;
    callToAction: StructureScore;
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
    targetUser: { score: 5, note: "Broad audience mentioned but no specific persona named" },
    problem:    { score: 4, note: "Pain point implied but not stated directly" },
    solution:   { score: 6, note: "Product described but the key differentiator is vague" },
    callToAction: { score: 1, note: "No clear next step or ask given" },
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
    targetUser: { score: 5, note: "提到创业者群体，但没有具体描述是哪类人" },
    problem:    { score: 4, note: "痛点有所暗示，但未直接说明" },
    solution:   { score: 6, note: "产品有描述，但核心差异点不够清晰" },
    callToAction: { score: 1, note: "没有明确的下一步行动号召" },
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

Then score exactly four elements on a scale of 0 to 10:
1. targetUser  — how clearly the specific target user is identified
2. problem     — how clearly the problem they face is stated
3. solution    — how clearly the product/solution is explained
4. callToAction — how clear and concrete the ask or next step is

For each element provide:
- score: integer 0-10
- note: one short coaching sentence (max 12 words) explaining the score

Give only one priority improvement — the single most important thing to fix.

Rewrite the pitch into a clearer 30-second version (~75 words) preserving the founder's original facts. Do not add invented facts.

Return ONLY valid JSON with this exact schema, no markdown fences:
{
  "summary": "string",
  "structure": {
    "targetUser":   { "score": 0-10, "note": "string" },
    "problem":      { "score": 0-10, "note": "string" },
    "solution":     { "score": 0-10, "note": "string" },
    "callToAction": { "score": 0-10, "note": "string" }
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

    const apiKey = process.env.LLM_API_KEY ?? process.env.OPENAI_API_KEY;

    // No API key → return clearly labeled demo result
    if (!apiKey) {
      const demo = body.language === "zh" ? DEMO_RESULT_ZH : DEMO_RESULT_EN;
      return NextResponse.json(demo);
    }

    // Provider-agnostic: supports OpenAI, DeepSeek, or any OpenAI-compatible API
    // DeepSeek example: LLM_BASE_URL=https://api.deepseek.com/v1  LLM_MODEL=deepseek-chat
    const baseUrl =
      process.env.LLM_BASE_URL ??
      process.env.OPENAI_BASE_URL ??
      "https://api.openai.com/v1";
    const model =
      process.env.LLM_MODEL ??
      process.env.OPENAI_MODEL ??
      "gpt-4o-mini";

    const llmRes = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(body) },
        ],
      }),
    });

    if (!llmRes.ok) {
      const errText = await llmRes.text();
      console.error("LLM error", llmRes.status, errText);
      return NextResponse.json(
        { error: "AI service error", detail: llmRes.status },
        { status: 502 },
      );
    }

    const llmData = (await llmRes.json()) as {
      choices: { message: { content: string } }[];
    };

    const raw = llmData.choices[0]?.message?.content ?? "{}";
    const result = JSON.parse(raw) as PitchAnalysisResult;
    result.demoMode = false;

    return NextResponse.json(result);
  } catch (err) {
    console.error("analyse-pitch error", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
