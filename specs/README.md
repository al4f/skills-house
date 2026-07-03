# skills-house — Specifications

Architecture and design docs. **Paper first, code second.**

## Index

| Document | Description |
|----------|-------------|
| [architecture/platform-vision.md](./architecture/platform-vision.md) | Platform: website, generators, auto-merge, explorers |
| [architecture/monorepo-overview.md](./architecture/monorepo-overview.md) | Workspaces, build flow, source vs dist |
| [architecture/distribution.md](./architecture/distribution.md) | skills.sh + npm channels, install commands |
| [markers/marker-spec.md](./markers/marker-spec.md) | `@include` marker and markdown link resolution |
| [conventions/package-naming.md](./conventions/package-naming.md) | Workspace and published npm naming |
| [plans/2026-07-03-implementation-plan.md](./plans/2026-07-03-implementation-plan.md) | Original phased plan (completed) |

## Status

| Spec | Status |
|------|--------|
| Monorepo architecture | Adopted |
| Distribution | Adopted |
| Marker spec | Adopted |
| Package naming | Adopted |
| Platform vision | Adopted |
| Skill frontmatter schema | Adopted (`specs/schema/skill-frontmatter.schema.json`) |
| Implementation plan | Completed (historical) |

## Principles

1. **Platform for AI Skills** — publish, discover, and reuse skills on [al4f.dev](https://al4f.dev); GitHub is the backend.
2. **Source is freeform** — only `SKILL.md` is required as the builder entry.
3. **Dist is spec-compliant** — build output conforms to [Agent Skills](https://agentskills.io).
4. **Primary install = skills.sh** — `npx skills add owner/repo`; npm dist is secondary.
5. **Validate is per-package** — each package defines its own `validate` script; registry validates metadata and references.
6. **Generated, not duplicated** — registry, search, graph, and website data come from `pnpm generate`.

## Remaining work

See [content/publish/PROGRESS.md](../content/publish/PROGRESS.md).
