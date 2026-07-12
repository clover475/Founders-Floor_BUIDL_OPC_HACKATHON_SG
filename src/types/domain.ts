export type RoomId = "idea" | "build" | "feedback" | "growth" | "break";

export type Activity = "focused" | "open_to_chat" | "coffee" | "elevator";

export type Participant = {
  participantId: string;
  nickname: string;
};

export type OfficeRoom = {
  id: RoomId;
  name: string;
  description: string;
};

export type FounderSession = {
  sessionId: string;
  participant: Participant;
  room: RoomId;
  activity: Activity;
  goal: string;
  helpNeed?: string;
  projectName?: string;
  region?: string;
  checkedInAt: string;
};

export type SessionEndReason = "clockedOut" | "switchedSession";

export type SessionRecord = FounderSession & {
  clockedOutAt: string;
  endReason: SessionEndReason;
  shipId?: string;
};

export type Coworker = {
  participantId: string;
  nickname: string;
  room: RoomId;
  activity: Activity;
  goal: string;
  region?: string;
};

export type DeskCheckTemplate = {
  id: string;
  title: string;
  prompt: string;
  expectedOutcome: string;
};

export type DeskCheck = {
  id: string;
  templateId: string;
  question: string;
  status: "draft" | "requested" | "completed";
  createdAt: string;
};

export type Ship = {
  id: string;
  sessionId: string;
  title: string;
  evidence: string;
  helpedBy?: string;
  room: RoomId;
  shippedAt: string;
};
