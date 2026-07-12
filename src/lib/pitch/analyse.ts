// Local metrics calculated from transcript + duration — no AI needed

export type LocalMetrics = {
  durationSeconds: number;
  wordCount: number;
  fillerWords: { word: string; count: number }[];
  fillerTotal: number;
};

const FILLER_ZH = ["嗯", "呃", "然后", "就是", "那个", "其实"] as const;
const FILLER_EN = ["um", "uh", "like", "you know", "actually", "basically"] as const;

function countFiller(text: string, lang: "en" | "zh"): { word: string; count: number }[] {
  const lower = text.toLowerCase();
  const fillers = lang === "zh" ? FILLER_ZH : FILLER_EN;

  return fillers
    .map((word) => {
      let count = 0;
      // For multi-word fillers, use indexOf loop; for single words, use word boundary
      if (word.includes(" ")) {
        let pos = 0;
        while ((pos = lower.indexOf(word, pos)) !== -1) {
          count++;
          pos += word.length;
        }
      } else {
        // Simple occurrence count — intentionally loose for demo
        const re = new RegExp(word, "gi");
        count = (text.match(re) ?? []).length;
      }
      return { word, count };
    })
    .filter((f) => f.count > 0);
}

export function computeLocalMetrics(
  transcript: string,
  durationSeconds: number,
  lang: "en" | "zh",
): LocalMetrics {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const fillerWords = countFiller(transcript, lang);
  return {
    durationSeconds,
    wordCount: words.length,
    fillerWords,
    fillerTotal: fillerWords.reduce((sum, f) => sum + f.count, 0),
  };
}
