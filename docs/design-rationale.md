# Design Rationale

## Why this product

AI tools increasingly let one person cover product, design, engineering, and marketing. They do not recreate the human environment that teams provide: ambient presence, quick judgment calls, informal breaks, first feedback, and shared celebration.

Founders' Floor treats loneliness as a work-design problem. It restores lightweight coworker moments without requiring a formal team.

## Why an office metaphor

- Rooms communicate intent faster than a generic feed.
- Presence states show when someone can be interrupted.
- Desk Check makes help small and specific.
- Break Room permits social interaction without contaminating focus spaces.
- Clock Out and Ship Wall reward business progress rather than hours online.

## Why not build an AI cofounder

Solo founders already have abundant AI execution help. The differentiated hypothesis is that other humans provide experience, trust, serendipity, accountability, and real product reactions. AI can later improve routing and summaries, but it should not replace the people.

## Trade-offs

- Local-first data sacrifices authentic cross-device presence for demo reliability.
- Seeded members create immediate atmosphere but must be labelled as demo data.
- The broad long-term community vision is intentionally hidden behind one daily ritual.

## Known weakness

The competition theme explicitly emphasizes Agentic Services, while the MVP is primarily social infrastructure. The pitch must be honest: Founders' Floor is the human coordination layer for AI-amplified one-person companies. If judges require agentic execution, a later assistant can translate a founder's Clock In goal into a micro-plan, but that is not necessary to validate the main problem.

## Interview story

> I noticed that AI had solved many execution gaps for solo founders but had not replaced the everyday social infrastructure of a team. I reframed loneliness from an emotional-support feature into a product system: ambient presence, low-cost feedback, synchronized recovery, and visible shipping. Under a seven-hour Fresh Code constraint, I chose a local-first architecture and built the complete behavior loop before optional games or realtime infrastructure.

## Skills demonstrated

- AI product judgment: identifying what AI should and should not replace.
- Product scoping: reducing a community vision to a testable vertical loop.
- FDE-style delivery: adapting architecture to unreliable stage and deadline conditions.
- Community systems thinking: designing spaces, rituals, contribution, and trust rather than a generic chat feed.

## Why locale switching does not change the URL yet

The launch audience arrives from X, Reddit, and Xiaohongshu, so the first release supports English and Simplified Chinese with one shared URL. The app detects Chinese browser locales, remembers an explicit choice in local storage, and exposes a keyboard-accessible switch in the global navigation.

This uses `use-intl`, the React core package maintained in the high-adoption next-intl project. It gives the app ICU messages and plural handling without forcing a late migration of every route to `/en` and `/zh-CN`.

Trade-off: this release does not provide locale-specific URLs, translated metadata, `hreflang`, or independently indexable language pages. If organic search becomes a meaningful acquisition channel, migrate the same message catalog to next-intl locale routing rather than replacing the translation layer.

Interview framing: under a same-day launch constraint, I separated user-facing localization from international SEO. I shipped the behavior global visitors needed immediately while preserving a clean upgrade path to localized routing.
