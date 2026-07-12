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
