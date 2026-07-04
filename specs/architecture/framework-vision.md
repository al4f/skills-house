# Skills House Framework Vision

**Status:** Active  
**Date:** 2026-07-04

skills-house is an open-source **framework** for authoring, building, and distributing [Agent Skills](https://agentskills.io). Authors write modular source skills; the monorepo provides the build pipeline, shared scripts, validation, and distribution paths.

**Not a skill catalog** — ships one example skill (`skill-auditor`) to demonstrate patterns. The website, registry, and explorers exist to dogfood and document the framework — not as a marketplace.

## Principles

1. **Source is freeform** — only `SKILL.md` is required; `@include` and markdown links compose larger skills.
2. **Build produces spec-compliant dist** — `@skills-house/build` is the framework core.
3. **Authors bring skills; the framework handles compile and ship** — validation, registry generation, and install paths are provided.
4. **Framework changes require humans** — build system, CLI, generators, website, and CI never auto-merge.
5. **GitHub is the source of truth** — registry indices and website data are generated from repository metadata.

## Contribution model

| Type | Paths | Review | Auto-merge |
|------|-------|--------|------------|
| Skill | `skills/<name>/` | Automated checks only | Yes, when checks pass |
| Framework | Everything else | Maintainer review | Never |

### Skill checks

- Schema validation (`specs/schema/skill-frontmatter.schema.json`)
- Per-package lint (`pnpm validate`)
- Registry generation (`pnpm generate`)
- Dependency and reference validation

## Framework components

| Component | Path | Role |
|-----------|------|------|
| Build pipeline | `internal-scripts/build/` | `@skills-house/build` — markers, links, dist writer |
| Shared scripts | `scripts/<name>/` | Reusable execution packages referenced from skills |
| Registry generator | `@skills-house/registry` (`pnpm generate`) | Metadata, search, dependency graph |
| Install scripts | `internal-scripts/install/` | Local dist install for dogfooding |
| Example skill | `skills/skill-auditor/` | Demonstrates authoring patterns |

## Generated artifacts

| Artifact | Path | Purpose |
|----------|------|---------|
| Registry index | `generated/registry.json` | Full skill + script metadata |
| Search index | `generated/search-index.json` | Global search data |
| Dependency graph | `generated/dependency-graph.json` | Skill ↔ script relationships |
| Website data | `website/data/*.json` | Static site consumption |
| Explorer pages | `website/skills/`, `website/scripts/`, `website/graph/`, `website/search/` | Framework documentation UI |

## Website surfaces

The site at [al4f.dev](https://al4f.dev) documents the framework and its example skill — not a skill marketplace.

- **Skills Explorer** — example and contributed skills with description, author, tags, version, install command, dependencies, scripts, examples
- **Scripts Explorer** — shared script packages with inputs, outputs, skills using them, maintainers
- **Dependency Graph** — bidirectional Skill → Script and Script → Skill navigation
- **Search** — skills, scripts, tags, authors

## Distribution

| Audience | Install |
|----------|---------|
| Consumers (any repo) | `npx skills add al4f/skills-house --skill <name>` via [skills.sh](https://www.skills.sh) |
| Maintainers (npm dist) | Tag-driven publish → `@skills-house/skill-<name>` |
| Monorepo dev | `pnpm install:skills` after `pnpm build` |

See [distribution.md](./distribution.md) for channel details.

## Branding

Every page reinforces Skills House by **al4f**, linking to:

- [al4f.dev](https://al4f.dev)
- [GitHub repository](https://github.com/al4f/skills-house)
- [Documentation](https://github.com/al4f/skills-house/tree/main/specs)

## Automation

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | PR + push | Build, test, validate, `generate:check` |
| `generate-registry.yml` | Push to `main` | Regenerate and commit artifacts |
| `auto-merge-skills.yml` | Skill-only PR | Approve + auto-merge when CI passes |
| `deploy-al4f-dev.yml` | Website changes | Deploy GitHub Pages |

## Related

- [Monorepo overview](./monorepo-overview.md)
- [Distribution](./distribution.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
