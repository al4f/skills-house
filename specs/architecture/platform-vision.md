# Skills House Platform Vision

**Status:** Active  
**Date:** 2026-07-03

Skills House is a complete platform around AI Skills. The GitHub repository is one part of the ecosystem; the website, automation, contribution workflow, and generated documentation work together.

## Principles

1. **GitHub is the source of truth** — all pages and indices are generated from repository metadata.
2. **The website is the product** — browsing, search, and dependency exploration happen on [al4f.dev](https://al4f.dev).
3. **Publishing a skill should feel like npm** — validate, auto-merge, instant availability.
4. **Platform changes require humans** — website, CLI, generators, and CI never auto-merge.

## Contribution model

| Type | Paths | Review | Auto-merge |
|------|-------|--------|------------|
| Skill | `skills/<name>/` | Automated checks only | Yes, when checks pass |
| Platform | Everything else | Maintainer review | Never |

### Skill checks

- Schema validation (`specs/schema/skill-frontmatter.schema.json`)
- Per-package lint (`pnpm validate`)
- Registry generation (`pnpm generate`)
- Dependency and reference validation

## Generated artifacts

| Artifact | Path | Purpose |
|----------|------|---------|
| Registry index | `generated/registry.json` | Full skill + script metadata |
| Search index | `generated/search-index.json` | Global search data |
| Dependency graph | `generated/dependency-graph.json` | Skill ↔ script relationships |
| Website data | `website/data/*.json` | Static site consumption |
| Explorer pages | `website/skills/`, `website/scripts/`, `website/graph/`, `website/search/` | User-facing UI |

Generator: `@skills-house/registry` (`pnpm generate`).

## Website surfaces

- **Skills Explorer** — every skill with description, author, tags, version, install command, dependencies, scripts, examples
- **Scripts Explorer** — shared script packages with inputs, outputs, skills using them, maintainers
- **Dependency Graph** — bidirectional Skill → Script and Script → Skill navigation
- **Search** — skills, scripts, tags, authors

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
