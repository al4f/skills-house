# skills-house — Specifications

Architecture and design docs for the skills-house monorepo. **Paper first, code second.**

## Index

| Document | Description |
|----------|-------------|
| [architecture/monorepo-overview.md](./architecture/monorepo-overview.md) | Workspaces, build flow, dist contract, goals |
| [markers/marker-spec.md](./markers/marker-spec.md) | `@include` marker and markdown link resolution |
| [conventions/package-naming.md](./conventions/package-naming.md) | npm scope and package naming |
| [plans/2026-07-03-implementation-plan.md](./plans/2026-07-03-implementation-plan.md) | Phased build plan |

## Status

| Spec | Status |
|------|--------|
| Monorepo architecture | Draft — 2026-07-03 |
| Marker spec | Draft — 2026-07-03 |
| Package naming | Draft — 2026-07-03 |
| Implementation plan | Ready — 2026-07-03 |

## Principles

1. **Source is freeform** — only `SKILL.md` is required as the builder entry.
2. **Dist is spec-compliant** — build output conforms to [Agent Skills](https://agentskills.io).
3. **Validate is per-package** — each package defines its own `validate` script; the repo structure does not prescribe its contents.
4. **Do not validate `skills-dist/`** — it is generated output from `build`.
