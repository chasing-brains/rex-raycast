# Development

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
npm run check
npm run bundle
```

`check` generates the distribution build and types, then runs Raycast lint and regression tests. `bundle` produces `rex-sessions.rayext`, which Raycast can import.

GitHub Actions runs the same checks for pull requests and pushes to `main`, then retains the installable bundle as an artifact. Pushing a `v*` tag publishes the validated bundle to a GitHub release. Raycast Store submission remains the separate `npm run publish` flow; its `author` field must be the maintainer's Raycast handle.

Dependencies use npm and a committed lockfile. The Raycast SDK pins `@types/node` and `@types/react`; `@raycast/eslint-config` currently requires TypeScript below 6.1. These stay at the newest versions supported by that SDK. Dependabot proposes weekly npm and Actions updates. The esbuild installation script is explicitly approved because the bundler requires its platform binary.

The three README images are also stored under `metadata/` at 2000 × 1250 pixels. Original recordings and operational demo logs stay in the local, ignored `demo/` archive.

Raycast guidance checked: [preparing for the Store](https://developers.raycast.com/basics/prepare-an-extension-for-store), [best practices](https://developers.raycast.com/information/best-practices), [file structure](https://developers.raycast.com/information/file-structure), [manifest](https://developers.raycast.com/information/manifest), [lifecycle](https://developers.raycast.com/information/lifecycle), [CLI](https://developers.raycast.com/information/developer-tools/cli), [ESLint](https://developers.raycast.com/information/developer-tools/eslint), [security](https://developers.raycast.com/information/security), and [versioning](https://developers.raycast.com/information/versioning).
