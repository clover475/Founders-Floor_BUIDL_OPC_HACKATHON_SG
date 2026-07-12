# Architecture

## Decision summary

Use one Next.js application with local-first persistence. This minimizes build risk, creates a stage-safe demo, and keeps a clean seam for a later realtime backend.

## Deployment shape

```text
Browser
  └─ Next.js app
      ├─ Server-rendered shell and metadata
      ├─ Client interaction features
      ├─ Demo fixtures
      └─ StorageRepository
          └─ localStorage (MVP)

Later: StorageRepository → Supabase adapter
```

## Planned repository structure

```text
src/
  app/
    page.tsx
    clock-in/page.tsx
    office/[room]/page.tsx
    desk-check/page.tsx
    break-room/page.tsx
    clock-out/page.tsx
    ship-wall/page.tsx
  components/
    layout/
    office/
    desk-check/
    break-room/
    ship-wall/
    ui/
  features/
    sessions/
    interactions/
    pitches/
    ships/
  lib/
    storage/
      repository.ts
      local-storage.ts
    demo-data.ts
    stats.ts
  types/
    domain.ts
public/
docs/
```

## Module responsibilities

| Module | Owns | Does not own |
|---|---|---|
| `app` | Routes, page composition, metadata | Domain rules |
| `components` | Presentational and reusable UI | Persistence |
| `features/sessions` | Clock in/out and current status | Room visuals |
| `features/interactions` | Desk Check lifecycle | Messaging/video |
| `features/pitches` | Timer and feedback aggregation | AI coaching |
| `features/ships` | Outcome submission and celebration | Long-term analytics |
| `lib/storage` | CRUD boundary and browser persistence | UI state |
| `lib/demo-data` | Seeded coworkers and activity | User-entered personal data |

## State model

- Canonical domain data: `members`, `sessions`, `deskChecks`, `pitches`, `pitchFeedback`, `ships`.
- UI-only state: modals, timer state, room filters, celebration animation.
- Persist domain data with a versioned localStorage envelope.
- Seed demo data only when no stored state exists.
- Use a hydration guard before reading browser storage.

## Data flow

```text
User action
→ feature command
→ StorageRepository mutation
→ state refresh
→ derived statistics
→ UI update
```

## Stage-safety rules

- No required external API calls during the demo.
- No login or secret keys.
- Provide Reset Demo Data for a repeatable presentation.
- Keep a pre-seeded happy path.
- Record a backup demo video before submission.

## Future backend seam

The storage interface should expose simple async methods even when backed by localStorage. A future Supabase adapter can then add shared rooms and realtime feedback without rewriting feature components.

## Risks

| Risk | Response |
|---|---|
| Too many screens for seven hours | Build a vertical slice first; games are last |
| localStorage hydration mismatch | Isolate reads to client components and show a loading shell |
| Demo feels fake | Seed believable members, allow genuine local actions, show immediate outcomes |
| Weak link to Agentic Services theme | Pitch as social infrastructure for AI-amplified founders; do not claim an AI agent that is not built |
| Network failure on stage | Local-first runtime and backup recording |
| Commit-history disqualification | Small chronological commits from the official hacking window |
