import { join } from "node:path";

const HELPERS = "Contents/Helpers";

/** Where the CLI lives inside the Rex app bundle; Rex Beta builds name the helper either way. */
const HELPER_PATHS = [`${HELPERS}/Rex Server.app/Contents/MacOS/rex`, `${HELPERS}/Rex Server.rex/Contents/MacOS/rex`];

const APP_BUNDLES = ["Rex.app", "Rex Beta.app"];

/** The server Rex runs, which also puts this CLI on the user's PATH. Raycast does not inherit that PATH. */
const SERVER_CLI =
  "Library/Application Support/com.superlogical.rex/RexServer/Versions/Current/Rex Server.app/Contents/MacOS/rex";

/** Paths to try for the rex CLI, in order; rexPath is the "Rex CLI" preference. */
export function candidatePaths(rexPath: string | undefined, home: string): string[] {
  const candidates: string[] = [];
  if (rexPath) {
    if (rexPath.endsWith(".app")) candidates.push(...HELPER_PATHS.map((helper) => join(rexPath, helper)));
    else candidates.push(rexPath);
  }
  for (const dir of ["/Applications", join(home, "Applications")]) {
    for (const bundle of APP_BUNDLES) {
      for (const helper of HELPER_PATHS) candidates.push(join(dir, bundle, helper));
    }
  }
  candidates.push(join(home, SERVER_CLI), "/opt/homebrew/bin/rex", "/usr/local/bin/rex");
  return candidates;
}

/** The app bundle whose helper holds bin, or undefined when bin is not inside one. */
export function appBundleOf(bin: string): string | undefined {
  const at = bin.indexOf(`/${HELPERS}/`);
  if (at < 0) return undefined;
  const app = bin.slice(0, at);
  return app.endsWith(".app") ? app : undefined;
}
