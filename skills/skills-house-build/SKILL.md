---
name: skills-house-build
description: "Use when compiling skills-house source skills to Agent Skills dist. Covers @skills-house/build CLI, skill directory input, dist output paths, and @include/link addressing rules."
metadata:
  author: al4f
  version: "0.1.0"
  tags:
    - build
    - skills-house
    - framework
---

# skills-house Build

Operational guide for `@skills-house/build` — compiles skill source packages into spec-compliant dist under `skills-dist/`.

## When to use

- Author changed `skills/<name>/SKILL.md` or linked files
- CI needs a single skill built from a path
- Agent must explain how build resolves `@include` and markdown links

## Command synopsis

```bash
# Monorepo — all skills
pnpm build

# Single skill (package script)
pnpm --filter @skills-house/skill-<name> build

# CLI directly
npx @skills-house/build <skill-dir> [--out <dir>] [--repo-root <path>]
```

| Option | Default | Description |
|--------|---------|-------------|
| `<skill-dir>` | required | Path to `skills/<name>/` with `SKILL.md` |
| `--out` | `<repo-root>/skills-dist/<name>/` | Output directory |
| `--repo-root` | nearest `pnpm-workspace.yaml` ancestor | Monorepo root for link resolution |

## Addressing rules (summary)

| Mechanism | Href pattern | Result |
|-----------|--------------|--------|
| `@include` | `@include /sections/foo.md` | Merged into body; cycles rejected |
| In-package file | href starts with `/` | Copied to dist; href rewritten |
| Script package | `script-pkg/export-name` | Bundled to dist `scripts/` |
| Skill package | `other-skill` | Dependency note + `metadata.dependencies` |

Full rules: `specs/authoring/skill-md-authoring.md` in the skills-house repo.

## Examples

**Minimal — rebuild one skill after edit:**

```bash
pnpm --filter @skills-house/skill-auditor build
```

**Common — full monorepo build:**

```bash
pnpm build
```

**Advanced — explicit paths (CI):**

```bash
node internal-scripts/build/dist/cli.js skills/skill-auditor \
  --repo-root . \
  --out ./skills-dist/skill-auditor
```

## Boundaries

- Builds **source → dist** only; does not install into agent directories (use `skills-house-install`)
- Does not publish to npm or skills.sh
- Does not validate dist output (run `pnpm validate` on source packages)
- Consumer repos install **Git source** via skills.sh, not local dist

## Related RFC

`specs/rfc/0003-build.md`
