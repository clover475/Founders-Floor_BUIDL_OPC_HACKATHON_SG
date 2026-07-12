"use client";

import { resetDemoData } from "@/lib/storage/repository";

export function DemoResetButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => {
        resetDemoData();
        window.location.reload();
      }}
      className="inline-flex items-center gap-2 border border-floor-line bg-white/70 px-4 py-3 text-sm font-medium text-floor-ink transition hover:bg-white"
    >
      {children}
    </button>
  );
}
