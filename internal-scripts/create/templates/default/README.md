# {{projectName}}

Agentic skill-based app scaffolded with [skills-house](https://github.com/al4f/skills-house).

## Quick start

```bash
pnpm install   # if you used --no-install
pnpm build
pnpm dev       # build + install skills to this project (monorepo dev)
```

## Starter skill

Author in `skills/{{skillName}}/SKILL.md`. The build compiles source into `skills-dist/` for agent runtimes.

```bash
pnpm build
pnpm install:skills --scope project --skill {{skillName}}
```

## Ship to consumers

After pushing this repo to GitHub, consumers install skills with the official [skills.sh](https://www.skills.sh/docs/cli) CLI — from **your** repo, in **any** project where agents run:

```bash
npx skills add YOUR_ORG/{{projectName}} --skill {{skillName}}
```

Update `repository.url` in `package.json` so the build can derive the correct `owner/repo` in dependency notes.

## Learn more

- [skills-house framework docs](https://al4f.dev)
- [Agent Skills specification](https://agentskills.io)
