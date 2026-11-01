import assert from "node:assert/strict";
import { test } from "node:test";
import { shownSessionKey } from "../src/rex/shown";
import { LOCAL_HOST, sessionKey, type RexHost, type RexSession } from "../src/rex/types";

const REMOTE: RexHost = { label: "studio", thisMachine: false };

function session(sessionId: string, label: string, host: RexHost = LOCAL_HOST): RexSession {
  return { sessionId, label, host, windows: [] };
}

const rex = session("session-rex", "rex");
const tools = session("session-tools", "tools - rex");
const remoteRex = session("session-remote", "rex", REMOTE);

test("matches the session label after the pane title", () => {
  assert.equal(shownSessionKey([rex], ["zsh - rex"]), sessionKey(rex));
  assert.equal(shownSessionKey([rex], ["rex"]), sessionKey(rex));
});

test("prefers the longest matching label", () => {
  assert.equal(shownSessionKey([rex, tools], ["zsh - tools - rex"]), sessionKey(tools));
});

test("prefers this Mac between equal labels", () => {
  assert.equal(shownSessionKey([remoteRex, rex], ["zsh - rex"]), sessionKey(rex));
});

test("takes the frontmost window that matches", () => {
  assert.equal(shownSessionKey([rex, tools], ["Settings", "zsh - rex", "zsh - tools - rex"]), sessionKey(rex));
});

test("is undefined when no title matches", () => {
  assert.equal(shownSessionKey([rex], ["Settings"]), undefined);
  assert.equal(shownSessionKey([rex], []), undefined);
  assert.equal(shownSessionKey([session("session-unnamed", "")], [" - "]), undefined);
});
