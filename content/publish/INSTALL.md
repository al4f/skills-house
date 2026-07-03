# Install skills in any repo

Use the official **[skills.sh](https://www.skills.sh) CLI** — same UX as [vercel-labs/agent-skills](https://www.skills.sh/docs/cli).

## Quick start

From your project root (e.g. `snappfood-vendor`):

```bash
# List skills in the repo
npx skills add al4f/skills-house --list

# Install skill-auditor for Cursor (project scope)
npx skills add al4f/skills-house --skill skill-auditor -a cursor -y

# All agents, project scope
npx skills add al4f/skills-house --skill skill-auditor -y
```

Global install:

```bash
npx skills add al4f/skills-house --skill skill-auditor -g -a cursor -y
```

## How it works

The [`skills`](https://www.npmjs.com/package/skills) CLI (by Vercel) clones the public GitHub repo and wires skills into agent directories — no skills-house npm packages required.

| Flag | Meaning |
|------|---------|
| `--skill <name>` | Install one skill from a multi-skill repo |
| `-a, --agent cursor` | Target Cursor (also: `claude`, `codex`, `*`) |
| `-g, --global` | Install to user home instead of project |
| `-y, --yes` | Non-interactive |
| `--copy` | Copy files instead of symlinking |
| `--list` | Show available skills without installing |

Installed paths (project):

- `.agents/skills/skill-auditor`
- `.cursor/skills/skill-auditor` (when using Cursor agent)

## Remove

```bash
npx skills remove skill-auditor
```

## Monorepo dev (skills-house)

Build + install from local dist:

```bash
pnpm build
pnpm install:skills --scope project --skill skill-auditor
```

## npm channel (optional)

Per-skill npm packages (`@skills-house/skill-*`) are an alternate distribution path for download metrics. Primary install for consumers is **Git + skills.sh**:

```bash
npx skills add al4f/skills-house --skill skill-auditor
```

## Related

- [skills.sh CLI docs](https://www.skills.sh/docs/cli)
- [PUBLISHING.md](./PUBLISHING.md) — npm tags (secondary channel)
- [NPM-SETUP.md](./NPM-SETUP.md) — npm org setup
