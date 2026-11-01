import { Cache } from "@raycast/api";
import { runAppleScript, usePromise } from "@raycast/utils";
import { useEffect, useRef, useState } from "react";
import { REX_BUNDLE_ID } from "./cli";
import { shownSessionKey } from "./shown";
import { sessionKey, type RexSession } from "./types";

/** A namespace of its own, for the reason given at the snapshot cache. */
const cache = new Cache({ namespace: "opening" });
const SHOWN_KEY = "shown-session";

/** Remember the session the Rex app shows, so the next list opens on it before the window titles are read. */
export function rememberShownSession(key: string): void {
  cache.set(SHOWN_KEY, key);
}

/**
 * The Rex app's window titles, front to back. Reading them needs Raycast's Accessibility permission;
 * without it, or when Rex is not running, the result is empty.
 */
async function rexWindowTitles(): Promise<string[]> {
  try {
    const out = await runAppleScript(`
      tell application "System Events"
        set rexProcesses to (every process whose bundle identifier is "${REX_BUNDLE_ID}")
        if rexProcesses is {} then return ""
        set AppleScript's text item delimiters to linefeed
        return (name of every window of (item 1 of rexProcesses)) as text
      end tell`);
    return out.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

export interface OpeningSelection {
  /** The item to open on, for `selectedItemId`. */
  selectedItemId?: string;
  /** False while rendering the items would open on the first one and then jump. */
  ready: boolean;
}

/**
 * Where a list opens: pick maps the session the Rex app shows to an item ID. The remembered session
 * answers at once; the window titles correct it once read, and from then on the selection stays put
 * however the snapshot changes. A disabled list opens on its first item without waiting.
 */
export function useOpeningSelection(
  sessions: RexSession[] | undefined,
  pick: (shown: RexSession) => string | undefined,
  enabled = true,
): OpeningSelection {
  const [remembered] = useState(() => cache.get(SHOWN_KEY));
  const titles = usePromise(rexWindowTitles, [], { execute: enabled });
  const live = sessions && titles.data ? shownSessionKey(sessions, titles.data) : undefined;
  const settled = useRef<OpeningSelection | undefined>(undefined);

  useEffect(() => {
    if (live) rememberShownSession(live);
  }, [live]);

  if (!enabled) return { ready: true };
  if (settled.current) return settled.current;
  if (!sessions) return { ready: false };

  const key = live ?? remembered;
  const shown = key ? sessions.find((session) => sessionKey(session) === key) : undefined;
  const selection = {
    selectedItemId: shown ? pick(shown) : undefined,
    ready: !titles.isLoading || shown !== undefined,
  };
  if (!titles.isLoading) settled.current = selection;
  return selection;
}
