# Stage Checklist

Use this checklist before the final hackathon presentation.

## Environment

- Vercel deployment points to the GitHub `main` branch.
- Vercel has these environment variables set for Production, Preview, and Development:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_EVENT_SLUG=founders-floor-hackathon`
  - `NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si`
- No Supabase service-role key is stored in Vercel or the repository.

## Local build

- `npm run lint`
- `npm run build`
- `/`, `/clock-in`, `/coffee-corner`, `/elevator`, and `/ship-wall` return 200 locally.

## Production smoke test

- Personal flow: Clock In -> Feedback Room -> Desk Check -> Clock Out -> Ship Wall.
- Coffee Corner:
  - Browser A joins.
  - Browser B sees Browser A within five seconds.
  - Both browsers resolve to the same Jitsi room.
  - A fifth browser cannot take a visible website seat when four seats are filled.
- Elevator Stage:
  - Browser A starts a 30-second round as speaker.
  - Browser B sees the active speaker guard and joins as audience.
  - Browser B submits feedback.
  - Browser A sees the result card update without refresh.
  - Reset clears a stale round.

## Mobile-width check

- Lobby navigation remains usable.
- Coffee Corner seat list, join button, and meeting fallback fit without horizontal scroll.
- Elevator Stage pitch form, feedback form, result card, and meeting fallback fit without horizontal scroll.
- Ship Wall cards wrap long evidence text.

## Backup demo recording

Record a 60-90 second fallback video before submission:

1. Start at the Lobby.
2. Clock in with a founder goal.
3. Enter Feedback Room and create a Desk Check.
4. Open Coffee Corner and show the four-seat table plus meeting fallback.
5. Open Elevator Stage, start a round, and show the result card.
6. Save the result and show it on Ship Wall.

## Submission notes

- Use the public GitHub repository URL.
- Use the Vercel production URL.
- Mention that live rooms are event prototypes and do not require login.
- Mention the core product sentence: AI can make one person a company, but a one-person company should not mean working alone.
