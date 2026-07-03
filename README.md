# skills-house

Open-source monorepo for authoring, building, and distributing [Agent Skills](https://agentskills.io). Source skills live under `skills/`; build output is written to `skills-dist/`.

Architecture, markers, naming, and the implementation plan are documented in **[specs/](./specs/)**.

## Quick start

```bash
nvm use
pnpm install
pnpm build
pnpm install:skills              # all agents (~/.agents/skills, ~/.codex/skills, …)
pnpm install:skills -- --agent cursor
pnpm install:skills -- --agent codex --skill brainstorming
```

Install targets (global scope):

| Agent | Directory |
|-------|-----------|
| agents (Codex open standard) | `~/.agents/skills/` |
| codex | `~/.codex/skills/` |
| cursor | `~/.cursor/skills/` |
| claude | `~/.claude/skills/` |

Use `--scope project` for repo-local `.agents/skills/`, `.cursor/skills/`, or `.claude/skills/`.
