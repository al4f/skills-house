# @skills-house/install

Install built Agent Skills from `skills-dist/` into agent skill directories (Cursor, Claude, Codex, and the shared `.agents/skills` layout).

Use this during **local development** after `pnpm build`. End users typically install published skills with the [skills.sh CLI](https://www.skills.sh/docs/cli) instead.

## Quick start

```bash
# Build skills first, then install to the current project
pnpm build
npx @skills-house/install add my-skill --from ./skills-dist --scope project

# Install for Cursor only
npx @skills-house/install add my-skill --from ./skills-dist --agent cursor --scope project
```

In a scaffolded skills-house project:

```bash
pnpm dev   # runs build + install:skills --scope project
```

## CLI

```bash
npx @skills-house/install add <skill-name> [options]
```

The binary name is `install-skills`.

| Option | Description |
|--------|-------------|
| `<skill-name>` | Skill directory name inside the dist folder |
| `--agent <name>` | Install for one agent: `agents`, `codex`, `cursor`, `claude` (default: all) |
| `--scope <scope>` | `global` (user home) or `project` (current repo) — default: `global` |
| `--from <path>` | Local dist directory (e.g. `./skills-dist`) |
| `--copy` | Copy files instead of symlinking |
| `--dry-run` | Print actions without changing anything |
| `--help` | Show help |

### Examples

```bash
# Preview install
npx @skills-house/install add skill-auditor --from ./skills-dist --scope project --dry-run

# Global install for Claude
npx @skills-house/install add skill-auditor --from ./skills-dist --agent claude

# Copy instead of symlink (useful on Windows or sandboxes)
npx @skills-house/install add skill-auditor --from ./skills-dist --scope project --copy
```

### Resolving skill sources

When `--from` is omitted, the CLI tries in order:

1. `skills-dist/` in a nearby skills-house monorepo
2. The npm package `@skills-house/skill-<name>` (if published)

If neither works, it prints hints for cloning the repo or using `npx skills add`.

## Install targets

| Agent | Global | Project |
|-------|--------|---------|
| agents | `~/.agents/skills/<skill>` | `.agents/skills/<skill>` |
| codex | `~/.codex/skills/<skill>` | `.agents/skills/<skill>` |
| cursor | `~/.cursor/skills/<skill>` | `.agents/skills/<skill>` and `.cursor/skills/<skill>` |
| claude | `~/.claude/skills/<skill>` | `.claude/skills/<skill>` |

By default, skills are **symlinked** from `skills-dist/` so rebuilds are picked up immediately. Use `--copy` when symlinks are not supported.

## Shell scripts

Scaffolded projects and CI can call the bash scripts directly:

```bash
# Install all built skills (except test fixtures) to project scope
bash internal-scripts/install/install-skills.sh --scope project

# Install one skill for one agent
bash internal-scripts/install/install-skills.sh \
  --scope project --agent cursor --skill my-skill

# Remove installed skills
bash internal-scripts/install/remove-skills.sh --scope project --skill my-skill
```

Environment variables:

| Variable | Purpose |
|----------|---------|
| `SKILLS_DIST_DIR` | Override dist directory (default: `<repo>/skills-dist`) |
| `SKILLS_REPO_ROOT` | Repo root for project-scope paths |

## Consumer distribution

For installing skills from GitHub (no skills-house npm packages required):

```bash
npx skills add al4f/skills-house --skill skill-auditor -a cursor -y
```

See the [install guide](https://github.com/al4f/skills-house/blob/main/content/publish/INSTALL.md).

## Requirements

- Node.js ≥ 20
- `bash` (for the underlying install scripts)

## Related packages

| Package | Role |
|---------|------|
| [`@skills-house/build`](https://www.npmjs.com/package/@skills-house/build) | Compile source skills to `skills-dist/` |
| [`@skills-house/create`](https://www.npmjs.com/package/@skills-house/create) | Scaffold a new skills-house project |

## Monorepo development

```bash
pnpm --filter @skills-house/install build
pnpm --filter @skills-house/install test
pnpm pack:install
```

Publish tag format: `v<semver>-install` (legacy alias: `v<semver>-cli`).

```bash
git tag v0.0.1-install
git push origin v0.0.1-install
```

## Learn more

- [skills-house docs](https://al4f.dev)
- [Agent Skills specification](https://agentskills.io)
