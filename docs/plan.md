# Plan

## Target milestone

- Name: Vercel-deployed hackathon vertical slice with live Coffee Corner and Elevator Stage
- Why now: The product must be a working website and prove that real people can join its most memorable social moments.

## Scope boundary

### In

- Complete personal Clock In → Office → Desk Check → Clock Out → Ship Wall journey.
- Shared Coffee Corner presence with one four-seat Jitsi meeting.
- Shared Elevator Stage with one speaker, realtime audience, structured feedback, and a result card.
- Vercel deployment and two-browser validation.

### Out

- Database tables, accounts, private rooms, chat, dynamic meeting creation, more games, matching, and production moderation.

## Acceptance criteria

1. The personal journey works with no Supabase configuration.
2. Two browsers see each other join and leave Coffee Corner.
3. Coffee participants can enter the same Jitsi meeting or use the new-tab fallback.
4. One browser can start an Elevator round and another can submit feedback in realtime.
5. The speaker receives a result card and can save it locally.
6. The deployed Vercel URL passes the same smoke test.

## Dependencies

- Supabase project URL and publishable key.
- Realtime public channels enabled.
- Vercel environment variables configured.
- Jitsi public iframe availability; new-tab fallback is mandatory.

## Milestones

1. Local vertical slice and visual system.
2. Coffee Corner realtime presence and meeting.
3. Elevator Stage realtime round and feedback.
4. Vercel deployment, fallback verification, and demo recording.

## Recommended first task

- Task: Scaffold Next.js and implement the shared domain types, demo fixtures, local repository, and Clock In → Office → Ship Wall flow.
- Why first: It proves the product, supplies all later identity/state context, and remains a valid demo if realtime integration fails.
