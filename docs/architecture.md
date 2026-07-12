# Architecture

## Decision summary

Use one Next.js application with two deliberately separate state layers:

1. **Personal durable state:** localStorage holds the current browser's Clock In session, Desk Checks, and Ships.
2. **Shared ephemeral state:** Supabase Realtime Presence and Broadcast let multiple browsers see and participate in Coffee Corner and Elevator Stage.

Use Jitsi's IFrame API for live audio/video. Founders' Floor coordinates the people and the activity; it does not implement a meeting stack.

## Deployment shape

```text
Vercel
  └─ Next.js app
      ├─ Personal demo flow
      │   └─ LocalStorageRepository
      ├─ Live coordination
      │   └─ Supabase Realtime
      │       ├─ Presence: who is here / current activity
      │       └─ Broadcast: round events / audience feedback
      └─ Live conversation
          └─ Jitsi iframe or open-in-new-tab fallback
```

No application database, server actions, custom API routes, or authentication are required for the MVP.

## Product-level realtime model

### Coffee Corner

- Exactly one shared public table in the MVP.
- Capacity shown as four seats; joining after four displays “table full”.
- Presence payload identifies each browser by a locally generated UUID and nickname.
- Participants join one deterministic Jitsi room derived from `NEXT_PUBLIC_EVENT_SLUG`.
- Audio starts muted to avoid venue feedback; users explicitly unmute.
- Leaving the page untracks presence and disposes the meeting iframe.

This is intentionally not private and not suitable for sensitive discussion.

### Elevator Stage

- Exactly one public stage and one active round at a time.
- One browser starts a 30-second round as speaker.
- Speaker and listeners share one deterministic Jitsi room.
- Realtime Presence shows the speaker and listener count.
- Broadcast events coordinate the activity:

```text
round_started
tick_sync          (optional; local countdown remains authoritative)
feedback_submitted
round_ended
round_reset
```

- Audience feedback is aggregated in the speaker's browser during the round.
- Result persistence is local to the speaker; realtime feedback is ephemeral.
- No distributed lock is built. The UI disables “Start” while a speaker is present; a host can reset a stale round.

## Why this is the minimum

| Alternative | Rejected because |
|---|---|
| Build WebRTC | Too risky and unrelated to the product insight |
| Daily/LiveKit dynamic rooms | Requires token APIs and backend room lifecycle |
| Supabase database + anonymous auth | Adds tables, RLS, cleanup, and failure modes not needed for a live round |
| External meeting link only | Provides conversation but no in-product presence, state, or feedback |
| Multiple coffee tables | Introduces room discovery, concurrency, and moderation before value is proven |

## Planned repository structure

```text
src/
  app/
    page.tsx
    clock-in/page.tsx
    office/[room]/page.tsx
    desk-check/page.tsx
    coffee-corner/page.tsx
    elevator/page.tsx
    break-room/page.tsx
    clock-out/page.tsx
    ship-wall/page.tsx
  components/
    layout/
    office/
    desk-check/
    live/
      presence-list.tsx
      jitsi-meeting.tsx
      realtime-status.tsx
    elevator/
    ship-wall/
    ui/
  features/
    sessions/
    interactions/
    coffee/
    elevator/
    ships/
  lib/
    storage/
      repository.ts
      local-storage.ts
    realtime/
      client.ts
      use-floor-presence.ts
      use-elevator-channel.ts
    identity.ts
    demo-data.ts
    stats.ts
  types/
    domain.ts
    realtime.ts
public/
docs/
```

## Channel contracts

### `floor:lobby:{eventSlug}`

Presence payload:

```ts
type FloorPresence = {
  participantId: string;
  nickname: string;
  room: "idea" | "build" | "feedback" | "growth" | "break";
  activity: "focused" | "open_to_chat" | "coffee" | "elevator";
  goal?: string;
  onlineAt: string;
};
```

### `floor:coffee:{eventSlug}`

Presence payload:

```ts
type CoffeePresence = {
  participantId: string;
  nickname: string;
  joinedAt: string;
};
```

### `floor:elevator:{eventSlug}`

Presence payload:

```ts
type ElevatorPresence = {
  participantId: string;
  nickname: string;
  role: "speaker" | "audience";
  joinedAt: string;
};
```

Broadcast payload:

```ts
type ElevatorEvent =
  | { type: "round_started"; roundId: string; speakerId: string; pitch: string; endsAt: string }
  | { type: "feedback_submitted"; roundId: string; feedback: PitchFeedbackInput }
  | { type: "round_ended"; roundId: string }
  | { type: "round_reset"; roundId: string };
```

All incoming payloads must be runtime-validated before use.

## Environment variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_EVENT_SLUG=founders-floor-hackathon
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
```

Only publishable browser-safe values are permitted. No service-role key belongs in Vercel or the repository.

## Failure and fallback behavior

| Failure | Required behavior |
|---|---|
| Supabase env missing | Show demo coworkers and “Live mode unavailable”; personal flow still works |
| Realtime disconnects | Preserve current page; retry connection; never lose local Clock In/Ship data |
| Jitsi fails to embed | Show “Open meeting in a new tab” with the same room URL |
| Coffee table full | Allow watching seat state; do not silently exceed four in the website UI |
| Elevator speaker disappears | After a short timeout, show host Reset Round control |
| Venue audio echo | Default audio/video muted and show a headphones reminder |

## Security and privacy boundary

- Do not collect email, phone, social profiles, or precise location.
- Display names and pitch text are public to current channel participants.
- Never use meeting rooms for confidential discussions.
- Use an event-specific slug and rotate it after the event.
- Realtime is an event prototype, not a production moderation model.

## Validation

- Run the personal journey in one browser with realtime disabled.
- Open two clean browser contexts and verify join/leave presence.
- Join Coffee Corner from two devices and verify meeting fallback.
- Start one Elevator round, submit feedback from the second browser, and verify aggregation.
- Deploy to Vercel and repeat the two-browser smoke test on the production URL.

## Risks

| Risk | Response |
|---|---|
| Realtime integration consumes the build window | Implement it only for Coffee/Elevator after the local vertical slice |
| Public meeting abuse | Event-only slug, no sensitive content, host reset, rotate after event |
| Jitsi public deployment is unavailable | New-tab fallback and face-to-face venue fallback |
| Concurrent speakers | Presence-based UI guard; no distributed lock in MVP |
| Network failure on stage | Local personal flow, seeded data, and backup recording |
| Demo feels like a meeting wrapper | The product owns office context, presence, activity rules, feedback, and shipping loop |
