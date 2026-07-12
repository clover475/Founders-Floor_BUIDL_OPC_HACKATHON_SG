# Project Status

## Snapshot

- Current milestone: Vercel-deployed hackathon vertical slice with live Coffee Corner and Elevator Stage
- Current health: T1 scaffold complete; local vertical slice starts next
- Last updated: 2026-07-12

## Completed

- Reviewed the participant handbook and Fresh Code requirements.
- Reviewed the Hackathon MVP V1.0 product specification.
- Chosen a single-app, local-first architecture.
- Defined the demo-critical vertical flow and non-goals.
- Created and pushed the public repository: https://github.com/clover475/Founders-Floor_BUIDL_OPC_HACKATHON_SG
- Decided on Supabase Realtime Presence/Broadcast without database tables or login.
- Decided on Jitsi iframe meetings instead of custom WebRTC.
- Reduced live concurrency to one four-seat Coffee Corner and one Elevator speaker.
- T1 complete: created the Next.js App Router, TypeScript, Tailwind, shared shell, domain/realtime types, local identity, demo fixtures, and versioned localStorage repository.

## In progress

- T2 personal vertical slice from `docs/tasks.md`.

## Current issues

- Exact on-stage pitch duration has not been announced.
- Product code must not be backdated or imported from an earlier codebase.
- Supabase project URL and publishable key still need to be configured.

## Next steps

1. Execute T2 from `docs/tasks.md` to establish the personal vertical slice.
2. Execute T3 for Coffee Corner realtime presence and Jitsi.
3. Execute T4 for Elevator Stage and audience feedback.
4. Execute T5 for Vercel deployment and stage hardening.
5. Record a backup demo and complete OpenArena submission credits before 18:00 SGT.

## Validation

- Command: `npm run lint`
- Result: Passed.
- Command: `npm run build`
- Result: Passed.
- Manual check: Home page includes a reset demo data control and realtime status handles missing Supabase variables without requiring configuration.
- Remaining gap: Full Clock In to Ship Wall journey is not implemented until T2.
