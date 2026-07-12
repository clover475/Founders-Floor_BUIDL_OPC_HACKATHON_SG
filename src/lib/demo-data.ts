import type { Coworker, DeskCheckTemplate, OfficeRoom } from "@/types/domain";

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
