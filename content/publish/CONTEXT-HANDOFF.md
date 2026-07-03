# Context handoff: al4f / skills-house

Paste this into a new AI conversation to continue work with full context.

---

## Who & mission

- **I am al4f** — building reputation in the AI Agent ecosystem through open-source work.
- **Goal:** Be recognized for **Agent Skills infrastructure**, not vanity GitHub stars.
- **North star:** When devs think "how do I author/build/ship Agent Skills at scale?" → they think **al4f**.
- **skills-house** is the proof-of-work vehicle — a **framework for skill authors**, **not a skill catalog**.

## Repo

- **GitHub:** https://github.com/al4f/skills-house
- **Site:** https://al4f.dev (live, DNS via Cloudflare CNAME flattening `@` → `al4f.github.io`)
- **Also works at:** https://al4f.github.io/skills-house/
- **Stack:** pnpm monorepo, Node LTS (`lts/jod`), TypeScript, `@skills-house/build` compiler

## What skills-house does

Pipeline: `skills/` + `scripts/` → **build** (`@skills-house/build`) → `skills-dist/` → **install** (multi-agent: Cursor, Claude, Codex, `.agents/skills`)

Authoring:

- One marker: `@include /sections/foo.md`
- Links: `/path` = in-package file; `package/export` = shared script from `scripts/`
- Specs in `specs/` (architecture, markers, package naming)

## Key packages

| Path | Purpose |
|------|---------|
| `internal-scripts/build/` | `@skills-house/build` — skill compiler |
| `internal-scripts/cli/` | `@skills-house/cli` — `skills add <name>` |
| `internal-scripts/install/` | `install-skills.sh`, `remove-skills.sh` |
| `skills/skill-auditor/` | Sole **example** skill (not a catalog) |
| `scripts/fixture-helper/`, `scripts/skill-auditor-tools/` | Shared script packages |
| `website/` | al4f.dev static site (HTML, no framework) |
| `content/` | Brand/marketing drafts (threads, LinkedIn, demo script, publish guides) |

## Commands

```bash
nvm use
pnpm install
pnpm build          # build compiler + CLI + skills
pnpm test           # build + CLI tests
pnpm skills add skill-auditor --from ./skills-dist --dry-run
node scripts/pack-skill.mjs skill-auditor   # npm-ready package
```

## Brand work completed (merged PRs #3–#6)

- README authority layer ("Built by al4f"), CI, CONTRIBUTING, issue templates
- Architecture SVGs in `docs/assets/`
- al4f.dev site + articles (flagship, skill-auditor walkthrough, spec v2, distribution RFC)
- GitHub Pages deploy workflow (`.github/workflows/deploy-al4f-dev.yml`)
- Fixed relative asset paths for `/skills-house/` subpath
- Removed **brainstorming** skill + visual-companion (was mock/upstream branding; repo is framework-only)
- CLI scaffold + tests + `scripts/pack-skill.mjs`
- Ready-to-publish: `content/publish/thread-1-ready.md`, `linkedin-1-ready.md`
- Progress tracker: `content/publish/PROGRESS.md`

## Principles (always apply)

- Influence > vanity metrics
- Educational content > promotion
- skills-house = **Vite for Agent Skills** (tooling lane), not a skills marketplace
- Every action should strengthen: **Agent Skills infrastructure → al4f**

## Manual todos still open

- [ ] GitHub profile setup — `content/github-profile/SETUP.md` (bio, pin skills-house, `al4f.dev`)
- [ ] Publish X thread 1 — `content/publish/thread-1-ready.md`
- [ ] Publish LinkedIn post 1 — `content/publish/linkedin-1-ready.md`
- [ ] Record demo video — `content/demo-video/SCRIPT.md`
- [ ] Ecosystem engagement — `content/ecosystem/ENGAGEMENT.md`
- [ ] npm publish CLI + skill — `content/publish/PUBLISHING.md`

## Code roadmap (not done)

- [ ] Publish `@skills-house/cli` to npm (`npx @skills-house/cli add <name>`)
- [ ] Publish `@skills-house/skill-skill-auditor` to npm
- [ ] Nested `@include` support

## Important decisions made

- **No committed `.agents/skills/`** — gitignored; no auto-install workflow
- **One example skill only** (`skill-auditor`) — demonstrates framework patterns
- **Canonical domain:** `al4f.dev` (use in social posts going forward, not github.io URL)

## Agent role when continuing

Act as **Open Source Brand Strategist** for al4f. Prioritize technical authority, al4f.dev traffic, and the `AI Skills = al4f` association. Use GitHub Issue format for new tasks when suggesting work.

## Related files in this repo

| File | Purpose |
|------|---------|
| `content/publish/PROGRESS.md` | Plan status tracker |
| `content/publish/PUBLISHING.md` | npm publish guide |
| `content/github-profile/SETUP.md` | GitHub profile checklist |
| `content/social/x-threads.md` | Full X thread series |
| `content/linkedin/posts.md` | LinkedIn posts |
| `content/demo-video/SCRIPT.md` | Demo video script |
| `content/ecosystem/ENGAGEMENT.md` | Agent Skills community engagement |
