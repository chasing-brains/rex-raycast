import { sessionKey, type RexSession } from "./types";

/**
 * The key of the session the Rex app shows, read from its window titles front to back. Rex titles a
 * window "<pane title> - <session label>". The longest matching label wins, and between equal labels
 * a session on this Mac wins.
 */
export function shownSessionKey(sessions: RexSession[], windowTitles: string[]): string | undefined {
  const candidates = sessions
    .filter((session) => session.label)
    .sort((a, b) => b.label.length - a.label.length || Number(b.host.thisMachine) - Number(a.host.thisMachine));
  for (const title of windowTitles) {
    const match = candidates.find((session) => title === session.label || title.endsWith(` - ${session.label}`));
    if (match) return sessionKey(match);
  }
  return undefined;
}
