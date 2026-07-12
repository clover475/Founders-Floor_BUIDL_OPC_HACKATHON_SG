# Project Guide

## Product

- Founders' Floor is a virtual office for one-person companies, solo founders, indie builders, and explorers.
- The hackathon demo must make users feel they are working around peers, not merely using another task tracker.
- Users do not need a company or product. Project links are always optional.

## Current milestone

- Build a reliable, stage-ready hackathon MVP during the official Fresh Code window.
- Prioritize one complete demo loop over breadth or production completeness.

## Tech stack and boundaries

- Next.js App Router, TypeScript, Tailwind CSS.
- Client-side state and localStorage for durable per-browser demo data.
- Supabase Realtime Presence and Broadcast for ephemeral multi-device participation; do not add database tables or login.
- Jitsi IFrame API for Coffee Corner and Elevator Stage audio/video; do not build WebRTC.
- No authentication, payments, private messaging, 3D office, or complex matching in the MVP.
- Every realtime feature needs a local/demo fallback so the stage flow survives weak internet.

## Coding rules

- Read `PROJECT_STATUS.md` and relevant files in `docs/` before editing.
- Keep changes small and commit by user-visible milestone.
- Do not refactor unrelated code.
- Preserve the full Clock In to Ship Wall flow.
- Use accessible semantic controls and keyboard-friendly interactions.
- Do not collect personal contact data in the demo.
- Treat realtime events as ephemeral; never make the core Clock In to Ship flow depend on another participant.
- Multiple predefined public Coffee rooms and one Elevator Stage exist in the MVP.
- Credit all third-party libraries and assets in `README.md`.

## Planned commands

- `npm run dev`
- `npm run build`
- `npm run lint`

## Project memory

- Product scope: `docs/product.md`
- Architecture: `docs/architecture.md`
- Data model: `docs/data-schema.md`
- Decisions: `docs/decisions.md`
- Hackathon constraints: `docs/hackathon.md`
- Design and interview rationale: `docs/design-rationale.md`
