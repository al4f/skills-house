# Implementation Plan

**Date:** 2026-07-03  
**Status:** Completed (historical reference)  
**Outcome:** Monorepo scaffold, `@skills-house/build`, `skill-auditor` example, CI, distribution tooling.

> This plan guided the initial build. For current architecture and decisions, see [monorepo-overview.md](../architecture/monorepo-overview.md) and [distribution.md](../architecture/distribution.md). Remaining work: [PROGRESS.md](../../content/publish/PROGRESS.md).

## What shipped

| Phase | Outcome |
|-------|---------|
| 1–2 | Monorepo scaffold + build CLI |
| 3–5 | `@include`, file links, package refs, esbuild bundling |
| 6 | `skill-auditor` example skill (replaced initial brainstorming prototype — removed) |
| 7+ | CI, nested `@include`, install scripts, npm pack/publish workflow, skills.sh consumer install |

## Deferred items — resolution

| Item | Resolution |
|------|------------|
| `npx skills` CLI | Use official [skills.sh](https://www.skills.sh/docs/cli) — not a custom `@skills-house/cli` |
| npm publish | Tag-driven GitHub Actions; `@skills-house/skill-*` dist packages |
| Nested `@include` | Shipped |
| `@skills-house/cli` on npm | Optional; not required for consumers |
| Skill catalog | Explicitly rejected — framework + one example only |

---

## Original plan (archived)

The sections below document the original phased approach. Kept for history.

### Goal

Scaffold the skills-house monorepo and ship `@skills-house/build` that compiles skills from source → `skills-dist/`.

### Principles

1. **Simple first** — smallest working build; defer edge cases.
2. **One reference rule** — `/` = in-package file; otherwise package ref.
3. **YAGNI** — no CLI publish, no Turborepo until needed.
4. **Validate is per-package** — dist is never validated.

### Phases 1–5

See git history for implementation. Key modules:

```
internal-scripts/build/src/
├── cli.ts
├── parse-skill-md.ts
├── resolve-includes.ts      # nested includes + cycle detection
├── resolve-file-links.ts
├── resolve-package-link.ts
└── build-skill.ts
```

### Phase 6 — Reference skill

**Outcome:** `skill-auditor` builds end-to-end (current example skill).

### Phase 7 — Polish

- [x] Frontmatter `name` must match directory
- [x] Root `pnpm build` / CI build loop
- [x] Build tests (`fixtures/minimal-skill`, `nested-includes-skill`)
- [x] Package short-name uniqueness documented

---

## Related

- [Monorepo overview](../architecture/monorepo-overview.md)
- [Distribution](../architecture/distribution.md)
- [Marker spec](../markers/marker-spec.md)
