# Project Status

## Snapshot

- Current milestone: Vercel-deployed hackathon vertical slice with live Coffee Corner and Elevator Stage
- Current health: T1 and T2 accepted; T3 correction complete; T4 review failed on speaker lifecycle and remains unaccepted; T5 repo-side hardening is conditionally accepted pending Vercel production validation
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
- Acceptance review completed for T1-T3: T1 and T2 passed their automated and manual checks; T3 passed its local fallback and meeting-room checks but is not fully accepted until Supabase two-browser validation is run.
- T3 correction complete: Coffee Corner observers now subscribe to live seat state before joining, Join only tracks the local user after taking a seat, Leave keeps observing the table, and an over-capacity presence sync automatically removes the local fifth participant from the table UI.
- T4 implementation complete: Elevator Stage now has speaker/audience role flow, one-speaker guard, 30-second round timer, Supabase Broadcast event handling, audience feedback aggregation, reset control, Jitsi meeting embed, and local save-to-Ship-Wall result.
- T5 repo-side hardening complete: added environment variable template, explicit Coffee/Elevator connecting/disconnected/full-stage states, Jitsi loading/slow-embed fallback, README deployment/demo instructions, and `docs/stage-checklist.md`.
- T4/T5 review completed: local lint/build and repository hygiene pass. T4 cannot be accepted because ending or resetting a round does not release the speaker Presence role, so other browsers can remain blocked after reset. T5 repository deliverables are present, but Vercel configuration and two-browser production tests remain Clover-owned acceptance steps.
- Backend boundary reconfirmed: keep the Supabase configuration/client seam and local repository abstraction, but do not add database tables, authentication, or server APIs during the hackathon. A persistent backend can be added after the interaction is validated.

## In progress

- T4 needs one focused correction before production validation: release or expire the speaker role when a round ends/resets, while preserving the one-speaker guard.
- Vercel/Supabase production validation remains. Clover will configure the deployed Vercel project and publishable variables.

## Current issues

- Exact on-stage pitch duration has not been announced.
- Product code must not be backdated or imported from an earlier codebase.
- Supabase project URL and publishable key still need to be configured before full two-browser live validation.
- Supabase Coffee Corner smoke test still needs a configured project to prove two browsers see each other within five seconds and that the fifth browser is blocked against live seat state.
- Supabase Elevator Stage smoke test still needs two browsers to prove the one-speaker guard and realtime feedback aggregation.
- Production smoke test has not been run because Vercel environment variables are not confirmed in this local session.
- T4 blocker: `endRound` and `resetRound` clear round state but never change/untrack the current speaker Presence role. After reset, other browsers still derive `speakerBlocked=true` from the stale speaker presence.
- T4 reliability gap: a browser that joins after `round_started` was broadcast sees the speaker Presence but cannot reconstruct the current pitch/round because Broadcast has no replay and Presence carries no round metadata.
- T4 validation gap: `round_started.endsAt` is checked only as a string; an invalid date payload is accepted and produces a non-terminating `NaN` countdown instead of being ignored.

## Next steps

1. Make one T4 correction commit for speaker release/expiry, late-join round recovery, and semantic `endsAt` validation.
2. Clover configures Vercel environment variables from `.env.example`.
3. Deploy from GitHub/Vercel and run the T3/T4 production two-browser smoke tests.
4. Record the backup demo using `docs/stage-checklist.md` and complete OpenArena submission credits before 18:00 SGT.

## Validation

- Command: `npm run lint`
- Result: Passed.
- Command: `npm run build`
- Result: Passed.
- Git check: T1, T2, and T3 are separate commits; the T3 implementation tip is `4022d4f` and the acceptance record is `d8d9de4`.
- Manual T1 check: missing Supabase variables show local fallback without crashing; demo reset clears saved ships.
- Manual T2 check: completed Clock In -> Feedback Room -> Desk Check -> Clock Out -> Ship Wall with project information blank; the session and ship survived refresh.
- Manual T3 check: local demo join changes the table from 0/4 to 1/4, opens exactly one Jitsi iframe after joining, external and embedded URLs use the same deterministic room, and leaving removes the iframe and returns to 0/4.
- T3 correction validation: `npm run lint` passed; `npm run build` passed. Code review confirms Coffee Corner subscribes as an observer before join and only tracks the user after Join.
- T4 validation: `npm run lint` passed; `npm run build` passed; local route check for `/elevator` returned HTTP 200. Elevator live behavior still needs Supabase browser validation.
- T5 validation: `npm run lint` passed; `npm run build` passed. Local route checks on port 3001 returned HTTP 200 for `/`, `/coffee-corner`, `/elevator`, and `/ship-wall`. Responsive browser checks at 1280px and 390px for Coffee Corner, Elevator Stage, and Ship Wall showed no horizontal overflow or over-wide buttons.
- T4/T5 review validation: `npm run lint` passed; `npm run build` passed; `git diff 89c45e9..1dcb5ee --check` passed; worktree was clean before this status-only review update. Static code review found the T4 speaker lifecycle blocker and the late-join/invalid-date reliability gaps above.
- Remaining gap: Two-browser Supabase Presence/Broadcast validation and production smoke testing are pending until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are configured in Vercel.
