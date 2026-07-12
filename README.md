# Founders' Floor

> The virtual office for one-person companies.

Founders' Floor helps solo founders feel the presence of coworkers while they build. Members clock in, choose a room, share one goal, ask for a quick desk check, take a shared break, and clock out with something shipped.

## Hackathon scope

This repository is for **BUIDL_OPC_Hackathon_SG 2026**. The demo must prove one complete loop:

```text
Clock In → See coworkers → Ask or help → Take a break → Clock Out → Ship
```

The hackathon uses a strict Fresh Code Rule. All submitted code must be written during the official 11:00–18:00 SGT hacking period, with visible version-control history.

## Planned stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local browser storage behind a small repository interface
- Static demo members to make the office feel alive on first load
- Vercel deployment

No login, database, video calling, complex matching, or AI agent is required for the MVP.

## Planned routes

| Route | Purpose |
|---|---|
| `/` | Lobby and live floor overview |
| `/clock-in` | 60-second session setup |
| `/office/[room]` | Room and coworker presence |
| `/desk-check` | Request or accept quick help |
| `/break-room` | Move Together and Elevator Pitch |
| `/clock-out` | Submit a concrete outcome |
| `/ship-wall` | Celebrate work shipped today |

## Demo story

1. Clock in as a founder who is improving a landing-page pitch.
2. Enter the Feedback Room and see other builders.
3. Open a 10-minute desk check and mark it accepted.
4. Join a short shared break or run the Elevator Pitch timer.
5. Clock out with an updated one-line pitch.
6. See the result appear on the Ship Wall.

## Project memory

- [Product scope](docs/product.md)
- [Architecture](docs/architecture.md)
- [Data schema](docs/data-schema.md)
- [Hackathon compliance](docs/hackathon.md)
- [Design rationale](docs/design-rationale.md)
- [Decisions](docs/decisions.md)
- [Current status](PROJECT_STATUS.md)

## Credits

Built by Clover Li with AI-assisted development during BUIDL_OPC_Hackathon_SG 2026. Third-party libraries and assets will be listed here before submission.
