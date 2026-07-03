# Agent Skills Directory Layout

The [Agent Skills specification](https://agentskills.io) defines what agents consume at runtime.

## Required

| Path | Purpose |
|------|---------|
| `SKILL.md` | Entry point with YAML frontmatter (`name`, `description`) and instructions |

## Optional

| Path | Purpose |
|------|---------|
| `references/` | Documentation loaded on demand (progressive disclosure) |
| `scripts/` | Executable helpers the agent can run |
| `assets/` | Static files: templates, images, schemas |

## Frontmatter rules

- `name` must be lowercase, hyphen-separated, and match the directory name
- `description` tells the agent **what** the skill does and **when** to use it

## skills-house source vs dist

Authors write freeform source under `skills/<name>/`. The build pipeline emits spec-compliant dist to `skills-dist/<name>/`. Audit source for authoring mistakes; audit dist for agent-facing correctness.
