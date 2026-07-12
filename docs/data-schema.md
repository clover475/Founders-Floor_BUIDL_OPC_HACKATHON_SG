# Data Schema

## Core entities

```ts
type Stage = "exploring" | "ideating" | "building" | "launching" | "operating";
type RoomSlug = "idea" | "build" | "feedback" | "growth" | "break";
type PresenceStatus = "focused" | "open_to_chat" | "needs_feedback" | "on_break" | "shipping_soon";

type Member = {
  id: string;
  name: string;
  stage: Stage;
  city?: string;
  avatarUrl?: string;
  canHelpWith: string[];
  projectLink?: string;
  contactable: boolean;
  isDemo: boolean;
};

type WorkSession = {
  id: string;
  memberId: string;
  room: RoomSlug;
  workingOn: string;
  goal: string;
  helpNeeded?: string;
  status: PresenceStatus;
  clockedInAt: string;
  clockedOutAt?: string;
};

type DeskCheck = {
  id: string;
  creatorId: string;
  helperId?: string;
  title: string;
  description: string;
  template: string;
  durationMinutes: 5 | 10 | 15;
  reviewTarget?: string;
  status: "open" | "accepted" | "in_progress" | "completed";
  helpful?: boolean;
  outcome?: string;
  createdAt: string;
};

type Pitch = {
  id: string;
  memberId: string;
  type: "product" | "idea" | "founder";
  durationSeconds: 15 | 30 | 60;
  text: string;
  createdAt: string;
};

type PitchFeedback = {
  id: string;
  pitchId: string;
  understood: boolean;
  wantsMore: boolean;
  mightBeUser: boolean;
  knowsRelevantPerson: boolean;
  question?: string;
  improvement?: string;
};

type Ship = {
  id: string;
  memberId: string;
  sessionId: string;
  type: string;
  title: string;
  description?: string;
  evidenceUrl?: string;
  helpedBy: string[];
  nextStep?: string;
  mood?: string;
  createdAt: string;
};
```

## Relationships

- A member has many work sessions.
- A work session belongs to one room and may produce one or more ships.
- A Desk Check has one creator and optionally one helper.
- A pitch belongs to one member and has many feedback records.
- A ship can credit zero or more helpers.

## Derived state

- Builders online: sessions without `clockedOutAt`.
- Desk checks completed: checks with `status === "completed"` created today.
- Products tested: completed Desk Checks using a product-test template.
- Things shipped: ships created today.
- New connections: completed checks whose participants opted to continue.

## Storage envelope

```ts
type StoredState = {
  version: 1;
  members: Member[];
  sessions: WorkSession[];
  deskChecks: DeskCheck[];
  pitches: Pitch[];
  pitchFeedback: PitchFeedback[];
  ships: Ship[];
};
```

## Open questions

- Whether a single member can have multiple active sessions; MVP should prevent it.
- Whether evidence upload is needed; MVP should accept a URL only.
- Whether live attendees will use separate devices; if yes, add Supabase only after the local demo is stable.
