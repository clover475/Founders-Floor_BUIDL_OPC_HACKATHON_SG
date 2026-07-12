# Project Status

## Snapshot

- Current milestone: Vercel-deployed hackathon vertical slice with live Coffee Corner and Elevator Stage
- Current health: T1 and T2 complete; local personal demo flow is working
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
- T2 complete: implemented Lobby, Clock In, room presence cards, Desk Check, Clock Out, and Ship Wall with local persistence and optional project information.

## In progress

- Ready for T3 Coffee Corner live interaction from `docs/tasks.md`.

## Current issues

- Exact on-stage pitch duration has not been announced.
- Product code must not be backdated or imported from an earlier codebase.
- Supabase project URL and publishable key still need to be configured.

## Next steps

1. Execute T3 for Coffee Corner realtime presence and Jitsi.
2. Execute T4 for Elevator Stage and audience feedback.
3. Execute T5 for Vercel deployment and stage hardening.
4. Record a backup demo and complete OpenArena submission credits before 18:00 SGT.

## Validation

- Command: `npm run lint`
- Result: Passed.
- Command: `npm run build`
- Result: Passed.
- Manual check: Code path supports a new browser journey from `/clock-in` to `/office/[room]`, `/desk-check`, `/clock-out`, and `/ship-wall`; session, desk check, and ship records are stored in versioned localStorage and survive refresh.
- Remaining gap: Coffee Corner and Elevator Stage remain placeholders until T3/T4.
