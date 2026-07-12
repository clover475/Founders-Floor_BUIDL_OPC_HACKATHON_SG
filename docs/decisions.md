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
