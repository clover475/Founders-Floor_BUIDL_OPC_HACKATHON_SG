# Project Status

## Snapshot

- Current milestone: Global-ready public launch candidate with live Office Floor, Coffee Corner, and Elevator Stage
- Current health: T1-T6 passed their local checks; T7 live Office Floor presence is deployed and single-browser production validation passed; T3 fifth-seat cap still needs a real five-device check
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
- Deployment env compatibility added: `next.config.ts` maps Supabase Vercel integration variables (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_ANON_KEY`) into the browser-facing `NEXT_PUBLIC_SUPABASE_*` values at build time.
- T4 correction complete: Elevator speaker Presence now carries active round metadata for late join recovery, stale or expired speaker Presence no longer blocks the stage, and end/reset/timeout paths release the local speaker role back to audience.
- T6 complete: added English and Simplified Chinese catalogs using `use-intl`, browser-language detection, persistent manual switching, localized core product flows, locale-aware Ship Wall dates, and a mobile-safe global language control.
- T7 complete: added `floor:lobby:{eventSlug}` Supabase Presence for ordinary Office Rooms, observer-only browsing for visitors without an active Clock In session, real coworker cards ahead of seeded examples, and explicit live/local/demo badges so public users can distinguish real participants from fallback data.

## In progress

- Production validation is complete for the two-browser Coffee Corner and Elevator Stage demo path.

## Current issues

- Exact on-stage pitch duration has not been announced.
- Product code must not be backdated or imported from an earlier codebase.
- Supabase project URL and publishable key need to be available in Vercel via either manual `NEXT_PUBLIC_SUPABASE_*` variables or Supabase integration variables before full two-browser live validation.
- Supabase Coffee Corner two-browser smoke test passed; fifth-seat blocking still needs a real five-device or five-isolated-browser check.
- Supabase Elevator Stage two-browser smoke test passed for one-speaker guard, audience feedback aggregation, reset release, and starting a second round from the other browser.
- Production smoke test confirms Supabase env is present on the deployed site.

## Next steps

1. Run a two-browser Office Floor presence smoke test.
2. Run the public-launch safety pass before broad social distribution.
3. Repeat the Coffee/Elevator smoke test immediately before posting launch links.
4. If time remains, run the Coffee Corner fifth-seat check with five isolated devices/browsers.

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
- Deployment env mapping validation: production homepage shows Supabase realtime variables are configured after Vercel redeploy.
- T4 correction validation: `npm run lint` passed; `npm run build` passed. Static review confirms speaker Presence includes active round metadata, `round_started.endsAt` requires a valid date, late joiners can recover live rounds from Presence sync, and end/reset/timeout paths release the local speaker role.
- Production validation: homepage showed `Configured` and no local fallback. Coffee Corner passed two-browser realtime sync: both browsers connected, seat count moved from 0/4 to 1/4 to 2/4, both saw the same deterministic Jitsi room, and both loaded an iframe. Elevator Stage passed two-browser realtime sync: one browser started a round, the other saw the live pitch, joined as audience, submitted feedback, and the speaker result card updated to 1 understood / 1 follow-up / 1 user signal with the audience question. Reset returned both browsers to Stage open, and the second browser successfully started a new round.
- Remaining gap: Coffee Corner fifth-seat cap has not been tested with five isolated identities in production.
- T6 validation: `npm run lint` passed; `npm run build` passed; translation hard-code scan found only brand metadata, the name example, and the language control labels. Browser validation confirmed English-to-Chinese and Chinese-to-English switching, Chinese preference persistence across navigation, translated Coffee Corner content, and a 390px Clock In layout with `scrollWidth` equal to `innerWidth`.
- T6 production validation: Vercel deployed commit `56f057e`; a Chinese-browser visit opened in Chinese, switching to English updated the full navigation, and the English choice persisted when navigating to Coffee Corner. Supabase remained configured on the production homepage.
- T7 validation: `npm run lint` passed; `npm run build` passed. Local browser validation on port 3007 confirmed that a visitor without an active Clock In session sees only demo-marked seeded coworkers, and a clocked-in user appears in the selected room with a local fallback badge when Supabase variables are unavailable locally.
- T7 production validation: Vercel deployed commit `31331c9`; `/office/idea` showed `LIVE FLOOR CONNECTED` and demo-marked seeded coworkers. A production Clock In showed the current browser as `LIVE` in Idea Room and kept seeded coworkers marked `DEMO`.
- T7 remaining gap: two isolated browsers/devices have not yet been used to confirm that two distinct Office Floor participants see each other within five seconds.
