# skills-house — Specifications

Architecture and design docs. **Paper first, code second.**

## Index

| Document | Description |
|----------|-------------|
| [architecture/framework-vision.md](./architecture/framework-vision.md) | Canonical framework definition, build purpose, framework skill |
| [architecture/monorepo-overview.md](./architecture/monorepo-overview.md) | Workspaces, build flow, source vs dist |
| [architecture/distribution.md](./architecture/distribution.md) | skills.sh for skills, npm tags for framework packages |
| [authoring/skill-md-authoring.md](./authoring/skill-md-authoring.md) | `@include` marker and markdown link resolution |
| [schema/skill-frontmatter.md](./schema/skill-frontmatter.md) | `SKILL.md` YAML frontmatter fields for authors |
| [conventions/package-naming.md](./conventions/package-naming.md) | Workspace and published npm naming |
| [conventions/hardcoded-exceptions.md](./conventions/hardcoded-exceptions.md) | Where `al4f/skills-house` may appear vs dynamic slug |

## Status

| Spec | Status |
|------|--------|
| Framework vision | Active |
| Monorepo architecture | Adopted |
| Distribution | Adopted |
| SKILL.md authoring | Adopted |
| Package naming | Adopted |
| Skill frontmatter schema | Adopted (`specs/schema/skill-frontmatter.schema.json`) |

## Principles

1. **Framework for agentic, skill-based software** — one-command scaffold, freeform authoring, compile-and-ship; [al4f.dev](https://al4f.dev) documents usage, not skill browsing.
2. **Build wires scripts into skills** — shared execution packages compile into dist; GitHub integration runs scripts when local/mobile runtimes cannot.
3. **Source is freeform** — only `SKILL.md` is required as the builder entry.
4. **Dist is spec-compliant** — build output conforms to [Agent Skills](https://agentskills.io).
5. **Skills distribute via skills.sh only** — one channel; no npm skill packages.
6. **Framework packages publish via npm tags** — `@skills-house/build`, `@skills-house/create`, etc.
7. **Framework skill is mandatory context** — `skill-auditor` documents how the repo works; every project installs and references it.
8. **All contributions need maintainer approval** — open an issue first; no auto-merge.
