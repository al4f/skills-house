# {{projectName}} — Agent Skills project

This repository is a [skills-house](https://github.com/al4f/skills-house) project for authoring, building, and installing [Agent Skills](https://agentskills.io).

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm build` | Compile skills from `skills/` into `skills-dist/` |
| `pnpm dev` | Build + install skills to this project (`.agents/skills/`, `.cursor/skills/`) |
| `pnpm install:skills --scope project` | Install built skills after a build |
| `pnpm remove:skills --scope project` | Remove installed skills |

## Authoring

- Starter skill: `skills/{{skillName}}/SKILL.md`
- Use `@include /sections/...` for markdown fragments
- Use `[label](fixture-helper/hello)` for shared scripts in `scripts/`
- Use `[other-skill](other-skill)` only when depending on another skill in this repo (requires `repository` in `package.json`)

## Publishing skills

Consumers install from your GitHub repo:

```bash
npx skills add YOUR_ORG/{{projectName}} --skill {{skillName}} -a cursor -y
```

Replace `YOUR_ORG` with your GitHub org or username after pushing this repo.

## Docs

- https://al4f.dev
- https://github.com/al4f/skills-house/tree/main/specs
