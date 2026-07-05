# @skills-house/build

Compile a source skill package into a spec-compliant [Agent Skills](https://agentskills.io) layout under `skills-dist/`.

Use this when you author skills in a skills-house project: expand `@include` fragments, resolve file and script links, copy assets, and emit a single `SKILL.md` that agents can load.

## Quick start

```bash
# From a skill directory (needs SKILL.md)
npx @skills-house/build ./skills/my-skill

# Typical workflow in a scaffolded project
pnpm build
```

Output defaults to `<repo-root>/skills-dist/<skill-name>/`.

## CLI

```bash
npx @skills-house/build <skill-dir> [options]
```

| Option | Description |
|--------|-------------|
| `<skill-dir>` | Path to the source skill package (must contain `SKILL.md`) |
| `--out <dir>` | Output directory (default: `<repo-root>/skills-dist/<name>`) |
| `--repo-root <path>` | Monorepo root (default: nearest ancestor with `pnpm-workspace.yaml`) |
| `--help` | Show help |

### Examples

```bash
# Build one skill
npx @skills-house/build skills/skill-auditor

# Custom output path
npx @skills-house/build skills/my-skill --out ./dist/my-skill

# Explicit repo root (useful in CI or non-standard layouts)
npx @skills-house/build ./skills/my-skill --repo-root .
```

## Project integration

In a skills-house project, each skill under `skills/<name>/` wires the CLI through `package.json`:

```json
{
  "scripts": {
    "build": "build ."
  },
  "devDependencies": {
    "@skills-house/build": "^0.0.1"
  }
}
```

The root `package.json` usually runs all skills:

```json
{
  "scripts": {
    "build": "pnpm --filter \"./skills/*\" build"
  }
}
```

## What the compiler does

Given a source `SKILL.md` like:

```markdown
---
name: my-skill
description: What it does and when to use it.
---

@include /sections/workflow.md

See [the guide](/references/guide.md).
Run [helper](fixture-helper/hello).
```

The build step:

1. Expands `@include /path/to/fragment.md` recursively (cycles are rejected).
2. Copies linked files (`/references/…`, `/scripts/…`, `/assets/…`) into the output tree.
3. Rewrites package links (`[label](other-skill)`) when skills depend on each other in the same repo.
4. Writes `skills-dist/my-skill/SKILL.md` with inlined body and updated frontmatter.

Authoring rules: [skill-md-authoring spec](https://github.com/al4f/skills-house/blob/main/specs/authoring/skill-md-authoring.md).

## Programmatic API

```ts
import { buildSkill } from "@skills-house/build";

await buildSkill({
  skillDir: "/path/to/skills/my-skill",
  outDir: "/path/to/skills-dist/my-skill",
  repoRoot: "/path/to/repo",
});
```

Also exported: `parseSkillMd`, `findIncludes`, `findLinks`, `classifyHref`, `getRepoSlug`.

## Requirements

- Node.js ≥ 20

## Related packages

| Package | Role |
|---------|------|
| [`@skills-house/create`](https://www.npmjs.com/package/@skills-house/create) | Scaffold a new skills-house project |
| [`@skills-house/install`](https://www.npmjs.com/package/@skills-house/install) | Install built skills into agent directories |

After building, install locally:

```bash
npx @skills-house/install add my-skill --from ./skills-dist --scope project
```

Consumers install published skills from GitHub:

```bash
npx skills add owner/repo --skill my-skill -a cursor -y
```

## Monorepo development

```bash
pnpm --filter @skills-house/build build
pnpm --filter @skills-house/build test
```

Publish tag format: `v<semver>-build`.

```bash
git tag v0.0.1-build
git push origin v0.0.1-build
```

## Learn more

- [skills-house docs](https://al4f.dev)
- [Agent Skills specification](https://agentskills.io)
