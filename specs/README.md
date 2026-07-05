# skills-house — Specifications

Architecture and design docs. **Paper first, code second.**

Normative behavior for framework products lives in **[RFCs](./rfc/README.md)**. Architecture docs provide narrative context; when they disagree with an Accepted RFC, **the RFC wins**.

## RFCs (normative)

| RFC | Title |
|-----|-------|
| [rfc/README.md](./rfc/README.md) | RFC process, LTS binding |
| [0001](./rfc/0001-framework-foundation.md) | Foundation — Agent Skills adoption, language policy, KPIs |
| [0002](./rfc/0002-skill-source-package.md) | Skill source package model |
| [0003](./rfc/0003-build.md) | `@skills-house/build` |
| [0004](./rfc/0004-install.md) | `@skills-house/install` |
| [0005](./rfc/0005-create.md) | `@skills-house/create` |
| [0006](./rfc/0006-product-skills.md) | Product skills for agents |
| [0007](./rfc/0007-project-layout.md) | Project layout and `.house/` |

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
| RFC 0001–0007 | Accepted |
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
9. **Normative RFCs** — framework product behavior is specified in [specs/rfc/](./rfc/README.md); code changes must stay in sync.
10. **Language policy** — TypeScript for `@skills-house/*` internals; no language restriction for skill scripts ([RFC 0001 §3](./rfc/0001-framework-foundation.md#3-implementation-language-policy)).
