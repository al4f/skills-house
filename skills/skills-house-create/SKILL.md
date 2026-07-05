---
name: skills-house-create
description: "Use when scaffolding a new skills-house project or bootstrapping the framework into a repo. Covers @skills-house/create CLI, generated layout, fresh-project constraints, and future .house isolation."
metadata:
  author: al4f
  version: "0.1.0"
  tags:
    - create
    - scaffold
    - skills-house
    - framework
---

# skills-house Create

Operational guide for `@skills-house/create` — lightweight boilerplate that installs `@skills-house/*` from npm and sets up the skills workspace.

## When to use

- Greenfield agentic project with skills-house
- Bootstrapping an empty git repo (`create .`)
- Agent needs to warn about existing JS monorepo conflicts

## Command synopsis

```bash
npx @skills-house/create <project-directory> [options]
```

| Option | Default | Description |
|--------|---------|-------------|
| `<project-directory>` | required | Target path (`.` = current directory) |
| `--skill <name>` | derived from project name | Starter skill directory name |
| `--no-install` | run `pnpm install` | Skip install after scaffold |

## Generated layout

```
<project>/
├── package.json
├── pnpm-workspace.yaml
├── skills/<starter-skill>/
├── scripts/
├── skills-dist/          # gitignored
└── AGENTS.md
```

Template pulls `@skills-house/build` and `@skills-house/install` from npm — not vendored compiler source.

## Examples

**Minimal — new project:**

```bash
npx @skills-house/create my-app
cd my-app && pnpm build
```

**Common — bootstrap current git repo:**

```bash
npx @skills-house/create . --skill onboarding
pnpm install && pnpm build && pnpm install:skills --scope project
```

**Advanced — scaffold without install (air-gapped):**

```bash
npx @skills-house/create my-app --no-install
```

## Fresh project constraint

Scaffolding at the root of an **existing JS/TS monorepo** risks conflicts (`package.json`, workspace overlap, script name collisions). Prefer:

- A new directory or empty repo
- Future `.house/` enclave layout (RFC 0007, v1) for coexistence

## Boundaries

- Does **not** migrate existing apps automatically
- Does **not** run build or install-skills after scaffold (author runs explicitly)
- Does **not** replace `npx skills add` for consumer skill installs

After scaffold, install the framework skill:

```bash
npx skills add <owner>/<repo> --skill skill-auditor -a cursor -y
```

## Related RFC

- `specs/rfc/0005-create.md`
- `specs/rfc/0007-project-layout.md` (`.house/` layout, planned)
