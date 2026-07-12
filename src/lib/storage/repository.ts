import { seedDeskChecks, seedSessionHistory, seedShips } from "@/lib/demo-data";
import type { DeskCheck, FounderSession, SessionEndReason, SessionRecord, Ship } from "@/types/domain";
import { removeLocalValue, readLocalValue, writeLocalValue } from "./local-storage";

export const STORAGE_KEYS = {
  session: "founders-floor:session:v1",
  sessionHistory: "founders-floor:session-history:v1",
  deskChecks: "founders-floor:desk-checks:v1",
  ships: "founders-floor:ships:v1",
  clockInTemplate: "founders-floor:clock-in-template:v1",
};

export function loadSession() {
  return readLocalValue<FounderSession | null>(STORAGE_KEYS.session, null);
}

export function saveSession(session: FounderSession) {
  writeLocalValue(STORAGE_KEYS.session, session);
}

export function loadClockInTemplate() {
  return readLocalValue<Partial<FounderSession> | null>(STORAGE_KEYS.clockInTemplate, null);
}

export function saveClockInTemplate(template: Partial<FounderSession>) {
  writeLocalValue(STORAGE_KEYS.clockInTemplate, template);
}

export function clearSession() {
  removeLocalValue(STORAGE_KEYS.session);
}

export function loadSessionHistory() {
  return readLocalValue<SessionRecord[]>(STORAGE_KEYS.sessionHistory, seedSessionHistory);
}

export function saveSessionHistory(history: SessionRecord[]) {
  writeLocalValue(STORAGE_KEYS.sessionHistory, history);
}

export function archiveSession(session: FounderSession, endReason: SessionEndReason, shipId?: string) {
  const history = loadSessionHistory();
  const record: SessionRecord = {
    ...session,
    clockedOutAt: new Date().toISOString(),
    endReason,
    shipId,
  };
  saveSessionHistory([record, ...history]);
}

export function loadDeskChecks() {
  return readLocalValue<DeskCheck[]>(STORAGE_KEYS.deskChecks, seedDeskChecks);
}

export function saveDeskChecks(deskChecks: DeskCheck[]) {
  writeLocalValue(STORAGE_KEYS.deskChecks, deskChecks);
}

export function loadShips() {
  return readLocalValue<Ship[]>(STORAGE_KEYS.ships, seedShips);
}

export function saveShips(ships: Ship[]) {
  writeLocalValue(STORAGE_KEYS.ships, ships);
}
