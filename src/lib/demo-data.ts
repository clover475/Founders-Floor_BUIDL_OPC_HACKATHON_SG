import type {
  Coworker,
  DeskCheck,
  DeskCheckTemplate,
  OfficeRoom,
  Participant,
  SessionRecord,
  Ship,
} from "@/types/domain";

export const officeRooms: OfficeRoom[] = [
  {
    id: "idea",
    name: "Idea Room",
    description: "Explore opportunities, user problems, and rough founder ideas.",
  },
  {
    id: "build",
    name: "Build Room",
    description: "Work around other builders who are shipping MVPs today.",
  },
  {
    id: "feedback",
    name: "Feedback Room",
    description: "Ask for quick eyes on positioning, flows, or product clarity.",
  },
  {
    id: "growth",
    name: "Growth Room",
    description: "Move first-user, launch, and outreach work forward.",
  },
];

export const demoCoworkers: Coworker[] = [
  {
    participantId: "demo-mia",
    nickname: "Mia",
    room: "feedback",
    activity: "open_to_chat",
    goal: "Testing a landing page for an AI education tool",
  },
  {
    participantId: "demo-alex",
    nickname: "Alex",
    room: "build",
    activity: "focused",
    goal: "Cutting scope for a sales copilot MVP",
  },
  {
    participantId: "demo-sam",
    nickname: "Sam",
    room: "idea",
    activity: "open_to_chat",
    goal: "Looking for a first niche in founder operations",
  },
];

export const deskCheckTemplates: DeskCheckTemplate[] = [
  {
    id: "ten-minute-positioning",
    title: "Ten-minute positioning check",
    prompt:
      "Can someone read my one-line pitch and tell me the first unclear part?",
    expectedOutcome: "One sharper sentence and one follow-up question.",
  },
];

const HOUR = 60 * 60 * 1000;

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * HOUR).toISOString();
}

const seedParticipant: Participant = {
  participantId: "seed-founder",
  nickname: "Founder",
};

/**
 * First-run seed content so the personal demo journey (Ship Wall, Work Log,
 * Achievement Forest) reads as an already-lived-in product instead of an
 * empty state. Only used as a localStorage fallback: the moment a real
 * clock-in or ship is saved, real data is appended on top of this seed.
 */
export const seedShips: Ship[] = [
  {
    id: "seed-ship-9",
    sessionId: "seed-session-9",
    title: "Shipped the Work Log and Achievement Forest",
    evidence: "Every clock-in is now kept in history, and every shipped outcome plants a tree instead of a timer.",
    room: "build",
    shippedAt: hoursAgo(1),
  },
  {
    id: "seed-ship-8",
    sessionId: "seed-session-8",
    title: "Localized the whole product into English and Simplified Chinese",
    evidence: "use-intl catalogs, browser-language detection, and a mobile-safe language switch.",
    room: "growth",
    shippedAt: hoursAgo(20),
  },
  {
    id: "seed-ship-7",
    sessionId: "seed-session-7",
    title: "Sent the first outreach round to ten solo founders",
    evidence: "Ten personal invites with the updated one-line pitch, tracked in a simple sheet.",
    helpedBy: "Feedback Room",
    room: "growth",
    shippedAt: hoursAgo(1 * 24 + 4),
  },
  {
    id: "seed-ship-6",
    sessionId: "seed-session-6",
    title: "Fixed the Elevator Stage speaker handoff bug",
    evidence: "Ending or resetting a round now releases the speaker role so the next founder can start immediately.",
    helpedBy: "Mia",
    room: "feedback",
    shippedAt: hoursAgo(1 * 24 + 10),
  },
  {
    id: "seed-ship-5",
    sessionId: "seed-session-5",
    title: "Tightened the one-line pitch after a desk check",
    evidence: "Swapped 'a tool for founders' for 'the office for one-person companies' after two people got confused.",
    helpedBy: "Alex",
    room: "feedback",
    shippedAt: hoursAgo(1 * 24 + 15),
  },
  {
    id: "seed-ship-4",
    sessionId: "seed-session-4",
    title: "Wired Supabase Realtime Presence for Coffee Corner and Elevator Stage",
    evidence: "Four-seat table presence and one-speaker stage presence, both with local demo fallback.",
    room: "build",
    shippedAt: hoursAgo(2 * 24 + 6),
  },
  {
    id: "seed-ship-3",
    sessionId: "seed-session-3",
    title: "Shipped Clock In, Ship Wall, and local-first storage",
    evidence: "The full personal loop now survives a refresh: Clock In, Desk Check, Clock Out, Ship Wall.",
    room: "build",
    shippedAt: hoursAgo(2 * 24 + 12),
  },
  {
    id: "seed-ship-2",
    sessionId: "seed-session-2",
    title: "Mapped the full demo loop end to end",
    evidence: "Clock In -> See coworkers -> Ask or help -> Take a break -> Clock Out -> Ship, on one page each.",
    room: "idea",
    shippedAt: hoursAgo(3 * 24 + 3),
  },
  {
    id: "seed-ship-1",
    sessionId: "seed-session-1",
    title: "Wrote the one-line pitch for Founders' Floor",
    evidence: "The office for one-person companies. Clock in, see who else is building, clock out with something shipped.",
    room: "idea",
    shippedAt: hoursAgo(3 * 24 + 8),
  },
];

