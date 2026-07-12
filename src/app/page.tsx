import Link from "next/link";
import { ArrowRight, Building2, RotateCcw, UsersRound } from "lucide-react";
import { DemoResetButton } from "@/components/office/demo-reset-button";
import { RealtimeStatus } from "@/components/live/realtime-status";

const rooms = [
  { name: "Idea Room", detail: "Explore directions and sharpen rough ideas." },
  { name: "Build Room", detail: "Work beside other builders shipping MVPs." },
  { name: "Feedback Room", detail: "Ask for quick eyes on positioning or flow." },
  { name: "Growth Room", detail: "Draft outreach, launch notes, and first-user moves." },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 border border-floor-line bg-white/70 px-3 py-2 text-sm text-floor-muted">
            <Building2 size={16} aria-hidden="true" />
            The office for one-person companies
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-floor-ink sm:text-6xl">
              Founders&apos; Floor
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-floor-muted">
              Clock in, see who else is building, ask for a ten-minute desk
              check, and clock out with something shipped.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/clock-in"
              className="inline-flex items-center gap-2 bg-floor-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
            >
              Clock in
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <DemoResetButton>
              <RotateCcw size={16} aria-hidden="true" />
              Reset demo data
            </DemoResetButton>
          </div>
        </div>
        <div className="border border-floor-line bg-white/75 p-4 shadow-soft">
          <RealtimeStatus />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {rooms.map((room) => (
          <div key={room.name} className="border border-floor-line bg-white/70 p-4">
            <div className="mb-5 flex h-9 w-9 items-center justify-center bg-floor-panel text-floor-green">
              <UsersRound size={19} aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-floor-ink">{room.name}</h2>
            <p className="mt-2 text-sm leading-6 text-floor-muted">{room.detail}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
