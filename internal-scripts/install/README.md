# @skills-house/install

Install built Agent Skills from `skills-dist/` into agent skill directories (Cursor, Claude, Codex, etc.).

## Usage

```bash
# Monorepo dev — install all built skills to project scope
pnpm install:skills --scope project

# Node CLI — install one skill from local dist
pnpm install:cli add skill-auditor --from ./skills-dist --scope project --dry-run

# After npm publish
npx @skills-house/install add skill-auditor --agent cursor
```

## Shell scripts

Direct shell access (used by scaffolded projects and CI):

```bash
bash internal-scripts/install/install-skills.sh --scope project --skill skill-auditor
bash internal-scripts/install/remove-skills.sh --scope project --skill skill-auditor
```

## Publish to npm

Tag format: `v<semver>-install` (legacy alias: `v<semver>-cli`).

```bash
git tag v0.0.1-install
git push origin v0.0.1-install
```

## Monorepo development

```bash
pnpm --filter @skills-house/install build
pnpm --filter @skills-house/install test
pnpm pack:install
```

## Consumer distribution

End users install skills via the official [skills.sh CLI](https://www.skills.sh/docs/cli):

```bash
npx skills add al4f/skills-house --skill skill-auditor -a cursor -y
```

This package is for **authors** who build skills locally and need to wire them into agent directories during development.
