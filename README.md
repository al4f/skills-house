# skills-house

Open-source monorepo for authoring, building, and distributing [Agent Skills](https://agentskills.io). Source skills live under `skills/`; build output is written to `skills-dist/`.

Architecture, markers, naming, and the implementation plan are documented in **[specs/](./specs/)**.

## Quick start

```bash
nvm use
pnpm install
pnpm build
pnpm install:skills                    # global: all agents
pnpm install:skills --scope project    # project: .agents, .cursor, .claude
pnpm remove:skills --scope project     # uninstall from project paths
pnpm install:skills --agent cursor
pnpm install:skills --agent codex --scope project --skill brainstorming
```

Install targets (global scope):

| Agent | Directory |
|-------|-----------|
| agents (Codex open standard) | `~/.agents/skills/` |
| codex | `~/.codex/skills/` |
| cursor | `~/.cursor/skills/` |
| claude | `~/.claude/skills/` |

Install targets (project scope — `--scope project`):

| Agent | Directory | Notes |
|-------|-----------|-------|
| agents | `.agents/skills/` | Open Agent Skills standard |
| codex | `.agents/skills/` | Same path as agents (no error) |
| cursor | `.agents/skills/` + `.cursor/skills/` | Both open standard and Cursor-specific |
| claude | `.claude/skills/` | Claude Code project skills |

Shared paths are installed once when installing all agents.
