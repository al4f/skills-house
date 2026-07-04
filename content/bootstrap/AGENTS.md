# Bootstrap skills-house in this repository

You are setting up a new **skills-house** project in this GitHub repository.

## Goal

Install the [skills-house](https://github.com/al4f/skills-house) framework so this repo can author, build, and install [Agent Skills](https://agentskills.io) for Cursor, Claude, Codex, and other agents.

## Steps

1. **Confirm prerequisites**
   - Node.js LTS (20+)
   - [pnpm](https://pnpm.io) installed
   - This directory is the repo root (or will become it)

2. **Scaffold the framework** into the current directory:

   ```bash
   npx @skills-house/create .
   ```

   If `npx @skills-house/create` is not yet on npm, use:

   ```bash
   git clone https://github.com/al4f/skills-house.git /tmp/skills-house
   cd /tmp/skills-house && nvm use && pnpm install && pnpm build
   node /tmp/skills-house/internal-scripts/create/dist/cli.js . --no-install
   cd - && pnpm install
   ```

3. **Build and install the starter skill** to this project:

   ```bash
   pnpm build
   pnpm dev
   ```

4. **Verify**
   - `skills-dist/` contains the built starter skill
   - `.agents/skills/` or `.cursor/skills/` contains the installed skill
   - `pnpm build` succeeds without errors

5. **Commit** the scaffolded project files (not `node_modules/`, `skills-dist/`, or installed skill symlinks).

## After setup

- Edit the starter skill in `skills/<skill-name>/SKILL.md`
- Run `pnpm build` after changes, then `pnpm install:skills --scope project`
- Set `repository.url` in `package.json` if it still shows `YOUR_ORG` (auto-filled when `origin` remote exists)

## Docs

- https://al4f.dev
- https://github.com/al4f/skills-house
