<p align="center">
  <img src="./docs/assets/skills-house-banner.png" alt="skills-house — Author, Build, Ship Agent Skills" width="720" />
</p>

# skills-house

**Author, build, and ship [Agent Skills](https://agentskills.io) for Cursor, Claude Code, Codex, and more — from one monorepo.**

skills-house is an open-source toolkit for skill authors. Write simple source skills with modular markdown and shared scripts; the build pipeline produces spec-compliant artifacts ready to install into any supported agent.

---

## Why skills-house?

Agent Skills are powerful, but authoring them at scale gets messy fast:

- Duplicated scripts across skills
- Large `SKILL.md` files that burn context
- Manual copying into `~/.cursor/skills`, `.agents/skills`, `.claude/skills`, …
- No shared build step between source and what agents actually load

skills-house fixes that with a clear split:

| Layer | What it is |
|-------|------------|
| **Source** (`skills/`) | Freeform authoring — only `SKILL.md` is required |
| **Scripts** (`scripts/`) | Reusable execution packages shared across skills |
| **Build** (`@skills-house/build`) | Compiles markers + links → Agent Skills layout |
| **Dist** (`skills-dist/`) | What agents consume |
| **Install** | One command per agent or all at once |

---

## Features

- **Simple authoring** — `@include` for markdown fragments; standard `[label](target)` links for everything else
- **Shared script packages** — reference `visual-companion/start-server` instead of copy-pasting shell scripts
- **Agent Skills compliant output** — `SKILL.md`, `references/`, `scripts/`, `assets/`
- **Multi-agent install** — global (`~/.cursor/skills`, `~/.agents/skills`, …) or project-local (`.agents/skills`, `.claude/skills`, …)
- **pnpm monorepo** — skills, scripts, and tooling in one workspace

---

## Quick start

**Requirements:** Node.js LTS (see `.nvmrc`), [pnpm](https://pnpm.io)

```bash
git clone https://github.com/al4f/skills-house.git
cd skills-house
nvm use
pnpm install
pnpm build
pnpm install:skills --scope project   # install into this repo for local dev
```

Install globally for all agents:

```bash
pnpm install:skills
```

Uninstall:

```bash
pnpm remove:skills --scope project
pnpm remove:skills --agent cursor --skill brainstorming
```

---

## Available skills

| Skill | Description |
|-------|-------------|
| [brainstorming](./skills/brainstorming/) | Turn ideas into designs through structured dialogue before implementation |

More skills welcome — see [Contributing](#contributing).

---

## Authoring a skill

Source layout is **freeform**. The build only requires `SKILL.md` as entry.

```markdown
---
name: my-skill
description: What it does and when to use it.
---

# My Skill

@include /sections/workflow.md

Read [the guide](/references/deep-dive.md) when needed.
Run [start server](visual-companion/start-server).
```

### Reference rules

| Link target | Meaning |
|-------------|---------|
| `/references/foo.md` | In-package file → copied to dist |
| `package/export` | Named export from a `scripts/` package |
| `other-skill` | Skill dependency (install note injected at build) |

Only **`@include /path`** is a build marker. Everything else uses markdown links.

Full spec: **[specs/markers/marker-spec.md](./specs/markers/marker-spec.md)**

---

## Project structure

```
skills-house/
├── skills/                  # Source skill packages (author here)
├── scripts/                 # Shared script packages (package.json exports)
├── internal-scripts/
│   ├── build/               # @skills-house/build — skill compiler
│   └── install/             # install-skills.sh, remove-skills.sh
├── skills-dist/             # Built Agent Skills output
└── specs/                   # Architecture & design docs
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build compiler + all skills |
| `pnpm test` | Run build pipeline tests |
| `pnpm validate` | Run per-package validate scripts |
| `pnpm install:skills` | Install dist skills to agent directories |
| `pnpm remove:skills` | Remove installed skills |

Build a single skill:

```bash
pnpm --filter @skills-house/brainstorming build
```

### Install flags

| Flag | Description |
|------|-------------|
| `--agent cursor\|claude\|codex\|agents` | Target one agent |
| `--scope global\|project` | User home vs repo-local paths |
| `--skill <name>` | Install/remove one skill only |
| `--copy` | Copy files instead of symlinking (install only) |
| `--dry-run` | Preview actions |

### Install paths

**Global** (`pnpm install:skills`):

| Agent | Directory |
|-------|-----------|
| agents (open standard) | `~/.agents/skills/` |
| codex | `~/.codex/skills/` |
| cursor | `~/.cursor/skills/` |
| claude | `~/.claude/skills/` |

**Project** (`pnpm install:skills --scope project`):

| Agent | Directory |
|-------|-----------|
| agents / codex | `.agents/skills/` |
| cursor | `.agents/skills/` + `.cursor/skills/` |
| claude | `.claude/skills/` |

Project install paths are gitignored — they are local symlinks/copies from `skills-dist/`.

---

## Architecture

```
skills/ + scripts/          skills-dist/           agent dirs
┌─────────────────┐        ┌──────────────┐       ┌──────────────────┐
│ SKILL.md        │        │ SKILL.md     │       │ ~/.cursor/skills │
│ @include        │ build    │ references/  │ install │ ~/.claude/skills │
│ [links](…)      │ ──────►  │ scripts/     │ ────► │ ~/.agents/skills │
└─────────────────┘        └──────────────┘       └──────────────────┘
```

Deep dive: **[specs/architecture/monorepo-overview.md](./specs/architecture/monorepo-overview.md)**

---

## Contributing

1. Read the specs in [`specs/`](./specs/)
2. Add a skill under `skills/<name>/` with `SKILL.md` + `package.json`
3. Add shared scripts under `scripts/<name>/` if needed
4. Run `pnpm build && pnpm test`
5. Open a PR

Skill `name` in frontmatter must match the directory name (enforced by the build).

---

## Roadmap

- [ ] `npx skills add <name>` — npm publish + CLI for public installs
- [ ] Per-skill npm packages for download metrics
- [ ] Nested `@include` support
- [ ] CI for build + test on PRs

---

## License

[MIT](./LICENSE) © [al4f](https://github.com/al4f)

---

## Links

- [Agent Skills specification](https://agentskills.io)
- [Architecture specs](./specs/)
- [Marker / authoring spec](./specs/markers/marker-spec.md)
