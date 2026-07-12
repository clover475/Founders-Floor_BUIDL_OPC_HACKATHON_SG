# Execution Tasks

Each task should be one focused commit. The execution model must stop after each task, run its acceptance checks, and update `PROJECT_STATUS.md`.

## T1 — Scaffold and local domain foundation

- Create the Next.js App Router project with TypeScript and Tailwind.
- Add domain/realtime types, browser identity, demo fixtures, and versioned local repository.
- Add a warm visual shell and navigation.

Acceptance:

- `npm run build` and `npm run lint` pass.
- Demo data can be reset.
- Missing Supabase variables do not crash the app.

## T2 — Personal vertical slice

- Implement Lobby, Clock In, room presence cards, Clock Out, and Ship Wall.
- Add one Desk Check template and state transition.

Acceptance:

- A new browser completes the full journey.
- Refresh preserves the current session and ship.
- Project information remains optional.

## T3 — Coffee Corner live interaction

- Add Supabase client and reusable Presence hook.
- Implement one four-seat Coffee Corner.
- Embed Jitsi only after the user joins; default muted.
- Add external-tab fallback and leave cleanup.

Acceptance:

- Two browsers see each other within five seconds.
- Join/leave updates seat count.
- Both browsers resolve to the same meeting room.
- Local/demo fallback remains usable without Supabase.

## T4 — Elevator Stage live interaction

- Implement speaker/audience role selection and 30-second round.
- Broadcast start/end/reset and audience feedback.
- Aggregate feedback into the speaker's result card.
- Allow speaker to save the result locally.

Acceptance:

- One speaker guard is visible to both browsers.
- Audience feedback changes the speaker result without refresh.
- Stale rounds can be reset.
- Invalid or unrelated event payloads are ignored.

## T5 — Deploy and stage hardening

- Configure Vercel environment variables.
- Add loading, disconnected, full-table, and meeting-failure states.
- Verify desktop and mobile-width layouts.
- Update README credits and demo instructions.

Acceptance:

- Production build passes.
- Two-browser production smoke test passes.
- Core personal flow works after disabling realtime.
- Backup demo recording and submission checklist are ready.

## T6 — Global launch language switcher

- Add English and Simplified Chinese message catalogs with `use-intl`.
- Detect Chinese browser locales and remember explicit language choice locally.
- Translate the complete Clock In, Office, Desk Check, Coffee, Elevator, Clock Out, and Ship Wall flows.
- Keep one shared URL so social traffic and live room participation are not split by locale.

Acceptance:

- English and Chinese switch immediately from the global navigation.
- The chosen language survives navigation and refresh.
- Browser language sets the first-visit default when no preference exists.
- `npm run build` and `npm run lint` pass.
- A 390px-wide browser has no horizontal overflow.

## T7 — Live Office Floor presence

- Add a Supabase Presence observer for the ordinary Office Rooms.
- Track the current Clock In session only when the browser has an active local session.
- Show real online coworkers ahead of seeded examples.
- Mark seeded examples as demo and local fallback participants as local so public users are not misled.

Acceptance:

- `npm run build` and `npm run lint` pass.
- Office Rooms still work without Supabase variables.
- A visitor without a Clock In session can browse rooms without being tracked as a live coworker.
- A clocked-in local user appears in their selected room with a local fallback badge when realtime is unavailable.
- Demo coworkers remain visibly marked as demo.

## T8 — Launch UX repair for room navigation and coffee rooms

- Make homepage Office Room cards clickable entry points.
- Remove the internal realtime configuration card from the public homepage.
- Change Coffee Corner from one implied table to a list of predefined public voice rooms.
- Give each coffee room its own Presence channel and deterministic Jitsi room.
- Let the first/active participant set an ephemeral room title/topic through Presence.
- Reduce the empty Elevator Stage meeting placeholder and label it as a waiting state.

Acceptance:

- `npm run build` and `npm run lint` pass.
- Homepage cards navigate to `/office/[room]`.
- Homepage no longer shows the Supabase/realtime configuration card.
- Coffee Corner lets users choose among multiple rooms before joining.
- Selecting a coffee room changes the deterministic Jitsi room id.
- Elevator Stage no-role state is clearly labelled instead of appearing as unexplained empty space.
