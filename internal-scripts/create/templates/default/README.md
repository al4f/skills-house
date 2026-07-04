# {{projectName}}

Agentic skill-based app scaffolded with [skills-house](https://github.com/al4f/skills-house).

## Quick start

```bash
pnpm install   # if you used --no-install
pnpm build
pnpm dev       # build + install skills to this project
```

## Starter skill

Author in `skills/{{skillName}}/SKILL.md`. The build compiles source into `skills-dist/` for agent runtimes.

```bash
pnpm build
pnpm install:skills --scope project --skill {{skillName}}
```

## Learn more

- [skills-house framework docs](https://al4f.dev)
- [Agent Skills specification](https://agentskills.io)
