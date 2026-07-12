# Project Status

## Snapshot

- Current milestone: Vercel-deployed hackathon vertical slice with live Coffee Corner and Elevator Stage
- Current health: T1 to T3 complete; personal flow and Coffee Corner fallback are working
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
- T3 complete: implemented the one-table Coffee Corner with Supabase Presence wiring, four-seat capacity, local demo fallback, Jitsi iframe embed after join, external meeting fallback, and leave cleanup.

## In progress

- Ready for T4 Elevator Stage live interaction from `docs/tasks.md`.

## Current issues

- Exact on-stage pitch duration has not been announced.
- Product code must not be backdated or imported from an earlier codebase.
- Supabase project URL and publishable key still need to be configured before full two-browser live validation.

## Next steps

1. Execute T4 for Elevator Stage and audience feedback.
2. Execute T5 for Vercel deployment and stage hardening.
3. Configure Supabase and Vercel environment variables.
4. Record a backup demo and complete OpenArena submission credits before 18:00 SGT.

## Validation

- Command: `npm run lint`
- Result: Passed.
- Command: `npm run build`
- Result: Passed.
- Command: `curl -I http://localhost:3000/coffee-corner`
- Result: Returned HTTP 200 from the local dev server.
- Manual check: Coffee Corner can join in local demo mode without Supabase variables, shows four seats, opens the Jitsi iframe only after join, and uses a deterministic room name for all participants.
- Remaining gap: Two-browser Supabase Presence validation is pending until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are configured; Elevator Stage remains a placeholder until T4.
