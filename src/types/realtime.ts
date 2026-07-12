import type { Activity, RoomId } from "./domain";

export type FloorPresence = {
  participantId: string;
  nickname: string;
  room: RoomId;
  activity: Activity;
  goal?: string;
  onlineAt: string;
};

export type CoffeePresence = {
  participantId: string;
  nickname: string;
  roomId: string;
  roomTitle?: string;
  roomTopic?: string;
  joinedAt: string;
};

export type ElevatorPresence = {
  participantId: string;
  nickname: string;
  role: "speaker" | "audience";
  joinedAt: string;
  activeRound?: {
    roundId: string;
    speakerId: string;
    pitch: string;
    endsAt: string;
  };
};

export type PitchFeedbackInput = {
  understood: boolean;
  wantsFollowUp: boolean;
  couldBeUser: boolean;
  question: string;
};

export type ElevatorEvent =
  | { type: "round_started"; roundId: string; speakerId: string; pitch: string; endsAt: string }
  | { type: "feedback_submitted"; roundId: string; feedback: PitchFeedbackInput }
  | { type: "round_ended"; roundId: string }
  | { type: "round_reset"; roundId: string };
