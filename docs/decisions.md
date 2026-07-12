# Decisions

## 2026-07-12 — Use the office as the daily product metaphor

- Decision: Organize the experience around rooms, presence, breaks, desk checks, and shipping.
- Why: The emotional problem is missing coworkers and ordinary office moments, not missing another task manager.
- Tradeoff: The product may initially look less like an AI agent product.
- Follow-up: Explain that it supports AI-amplified one-person companies; do not add superficial AI features just for the theme.

## 2026-07-12 — Do not require a project profile

- Decision: Users may enter as explorers, ideators, builders, launchers, or operators.
- Why: The event and product both include people who want to build an OPC but do not yet have a product.
- Tradeoff: Matching context is weaker.
- Follow-up: Make project links optional and use room/stage/goal as lightweight context.

## 2026-07-12 — Use local-first persistence for the hackathon

- Decision: Store MVP data in localStorage behind an async repository interface.
- Why: It is fast to build, reliable on stage, and requires no credentials.
- Tradeoff: Different devices do not share live state.
- Follow-up: Add Supabase only if the core loop is complete and onsite multi-device testing is essential.

## 2026-07-12 — Build a vertical slice before games

- Decision: Clock In → Office → Desk Check → Clock Out → Ship Wall is the required slice.
- Why: This proves the value proposition; games only lower the social barrier.
- Tradeoff: Move Together or Elevator Pitch may be simplified.
- Follow-up: Implement Elevator Pitch after the slice because it is the strongest memorable interaction.

## 2026-07-12 — Keep matching lightweight

- Decision: Users join rooms and raise a hand; no matching algorithm in the MVP.
- Why: Topic-based discovery is legible and buildable in seven hours.
- Tradeoff: Help may not be optimally routed.
- Follow-up: Use accumulated room, goal, and contribution data for later recommendations.

## 2026-07-12 — Add realtime without adding an application backend

- Decision: Use Supabase Realtime Presence and Broadcast, but no Postgres tables or authentication in the MVP.
- Why: Coffee Corner and Elevator Pitch require real people on separate devices, while persistent shared history does not.
- Tradeoff: Realtime state disappears when clients disconnect and has event-prototype security.
- Follow-up: Add authenticated database persistence only after validating the interaction.

## 2026-07-12 — Embed meetings instead of building meetings

- Decision: Use Jitsi for one shared Coffee Corner and one shared Elevator Stage.
- Why: Audio/video is necessary context but not the product's differentiator.
- Tradeoff: Availability and moderation depend on a third-party public deployment.
- Follow-up: Provide an open-in-new-tab fallback and default media to muted.

## 2026-07-12 — Limit live concurrency

- Decision: One four-seat coffee table and one active elevator speaker at a time.
- Why: This proves real participation without implementing dynamic room lifecycle or distributed locks.
- Tradeoff: The event cannot support many simultaneous conversations.
- Follow-up: Add dynamic huddles only after observing demand.
