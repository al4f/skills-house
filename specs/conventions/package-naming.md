# Package Naming Conventions

**Date:** 2026-07-04  
**Status:** Adopted

## npm scope

Published **framework** packages use `@skills-house`:

```
@skills-house/build                  # build tool (published via tag)
@skills-house/install                # install tool (published via tag)
@skills-house/create                 # scaffold CLI (published via tag)
```

Skills are **not** published to npm. Skill distribution is [skills.sh only](../architecture/distribution.md).

## Workspace vs published names

| Context | Pattern | Example |
|---------|---------|---------|
| Workspace skill package | `@skills-house/<dir-name>` (private) | `@skills-house/skill-auditor` in `skills/skill-auditor/` |
| Framework tool | `@skills-house/<tool>` | `@skills-house/build`, `@skills-house/install`, `@skills-house/create` |
| Scripts workspace | `@skills-house/script-<name>` (private) | `@skills-house/script-fixture-helper` |

## Skill `name` field (Agent Skills spec)

The `name` in `SKILL.md` frontmatter must:

- Match the parent directory name
- Be lowercase alphanumeric + hyphens only
- Max 64 characters

Applies to source and dist. Build enforces name ↔ directory match.

## Script namespace exports

```json
{
  "name": "@skills-house/script-fixture-helper",
  "exports": {
    "./hello": "./scripts/hello.sh"
  }
}
```

Referenced in skills as:

```markdown
[Run helper](fixture-helper/hello)
```

`fixture-helper` is the **short name** (directory under `scripts/`).

## Short-name uniqueness

A short name must exist in only one workspace. Do not create both `skills/foo/` and `scripts/foo/`.

| Short name | Workspace | Directory |
|------------|-----------|-----------|
| `skill-auditor` | skills | `skills/skill-auditor/` |
| `fixture-helper` | scripts | `scripts/fixture-helper/` |
| `skill-auditor-tools` | scripts | `scripts/skill-auditor-tools/` |

## Related

- [Monorepo overview](../architecture/monorepo-overview.md)
- [Distribution](../architecture/distribution.md)
- [SKILL.md authoring spec](../authoring/skill-md-authoring.md)
