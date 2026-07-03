# Publishing to skills.sh

**Date:** 2026-07-03  
**Status:** Draft

## Overview

[skills.sh](https://skills.sh) lists public Agent Skills that users install with the Vercel [`skills`](https://github.com/vercel-labs/skills) CLI. There is no separate registry upload — a skill becomes discoverable when people run `npx skills add` against your public GitHub repo (install telemetry).

skills-house publishes **built** artifacts from `skills-dist/`, not source under `skills/`.

## Tag convention

Each release is an annotated git tag:

```
<skill-name>/v<semver>
```

| Example tag | Skill | Version |
|-------------|-------|---------|
| `brainstorming/v1.0.0` | `brainstorming` | `1.0.0` |

Rules:

- Skill name must match the directory under `skills/` and `skills-dist/`.
- Version must be valid [semver](https://semver.org/) (`MAJOR.MINOR.PATCH`, optional pre-release/build).
- Tag points at a commit that includes the matching built output in `skills-dist/<skill>/`.

Store the canonical version in the skill source `package.json`:

```json
{
  "name": "@skills-house/brainstorming",
  "version": "1.0.0"
}
```

## Publish workflow

### 1. Build and commit

```bash
pnpm --filter @skills-house/<skill> build
git add skills-dist/<skill>
git commit -m "chore: build <skill> for release"
```

### 2. Tag and push

Use the publish helper (reads `version` from `skills/<skill>/package.json`):

```bash
pnpm publish:skill <skill> --push
```

Or pass an explicit version:

```bash
pnpm publish:skill <skill> 1.0.0 --push
```

Options:

| Flag | Description |
|------|-------------|
| `--push` | Push the tag to `origin` |
| `--bootstrap` | Run `npx skills add …` globally to register skills.sh telemetry |
| `--no-build` | Skip the build step (dist must already exist) |
| `--allow-dirty` | Allow uncommitted `skills-dist/` changes |
| `--dry-run` | Preview without creating tags |

### 3. CI release

Pushing a tag matching `*/v*` triggers [`.github/workflows/publish-skill.yml`](../../.github/workflows/publish-skill.yml), which:

1. Verifies `skills-dist/<skill>/` exists at the tag
2. Rebuilds and runs tests
3. Creates a GitHub Release with install commands
4. Bootstraps skills.sh telemetry with a global install

## Install commands (for consumers)

Replace `owner/repo` with this repository (e.g. `al4f/skills-house`).

**Pinned to a release tag (recommended for teams):**

```bash
npx skills add owner/repo/skills-dist/brainstorming#brainstorming/v1.0.0 -g -y
```

**Latest on the default branch:**

```bash
npx skills add owner/repo/skills-dist --skill brainstorming -g -y
```

**Full GitHub URL:**

```bash
npx skills add https://github.com/owner/repo/tree/brainstorming/v1.0.0/skills-dist/brainstorming -g -y
```

The `#<tag>` fragment pins the git ref. Subpath `skills-dist/<skill>` selects the built artifact directory.

## skills.sh discoverability

- Listing is driven by anonymous install telemetry from `npx skills add`.
- Run `--bootstrap` (or install once yourself) after the first release so the skill can appear in search sooner.
- Accumulated installs affect ranking on skills.sh.

## Related

- [Monorepo overview](../architecture/monorepo-overview.md)
- [Package naming](./package-naming.md)