export const seedSessionHistory: SessionRecord[] = [
  ...seedShips.map((ship, index) => ({
    sessionId: ship.sessionId,
    participant: seedParticipant,
    room: ship.room,
    activity: ship.room === "build" ? ("focused" as const) : ("open_to_chat" as const),
    goal: ship.title,
    checkedInAt: new Date(new Date(ship.shippedAt).getTime() - (45 + index) * 60 * 1000).toISOString(),
    clockedOutAt: ship.shippedAt,
    endReason: "clockedOut" as const,
    shipId: ship.id,
  })),
  {
    sessionId: "seed-session-switch-2",
    participant: seedParticipant,
    room: "growth" as const,
    activity: "open_to_chat" as const,
    goal: "Draft outreach message before asking Feedback Room to read it",
    checkedInAt: hoursAgo(1 * 24 + 11),
    clockedOutAt: hoursAgo(1 * 24 + 10.5),
    endReason: "switchedSession" as const,
  },
  {
    sessionId: "seed-session-switch-1",
    participant: seedParticipant,
    room: "idea" as const,
    activity: "open_to_chat" as const,
    goal: "Sketch three names before settling on Founders' Floor",
    checkedInAt: hoursAgo(3 * 24 + 9),
    clockedOutAt: hoursAgo(3 * 24 + 8.25),
    endReason: "switchedSession" as const,
  },
].sort((a, b) => new Date(b.clockedOutAt).getTime() - new Date(a.clockedOutAt).getTime());

export const seedDeskChecks: DeskCheck[] = [
  {
    id: "seed-desk-1",
    templateId: "ten-minute-positioning",
    question: "Can someone read my one-line pitch and tell me the first unclear part?",
    status: "completed",
    createdAt: hoursAgo(3 * 24 + 8.5),
  },
  {
    id: "seed-desk-2",
    templateId: "ten-minute-positioning",
    question: "Does the Clock In form feel like sixty seconds, or does it feel like a form?",
    status: "completed",
    createdAt: hoursAgo(2 * 24 + 13),
  },
  {
    id: "seed-desk-3",
    templateId: "ten-minute-positioning",
    question: "Is the difference between Focused and Open to chat obvious without an explanation?",
    status: "completed",
    createdAt: hoursAgo(2 * 24 + 2),
  },
  {
    id: "seed-desk-4",
    templateId: "ten-minute-positioning",
    question: "Would you know what to type in 'What did you ship' without an example?",
    status: "completed",
    createdAt: hoursAgo(1 * 24 + 16),
  },
  {
    id: "seed-desk-5",
    templateId: "ten-minute-positioning",
    question: "Does the achievement forest feel like a reward, or just a decoration?",
    status: "completed",
    createdAt: hoursAgo(18),
  },
  {
    id: "seed-desk-6",
    templateId: "ten-minute-positioning",
    question: "Is thirty seconds long enough for an elevator pitch, or does it feel rushed?",
    status: "completed",
    createdAt: hoursAgo(9),
  },
  {
    id: "seed-desk-7",
    templateId: "ten-minute-positioning",
    question: "Should the Growth Room split first-user work from launch work?",
    status: "requested",
    createdAt: hoursAgo(2),
  },
];
