# Registry Generator

**Date:** 2026-07-04  
**Status:** Adopted  
**Audience:** Maintainers

Overview of `pnpm generate` (`@skills-house/registry`). Not required reading for skill authors.

## Purpose

Scan `skills/` and `scripts/`, validate frontmatter against schema, and write metadata artifacts for CI and internal tooling. **Not a public skill catalog.**

## Commands

```bash
pnpm generate          # write artifacts
pnpm generate:check    # regenerate + fail if stale (CI)
```

Implementation: `internal-scripts/registry/`. Type definitions: [`types.ts`](../../internal-scripts/registry/src/types.ts).

## Outputs

| Path | Contents |
|------|----------|
| `generated/registry.json` | Skills, scripts, dependency graph, and search index |
| `generated/search-index.json` | Search entries (skills, scripts, tags, authors) |
| `generated/dependency-graph.json` | `skillsToScripts`, `scriptsToSkills`, `skillsToSkills` |
| `website/public/data/*.json` | Site copies of the above (registry omits embedded `searchIndex`) |

## CI

| Workflow | When | Action |
|----------|------|--------|
| `ci.yml` | PR + push | `pnpm generate:check` — fails if generated output is stale |
| `generate-registry.yml` | Push to `main` when `skills/`, `scripts/`, registry, or schema change | Regenerate and auto-commit |

## Validation at generate time

- Frontmatter JSON Schema (`specs/schema/skill-frontmatter.schema.json`)
- In-package link resolution
- Short-name uniqueness across workspaces

Errors block `pnpm generate`; warnings are logged.

## Related

- [Framework vision](./framework-vision.md#generated-artifacts)
- [Monorepo overview](./monorepo-overview.md)
- [Skill frontmatter](../schema/skill-frontmatter.md)
