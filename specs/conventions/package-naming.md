# Package Naming Conventions

**Date:** 2026-07-03  
**Status:** Draft

## npm scope

All published packages use the `@skills-house` scope:

```
@skills-house/brainstorming          # skill (source / dist)
@skills-house/script-visual-companion   # scripts workspace package
@skills-house/build                  # build tool (internal-scripts)
```

## Workspace categories → package names

| Workspace | Directory | Package name pattern | Example |
|-----------|-----------|---------------------|---------|
| Skills | `skills/<name>/` | `@skills-house/<name>` | `@skills-house/brainstorming` |
| Scripts | `scripts/<name>/` | `@skills-house/script-<name>` | `@skills-house/script-visual-companion` |
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
  "name": "@skills-house/script-visual-companion",
  "exports": {
    "./start-server": "./scripts/start-server.sh",
    "./server": "./scripts/server.cjs"
  }
}
```

Referenced in skills as a markdown link:

```markdown
[Start server](visual-companion/start-server)
```

The `visual-companion` segment is the **short name** (directory under `scripts/`), not the full npm scope. The build tool maps it to `@skills-house/script-visual-companion`.

## Short-name uniqueness

Package link targets use the **directory short name** (e.g. `visual-companion`, `brainstorming`), not the npm scope name.

**Rule:** A short name must exist in only one workspace. Do not create both `skills/foo/` and `scripts/foo/` — the build looks up `scripts/` first, then `skills/`, and ambiguous names cause confusing resolution.

| Short name | Workspace | Directory |
|------------|-----------|-----------|
| `brainstorming` | skills | `skills/brainstorming/` |
| `visual-companion` | scripts | `scripts/visual-companion/` |
| `fixture-helper` | scripts | `scripts/fixture-helper/` |

## Related

- [Monorepo overview](../architecture/monorepo-overview.md)
- [Marker spec](../markers/marker-spec.md)
