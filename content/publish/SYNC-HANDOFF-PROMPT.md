# Handoff prompt: skills-house spec ↔ code sync

Copy everything below the line into a new Cursor / Claude session to continue this work.

---

## Context

Repository: https://github.com/al4f/skills-house  
Branch with prior work: `cursor/spec-improvements-dedup-deps-schema-a7ec` (PR #24)  
Specs index: `specs/README.md`

**skills-house is a FRAMEWORK** for building agentic, skill-based software with [Agent Skills](https://agentskills.io). It is **not** a skill catalog.

### Canonical decisions (adopted in specs)

| Topic | Decision |
|-------|----------|
| Positioning | Framework, not catalog — one example skill (`skill-auditor`) in reference repo |
| Primary install | `npx skills add <owner>/<repo> --skill <name>` via [skills.sh](https://www.skills.sh/docs/cli) on the **consumer's repo** |
| Install source | GitHub **source** layout from the framework author's repo |
| Secondary install | npm `@skills-house/skill-*` dist packages (semver/metrics only) |
| Dev only | `pnpm install:skills` — monorepo dogfooding of built dist |
| Scaffold | `npx create-skills-house` — implemented at `internal-scripts/create/` |
| Authoring | `specs/authoring/skill-md-authoring.md` |
| Frontmatter | `specs/schema/skill-frontmatter.md` |
| Registry | `pnpm generate` — internal maintainer tooling, **not** a public catalog product |
| Hardcoding | `specs/conventions/hardcoded-exceptions.md` — only reference-repo docs may use `al4f/skills-house`; tooling derives slug from `package.json.repository` |

### Spec map

```
specs/
├── architecture/     # vision, monorepo, distribution, registry
├── authoring/        # skill-md-authoring.md
├── schema/           # frontmatter JSON + author doc
├── conventions/      # package-naming, hardcoded-exceptions
└── markers/          # redirect stub only → authoring/
```

## What was already done

1. Architecture docs deduplicated (vision / monorepo / distribution)
2. Dependency install command aligned: `npx skills add owner/repo --skill name`
3. `get-repo-slug.ts` in build; registry uses dynamic slug
4. `specs/schema/skill-frontmatter.md`, `specs/architecture/registry.md`
5. Authoring spec moved to `specs/authoring/skill-md-authoring.md`
6. CI fix: build `create-skills-house` + `sync-create-template` before tests
7. Partial code sync: website reframed (home, platform, header, footer), registry installCommand without `-a cursor -y`, scaffold template gets `repository` field, CLI derives repo slug

## Your task

**Finish syncing code, website, and packages with specs.** Limit exceptions per `hardcoded-exceptions.md`.

### Priority 1 — Website (framework docs, not catalog)

- [ ] Remove or hide catalog-first routes (`/skills`, `/scripts`, `/graph`, `/search`) from user journeys — keep as maintainer-only or redirect to `/platform`
- [ ] Update `website/scripts/prerender.mjs` title hook for new `index.html` title
- [ ] Mark distribution RFC article **Adopted** on al4f.dev (`skills-house-distribution-rfc.html`)
- [ ] Fix `website/src/lib/writing.ts` — remove "second reference skill" catalog language
- [ ] Update `agent-skills-at-scale.html` — consumer install (`npx skills add`) before `pnpm install:skills`
- [ ] Rebuild site: `pnpm build:website`

### Priority 2 — Packages & tooling

- [ ] Run `node scripts/sync-create-template.mjs` after CLI/build changes; commit template vendor
- [ ] Publish `create-skills-house` to npm (roadmap item) OR document "clone + pnpm" until published
- [ ] Consider exporting `getRepoSlug` shared util instead of duplicating in CLI `paths.ts`
- [ ] `internal-scripts/create` scaffold: substitute real `YOUR_ORG` from CLI flags if added

### Priority 3 — Docs & content

- [ ] `content/demo-video/SCRIPT.md` — add `npx skills add` consumer path
- [ ] `content/social/x-threads.md` — mark distribution thread as shipped
- [ ] `specs/architecture/validation.md` — optional: document `pnpm validate` contract
- [ ] `CONTRIBUTING.md` / auto-merge — decide if reference repo should still auto-merge arbitrary skills (conflicts with distribution non-goal)

### Priority 4 — Verify

```bash
nvm use && pnpm install
pnpm --filter @skills-house/build build
pnpm --filter @skills-house/cli build
pnpm --filter create-skills-house build
node scripts/sync-create-template.mjs
pnpm build && pnpm test && pnpm generate:check
pnpm build:website
```

## Constraints

- **Minimize scope** — match existing code style; no over-engineering
- **Paper first** — if behavior changes, update specs before or with code
- **Node**: `nvm use` (`.nvmrc` = `lts/jod`)
- **Branch naming**: `cursor/<descriptive-name>-a7ec`
- Do not add tests unless they cover real behavior gaps

## Success criteria

- No user-facing surface says "registry", "catalog", or "browse skills" as primary value prop
- All install examples distinguish: consumer (`npx skills add`) vs dev (`pnpm install:skills`)
- `al4f/skills-house` hardcoded only where `hardcoded-exceptions.md` allows
- `pnpm test` and `pnpm generate:check` pass
- Website builds and reflects framework positioning

## Key files

| Area | Paths |
|------|-------|
| Specs | `specs/` |
| Build | `internal-scripts/build/` |
| Registry | `internal-scripts/registry/` |
| Scaffold | `internal-scripts/create/` |
| Website | `website/src/pages/`, `website/src/components/` |
| CI | `.github/workflows/ci.yml` |
| Consumer guide | `content/publish/INSTALL.md` |

Start by reading `specs/README.md` and `specs/conventions/hardcoded-exceptions.md`, then grep for `registry`, `catalog`, `al4f/skills-house`, and `pnpm install:skills` in `website/` and fix mismatches.
