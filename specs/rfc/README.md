# skills-house RFCs

Normative technical specifications for the skills-house framework. **Paper first, code second.**

RFCs are the contract between documentation and implementation. Published npm packages bind to an **Accepted** RFC set until their **LTS** line is retired.

## Lifecycle

| Status | Meaning |
|--------|---------|
| **Draft** | Under discussion; not binding for releases |
| **Accepted** | Normative; new releases must conform |
| **Superseded** | Replaced by a newer RFC; kept for LTS readers |
| **Withdrawn** | Abandoned; do not implement |

### LTS binding

When a framework package reaches an LTS release line (e.g. `@skills-house/build@1.x`):

1. The **Accepted** RFC set at LTS cut is frozen in `specs/rfc/lts/<line>/` (snapshot or index).
2. Bugfix releases on that line must not change normative behavior documented in those RFCs.
3. Breaking changes ship only on the next major line with new or superseding RFCs.

Until the first LTS cut, **Accepted** RFCs on `main` are the source of truth.

## Numbering

| RFC | Title | Status |
|-----|-------|--------|
| [0001](./0001-framework-foundation.md) | Framework foundation | Accepted |
| [0002](./0002-skill-source-package.md) | Skill source package model | Accepted |
| [0003](./0003-build.md) | `@skills-house/build` | Accepted |
| [0004](./0004-install.md) | `@skills-house/install` | Accepted |
| [0005](./0005-create.md) | `@skills-house/create` | Accepted |
| [0006](./0006-product-skills.md) | Product skills for agents | Accepted |
| [0007](./0007-project-layout.md) | Project layout and `.house` | Accepted |

## Relationship to other specs

| Layer | Path | Role |
|-------|------|------|
| **RFCs** | `specs/rfc/` | Normative product and framework behavior |
| **Architecture** | `specs/architecture/` | Narrative overview, distribution, vision |
| **Authoring** | `specs/authoring/` | SKILL.md markers and link rules |
| **Schema** | `specs/schema/` | Frontmatter JSON Schema |
| **Conventions** | `specs/conventions/` | Naming, hardcoding exceptions |

When an RFC and an architecture doc disagree, **the RFC wins** for implementers.

## Feedback

Open a GitHub issue with label `rfc` before proposing changes to Accepted RFCs.
