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
| `/clock-out` | Submit a concrete outcome |
| `/ship-wall` | Celebrate work shipped today |

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app works without Supabase variables. In that mode, Coffee Corner and Elevator Stage show local demo states so the personal Clock In to Ship Wall journey still works.

## Vercel environment

Set these variables in Vercel Project Settings -> Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_EVENT_SLUG=founders-floor-hackathon
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
```

Use only the Supabase publishable browser key. Do not add a service-role key to Vercel or this repository.

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
