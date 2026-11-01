import assert from "node:assert/strict";
import { test } from "node:test";
import { appBundleOf, candidatePaths } from "../src/rex/install-paths";

const HOME = "/Users/alice";
const SERVER_CLI =
  "/Users/alice/Library/Application Support/com.superlogical.rex/RexServer/Versions/Current/Rex Server.app/Contents/MacOS/rex";

test("finds the CLI in both helper layouts of Rex Beta.app", () => {
  const paths = candidatePaths(undefined, HOME);
  assert.ok(paths.includes("/Applications/Rex Beta.app/Contents/Helpers/Rex Server.app/Contents/MacOS/rex"));
  assert.ok(paths.includes("/Applications/Rex Beta.app/Contents/Helpers/Rex Server.rex/Contents/MacOS/rex"));
});

test("finds the CLI the Rex server installs under Application Support", () => {
  assert.ok(candidatePaths(undefined, HOME).includes(SERVER_CLI));
});

test("tries the preference first, expanding an app bundle to its helpers", () => {
  assert.equal(candidatePaths("/opt/rex", HOME)[0], "/opt/rex");
  assert.deepEqual(candidatePaths("/Applications/Rex Beta.app", HOME).slice(0, 2), [
    "/Applications/Rex Beta.app/Contents/Helpers/Rex Server.app/Contents/MacOS/rex",
    "/Applications/Rex Beta.app/Contents/Helpers/Rex Server.rex/Contents/MacOS/rex",
  ]);
});

test("the app bundle is the one holding the helper, never the server itself", () => {
  assert.equal(
    appBundleOf("/Applications/Rex Beta.app/Contents/Helpers/Rex Server.rex/Contents/MacOS/rex"),
    "/Applications/Rex Beta.app",
  );
  assert.equal(appBundleOf(SERVER_CLI), undefined);
  assert.equal(appBundleOf("/opt/homebrew/bin/rex"), undefined);
});
