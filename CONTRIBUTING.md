# Contributing

## Setup

Requirements: Node 24 and pnpm 10.

```sh
pnpm install
pnpm dev
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server on http://localhost:3000 |
| `pnpm check` | Biome lint and format check |
| `pnpm check:fix` | Biome with safe fixes applied |
| `pnpm typecheck` | Route types and TypeScript |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm build` | Production build |
| `pnpm fonts` | Prepares the display font (run by `dev` and `build`) |

### Fonts

Lato comes from `@fontsource/lato`. Kelson Sans, the ESN display font, is licensed and never committed here:
put `kelson-sans-{light,normal,bold}.woff2` in `fonts-private/` (or point `KELSON_DIR` at them).
Without them, the site builds with Oswald, the brand's stand-in.

### Site URL

Pages are prerendered, so canonical and hreflang URLs are fixed at build time.
Set `SITE_URL` (e.g. `https://lille.esnfrance.org`) when running `pnpm build`; it defaults to `http://localhost:3000`.

On a host that must stay out of search engines (a preview or showcase), set `SITE_NOINDEX=1` at runtime:
`robots.txt` then disallows everything and pages send `X-Robots-Tag: noindex, nofollow`.

### HelloAsso events

Events come from the HelloAsso API. Its keys are created by an admin of the association's HelloAsso account
(the API client needs the `AccessPublicData` privilege).

| Variable | Default |
| --- | --- |
| `HELLOASSO_CLIENT_ID`, `HELLOASSO_CLIENT_SECRET` | none |
| `HELLOASSO_ORGANIZATION` | `esn-lille` |
| `HELLOASSO_API_URL` | `https://api.helloasso.com` (sandbox: `https://api.helloasso-sandbox.com`) |
| `HELLOASSO_MOCK` | set to `1` to serve sample events in a production build |

Without keys, `pnpm dev` serves sample events. A production build without keys shows a link to HelloAsso instead;
with keys, pages refresh their events every 15 minutes.

## Branches

- `main` is what runs in production. `develop` is the integration branch.
- Nobody pushes to `main` or `develop`: every change goes through a pull request.
- Branch from an up-to-date `develop`, one branch per change: `<type>/<kebab-description>`,
  e.g. `feat/events-page`.
- Releases are a pull request from `develop` to `main`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), in English, **title only**:

```
type(scope): subject
```

- **type**: `feat` `fix` `refactor` `perf` `test` `docs` `style` `build` `ci` `chore` `revert`
- **scope**: the area touched, lowercase kebab (`events`, `home`, `i18n`, `ci`…). Omit it only for repo-wide changes.
- **subject**: imperative, lowercase first word, no trailing period, 72 characters at most.
  Describe what changes for the visitor or the maintainer, not the mechanics.

```
feat(events): list upcoming helloasso events on the home page   good
fix: update files                                               too vague
feat(events): Added the events page.                            wrong tense, capital, period
```

No body, except for a breaking change: `type(scope)!: subject` plus a `BREAKING CHANGE: <what breaks>` footer.
One logical change per commit.

The `commit-msg` hook checks this locally. Never bypass hooks with `--no-verify`.

## Pull requests

- Target `develop`.
- The title follows the commit format above: CI checks it.
- The body follows the template: **Situation, Task, Action, Result**.
- Lint must pass on every pull request to `develop`. Pull requests to `main` also need typecheck and build.
- Never force push a shared branch.
