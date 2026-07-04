# skills-house

![CI](https://github.com/al4f/skills-house/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/al4f/skills-house)

Open-source framework for authoring, building, and shipping [Agent Skills](https://agentskills.io).

**Docs:** [al4f.dev](https://al4f.dev) · [Specs](./specs/) · [Install guide](./content/publish/INSTALL.md)

```bash
npx @skills-house/create my-app
cd my-app && pnpm dev
```

Install the example skill in any repo:

```bash
npx skills add al4f/skills-house --skill skill-auditor -a cursor -y
```

## How it works

| Layer | Role |
|-------|------|
| `skills/` | Author skills (only `SKILL.md` required) |
| `scripts/` | Shared script packages |
| `@skills-house/build` | Compiles source → Agent Skills layout |
| `skills-dist/` | What agents load |
| Install | `npx skills add owner/repo --skill <name>` |

## Quick start (contributors)

```bash
git clone https://github.com/al4f/skills-house.git
cd skills-house && nvm use && pnpm install && pnpm build
pnpm install:skills --scope project   # optional
```

Until `@skills-house/create` is on npm, scaffold from a clone:

```bash
node internal-scripts/create/dist/cli.js my-app
```

## Authoring

```markdown
---
name: my-skill
description: What it does and when to use it.
---

@include /sections/workflow.md
Run [hello](fixture-helper/hello).
```

Spec: [skill-md-authoring.md](./specs/authoring/skill-md-authoring.md)

## Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build compiler + all skills |
| `pnpm test` | Run tests |
| `pnpm validate` | Validate skills + registry |
| `pnpm generate` | Regenerate registry + website data |
| `npx skills add al4f/skills-house --skill <name>` | Install from GitHub |
| `npx @skills-house/create <dir>` | Scaffold a new project |

## Structure

```
skills-house/
├── skills/              # Source skill packages
├── scripts/             # Shared script packages
├── internal-scripts/    # build, create, cli, install
├── skills-dist/         # Built output
└── specs/               # Architecture docs
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Skill updates to existing packages auto-merge when checks pass. New skills and framework changes need maintainer review.

## License

[MIT](./LICENSE) © [al4f](https://github.com/al4f)
