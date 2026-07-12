# Project Status

## Snapshot

- Current milestone: Global-ready public launch candidate with clickable Office Rooms, multi-room Coffee Corner, Elevator Stage, AI Elevator Pitch Coach, region picker, Community Board, and a persistent Work Log with an achievement forest
- Current health: T1-T9 pass local lint/build checks; T8 launch UX repairs are deployed and production single-browser validation passed; T9 (Work Log/history fix + judge-demo seed data) is merged and pushed to `main` (commit `8e14288`) but not yet deployed/production-validated; Coffee fifth-seat cap still needs a real five-device check
- Note: T9 was built against a stale local clone. Before pushing, 18 commits of parallel work (region picker + clock-in template persistence, Community Board merging desk-check requests with Ship Wall, AI Elevator Pitch Coach) had already landed on `origin/main` from another session. Merged cleanly with manual conflict resolution in `app-shell.tsx`, `clock-in-form.tsx`, and both message catalogs — no functional overlap, since Community Board (peer help) and Work Log/Forest (personal achievement history) are different concerns. Always `git fetch`/`git status` before starting work on this repo; it is being actively edited from more than one place.
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
- T8 complete: made homepage room cards clickable, removed the internal realtime status card from the public homepage, changed Coffee Corner into a selectable list of predefined voice rooms with independent Presence/Jitsi room ids, added ephemeral room title/topic editing for active coffee sessions, and reduced the Elevator Stage empty placeholder into an explicit waiting state.
- T9 complete: fixed the bug where clock-in history was never kept (`FounderSession` lived in a single overwritable localStorage slot and was deleted on clock-out, so nothing survived). Added `SessionRecord`/`archiveSession()` in `src/lib/storage/repository.ts` so every clock-out or room switch archives the prior session into a new `founders-floor:session-history:v1` key. Added `/work-log`, a page combining (a) full clock-in history — active/completed/switched, with duration — and (b) an achievement forest inspired by the Forest focus app: one tree per shipped outcome and one sprout per completed desk check, growing with achievements instead of elapsed time, with milestone callouts at 1/3/5/10/20/35/50/75/100 trees. Added a `workLog` nav item and English/Chinese copy.
- T9 judge-demo pass complete: added `seedShips`/`seedSessionHistory`/`seedDeskChecks` in `src/lib/demo-data.ts` — a nine-ship, twelve-record, seven-desk-check narrative of a founder building Founders' Floor itself across the hackathon week, timestamped relative to `Date.now()` so it always reads as recent. `loadShips`/`loadSessionHistory`/`loadDeskChecks` in the repository now fall back to this seed instead of an empty array, so Ship Wall, Work Log, and the Achievement Forest (15 trees pre-planted) look fully lived-in on first visit; any real clock-in/ship/desk-check a judge performs is appended on top of the seed, not instead of it. Removed the homepage "Reset demo data" button and `resetDemoData()` entirely (deleted `demo-reset-button.tsx`) so the seeded demo can't be wiped mid-judging; a judge who wants a truly blank state can clear the site's localStorage manually.

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

1. Run a two-browser Office Floor and Coffee room presence smoke test.
2. Run the public-launch safety pass before broad social distribution.
3. Repeat the Coffee/Elevator smoke test immediately before posting launch links.
4. If time remains, run the Coffee Corner fifth-seat check with five isolated devices/browsers.
5. Deploy T9 (Work Log/forest) and re-run the production smoke test on `/work-log`.

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
- T8 validation: `npm run lint` passed; `npm run build` passed. Local browser validation on port 3008 confirmed homepage Office Room cards are links to `/office/[room]`, the Supabase realtime status card is removed from the homepage, Coffee Corner shows four selectable voice rooms, selecting the AI Builder room changes the deterministic meeting room to `coffee-ai-builders`, and Elevator Stage shows a clear waiting label instead of an unexplained blank panel.
- T8 production validation: Vercel deployed commit `f79f048`; production Coffee Corner showed the multi-room voice room list, production homepage exposed `/office/[room]` card links and no realtime configuration card, and production Elevator Stage showed the explicit `STAGE WAITING` state.
- T8 remaining gap: multi-device validation has not been run yet for the new per-room Coffee Presence channels.
- T9 validation: `npm run lint` passed; `npm run build` passed, `/work-log` compiles as a static route. Local browser validation on port 5301 confirmed: clocking in and out archives the session into history with `endReason: "clockedOut"` and a linked `shipId`; clocking into a different room without clocking out archives the abandoned session with `endReason: "switchedSession"`; `/work-log` renders the in-progress session, switched session, and clocked-out session with correct room/goal/duration; the forest shows one tree per ship and one sprout per completed desk check with correct milestone countdown text; `/ship-wall` is unaffected; the demo reset button clears the new `founders-floor:session-history:v1` key along with the existing keys; 375px mobile width shows no horizontal overflow with the added nav item.
- T9 remaining gap: not yet deployed to Vercel; no production validation yet.
- T9 judge-demo validation: `npm run lint` passed; `npm run build` passed. Cleared localStorage to simulate a first-time judge visit: `/work-log` showed 15 pre-planted trees (9 ship-trees + 6 desk-check sprouts) with an 11-entry clock-in history spanning ~4 days, `/ship-wall` showed the 9 seeded ships, and the homepage no longer has a reset control. Performed one real Clock In -> Clock Out cycle on top of the seeded state and confirmed it appended (10 ships, 12 history entries, 16 trees) instead of overwriting the seed.
