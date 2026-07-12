# Founders' Floor

> The virtual office for one-person companies.

Founders' Floor helps solo founders feel the presence of coworkers while they build. Members clock in, choose a room, share one goal, ask for a quick desk check, take a shared break, and clock out with something shipped.

## Hackathon scope

This repository is for **BUIDL_OPC_Hackathon_SG 2026**. The demo must prove one complete loop:

```text
Clock In → See coworkers → Ask or help → Take a break → Clock Out → Ship
```

The hackathon uses a strict Fresh Code Rule. All submitted code must be written during the official 11:00–18:00 SGT hacking period, with visible version-control history.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local browser storage for the personal demo journey
- Supabase Realtime for live presence, room state, and audience feedback
- Jitsi iframe meetings for Coffee Corner and Elevator Stage
- English and Simplified Chinese interface powered by `use-intl`
- Vercel deployment

No login, database tables, custom WebRTC, complex matching, or AI agent is required for the MVP.

## Planned routes

| Route | Purpose |
|---|---|
| `/` | Lobby and live floor overview |
| `/clock-in` | 60-second session setup |
| `/office/[room]` | Room and coworker presence |
| `/desk-check` | Request or accept quick help |
| `/coffee-corner` | Join the shared four-seat live coffee table |
| `/elevator` | Join a live pitch stage or audience |
| `/pitch-coach` | **AI Elevator Pitch Coach** (solo practice) |
| `/clock-out` | Submit a concrete outcome |
| `/ship-wall` | Celebrate work shipped today |

## AI Elevator Pitch Coach

`/pitch-coach` is a solo practice tool that lets a founder:

1. **Record** up to 45 seconds of video using the browser camera.
2. **Get a transcript** — the browser's native `SpeechRecognition` API auto-transcribes while recording. The transcript is always editable so the founder can correct or paste text manually.
3. **Analyse** — click **Analyse My Pitch** to POST the transcript to `/api/analyse-pitch`.
4. **Receive structured AI feedback**:
   - *What I Understood* — one sentence summary from a listener's perspective
   - *Message Structure* — four elements rated clear / partial / missing: Target User, Problem, Solution, Call to Action
   - *One Thing to Improve* — a single priority action for the next attempt
   - *Suggested 30-Second Pitch* — an AI rewrite that preserves the founder's facts
5. **Delivery Snapshot** — local metrics computed without any API: duration, word count, and filler-word count (supports both Chinese and English fillers).
6. **Try Again** — reset and re-record immediately.

### Real AI vs Demo Mode

| Condition | Behaviour |
|---|---|
| `OPENAI_API_KEY` is set | Real GPT analysis via `/api/analyse-pitch` |
| `OPENAI_API_KEY` is missing | Fixed example feedback with a visible **Demo Mode** banner |

The demo result is never presented as real AI output. The banner reads: *"No OPENAI_API_KEY is configured. The feedback below is a fixed example and does not reflect your actual pitch."*

### Environment variables for AI Coach

Add to Vercel Project Settings → Environment Variables (server-side only, never prefixed `NEXT_PUBLIC_`):

```text
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini   # optional, defaults to gpt-4o-mini
```

### What is NOT implemented (by design)

MediaPipe, face/emotion detection, gaze tracking, Whisper, FFmpeg, video upload, persistent storage, login, or scoring numbers.



```bash
npm install
cp .env.example .env.local
npm run dev
```

The app works without Supabase variables. In that mode, Coffee Corner and Elevator Stage show local demo states so the personal Clock In to Ship Wall journey still works.

## Vercel environment

The app supports Supabase's Vercel integration variables. If the integration creates
`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, the Next.js build maps them to the
public browser config automatically.

Manual fallback variables are also supported in Vercel Project Settings ->
Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_EVENT_SLUG=founders-floor-hackathon
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
```

Use only the Supabase publishable browser key for public realtime config. Do not
use a service-role key in browser-facing variables or this repository.

## Demo story

1. Clock in as a founder who is improving a landing-page pitch.
2. Enter the Feedback Room and see other builders.
3. Open a 10-minute desk check and mark it accepted.
4. Join Coffee Corner for a short shared break or run Elevator Stage with one speaker and one audience browser.
5. Clock out with an updated one-line pitch.
6. See the result appear on the Ship Wall.

## Smoke tests

Before presenting:

- `npm run lint`
- `npm run build`
- Open one browser with realtime disabled and complete Clock In -> Desk Check -> Clock Out -> Ship Wall.
- Open two browsers on `/coffee-corner`; join from both and confirm both use the same Jitsi room.
- Open two browsers on `/elevator`; start one round as speaker, join from the second browser as audience, submit feedback, and confirm the speaker result card updates.
- Open the app at a mobile width and confirm Coffee Corner, Elevator Stage, and Ship Wall remain usable.

See [stage checklist](docs/stage-checklist.md) for the timed demo and backup recording plan.

## Project memory

- [Product scope](docs/product.md)
- [Architecture](docs/architecture.md)
- [Data schema](docs/data-schema.md)
- [Hackathon compliance](docs/hackathon.md)
- [Design rationale](docs/design-rationale.md)
- [Decisions](docs/decisions.md)
- [Current status](PROJECT_STATUS.md)

## Credits

Built by Clover Li with AI-assisted development during BUIDL_OPC_Hackathon_SG 2026.

Third-party libraries and services used in the MVP:

- Next.js, React, TypeScript, and Tailwind CSS for the web app.
- Supabase Realtime Presence and Broadcast for ephemeral Coffee Corner seats and Elevator Stage feedback.
- Jitsi Meet iframe URLs for live Coffee Corner and Elevator Stage conversation.
- Lucide React for interface icons.
- `use-intl`, the React core package from the next-intl project, for ICU message formatting and locale context.
