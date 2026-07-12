# Project Status

## Snapshot

- Current milestone: Vercel-deployed hackathon vertical slice with live Coffee Corner and Elevator Stage
- Current health: T1 and T2 accepted; T3 local fallback works but live capacity enforcement and two-browser validation remain open
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
- Acceptance review completed for T1-T3: T1 and T2 passed their automated and manual checks; T3 passed its local fallback and meeting-room checks but is not fully accepted yet.

## In progress

- T3 needs one bounded corrective task before T4: subscribe observers to Coffee Corner seat state before they join, then validate the four-seat guard with configured Supabase Realtime.

## Current issues

- Exact on-stage pitch duration has not been announced.
- Product code must not be backdated or imported from an earlier codebase.
- Supabase project URL and publishable key still need to be configured before full two-browser live validation.
- Coffee Corner currently subscribes to Presence only after a user joins. A fifth browser therefore cannot see that four seats are already occupied before joining, so the four-seat UI guard is not reliable in live mode.

## Next steps

1. Correct T3 so non-joined visitors observe live seat state and cannot join a full table.
2. Configure Supabase variables and run the T3 two-browser/five-browser capacity smoke test.
3. Execute T4 for Elevator Stage and audience feedback.
4. Execute T5 for Vercel deployment and stage hardening.
5. Record a backup demo and complete OpenArena submission credits before 18:00 SGT.

## Validation

- Command: `npm run lint`
- Result: Passed.
- Command: `npm run build`
- Result: Passed.
- Git check: T1, T2, and T3 are separate commits; the T3 implementation tip is `4022d4f` and the acceptance record is `d8d9de4`.
- Manual T1 check: missing Supabase variables show local fallback without crashing; demo reset clears saved ships.
- Manual T2 check: completed Clock In -> Feedback Room -> Desk Check -> Clock Out -> Ship Wall with project information blank; the session and ship survived refresh.
- Manual T3 check: local demo join changes the table from 0/4 to 1/4, opens exactly one Jitsi iframe after joining, external and embedded URLs use the same deterministic room, and leaving removes the iframe and returns to 0/4.
- Remaining gap: Two-browser Supabase Presence validation is pending until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are configured. Live four-seat enforcement must be corrected because observers do not subscribe until after joining.
