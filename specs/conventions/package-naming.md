# Package Naming Conventions

**Date:** 2026-07-03  
**Status:** Draft

## npm scope

All published packages use the `@skills-house` scope:

```
@skills-house/skill-auditor           # skill (source / dist)
@skills-house/script-fixture-helper   # scripts workspace package
@skills-house/build                   # build tool (internal-scripts)
```

## Workspace categories → package names

| Workspace | Directory | Package name pattern | Example |
|-----------|-----------|---------------------|---------|
| Skills | `skills/<name>/` | `@skills-house/<name>` | `@skills-house/skill-auditor` |
| Scripts | `scripts/<name>/` | `@skills-house/script-<name>` | `@skills-house/script-fixture-helper` |
| Build | `internal-scripts/build/` | `@skills-house/build` | `@skills-house/build` |

## Skill `name` field (Agent Skills spec)

The `name` in `SKILL.md` frontmatter must:

- Match the parent directory name
- Be lowercase alphanumeric + hyphens only
- Max 64 characters

This applies to **dist** output. Source package directory should align for consistency.

## Script namespace exports

Script packages declare namespaces in `package.json` `exports`:

```json
{
  "name": "@skills-house/script-fixture-helper",
  "exports": {
    "./hello": "./scripts/hello.sh"
  }
}
```

Referenced in skills as a markdown link:

```markdown
[Run helper](fixture-helper/hello)
```

The `fixture-helper` segment is the **short name** (directory under `scripts/`), not the full npm scope. The build tool maps it to `@skills-house/script-fixture-helper`.

## Short-name uniqueness

Package link targets use the **directory short name** (e.g. `fixture-helper`, `skill-auditor`), not the npm scope name.

**Rule:** A short name must exist in only one workspace. Do not create both `skills/foo/` and `scripts/foo/` — the build looks up `scripts/` first, then `skills/`, and ambiguous names cause confusing resolution.

| Short name | Workspace | Directory |
|------------|-----------|-----------|
| `skill-auditor` | skills | `skills/skill-auditor/` |
| `fixture-helper` | scripts | `scripts/fixture-helper/` |
| `skill-auditor-tools` | scripts | `scripts/skill-auditor-tools/` |

## Related

- [Monorepo overview](../architecture/monorepo-overview.md)
- [Marker spec](../markers/marker-spec.md)
