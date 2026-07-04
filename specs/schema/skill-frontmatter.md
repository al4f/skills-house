# Skill Frontmatter

**Date:** 2026-07-04  
**Status:** Adopted  
**Schema:** [skill-frontmatter.schema.json](./skill-frontmatter.schema.json)

YAML frontmatter at the top of source `SKILL.md` (and preserved in dist). Validated in CI via `@skills-house/registry`.

## Required fields

### `name`

- Must match the parent directory name under `skills/<name>/`.
- Lowercase alphanumeric and hyphens only.
- Max 64 characters.
- The build rejects a mismatch between `name` and directory.

```yaml
name: skill-auditor
```

### `description`

- What the skill does and **when agents should load it**.
- Min 20 characters, max 1024.
- Write for the agent: trigger conditions matter as much as capabilities.

```yaml
description: "Use when reviewing or publishing Agent Skills. Validates frontmatter, layout, and in-package links before merge."
```

## Optional `metadata`

Arbitrary extra fields are allowed (`additionalProperties: true`). Common keys:

| Field | Type | Purpose |
|-------|------|---------|
| `author` | string | Maintainer or team name |
| `version` | string | Authoring version (not npm semver) |
| `tags` | string[] | Internal categorization; unique items |
| `dependencies` | string[] | **Build output only** — other skill short names linked at build time |

Example:

```yaml
metadata:
  author: al4f
  version: "0.1.0"
  tags:
    - validation
    - publishing
```

Do not hand-author `metadata.dependencies` in source; the builder adds them when you link to another skill package (see [SKILL.md authoring spec](../authoring/skill-md-authoring.md#form-3-skill-package)).

## Full example

```yaml
---
name: my-skill
description: "Use when scaffolding a new API endpoint. Generates handler, tests, and OpenAPI stub from a route spec."
metadata:
  author: platform-team
  version: "1.0.0"
  tags:
    - api
    - codegen
---

# My Skill

...
```

## Validation

| When | How |
|------|-----|
| CI / `pnpm validate` | JSON Schema + per-package scripts |
| Build | `name` ↔ directory match enforced by `@skills-house/build` |

```bash
pnpm validate
```

## Related

- [SKILL.md authoring spec](../authoring/skill-md-authoring.md)
- [Package naming](../conventions/package-naming.md)
- [Agent Skills spec](https://agentskills.io)
