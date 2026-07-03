# Install published skills in any repo

Use **`skills.sh`** — no npm CLI package required. Skills install from `@skills-house/skill-*` packages on npm.

## Quick start (another repo)

From the **project root** (e.g. `snappfood-vendor`):

```bash
curl -fsSL https://raw.githubusercontent.com/al4f/skills-house/main/skills.sh | bash -s -- add skill-auditor --scope project --dry-run
```

Install for real:

```bash
curl -fsSL https://raw.githubusercontent.com/al4f/skills-house/main/skills.sh | bash -s -- add skill-auditor --scope project --agent cursor
```

Or download once and reuse:

```bash
curl -fsSL https://raw.githubusercontent.com/al4f/skills-house/main/skills.sh -o skills.sh
chmod +x skills.sh
./skills.sh add skill-auditor --scope project --agent cursor
```

## What it does

1. Downloads `@skills-house/skill-<name>` from npm (`npm pack`)
2. Installs into agent paths via `install-skills.sh`

| Scope | Cursor paths |
|-------|----------------|
| `project` | `.agents/skills/<name>`, `.cursor/skills/<name>` |
| `global` | `~/.agents/skills/<name>`, `~/.cursor/skills/<name>` |

## Commands

```bash
skills.sh add <name> [--scope project] [--agent cursor] [--copy] [--dry-run]
skills.sh add <name> --from ./skills-dist          # local dist (monorepo dev)
skills.sh remove <name> [--scope project] [--agent cursor] [--dry-run]
```

## Requirements

- `bash`, `curl`, `npm` (for registry download), `tar`
- Published skill on npm: `npm view @skills-house/skill-skill-auditor version`

## Remove

```bash
./skills.sh remove skill-auditor --scope project
```

## Gitignore (optional)

```gitignore
.agents/skills/
.cursor/skills/
.claude/skills/
```

## Monorepo dev

From skills-house itself:

```bash
pnpm build
./skills.sh add skill-auditor --from ./skills-dist --scope project
```

## Related

- [NPM-SETUP.md](./NPM-SETUP.md) — org + publish tags
- [PUBLISHING.md](./PUBLISHING.md) — release workflow
