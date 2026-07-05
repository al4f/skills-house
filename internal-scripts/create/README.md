# @skills-house/create

Scaffold a new [skills-house](https://github.com/al4f/skills-house) project: workspace layout, starter skill, vendored build/install tooling, and `pnpm` scripts for the dev loop.

## Quick start

```bash
npx @skills-house/create my-app
cd my-app
pnpm dev
```

`pnpm dev` builds your starter skill and installs it into this project’s agent directories (`.agents/skills/`, `.cursor/skills/`, etc.).

## CLI

```bash
npx @skills-house/create <project-directory> [options]
```

| Option | Description |
|--------|-------------|
| `<project-directory>` | Where to create the project (use `.` to bootstrap the current directory) |
| `--skill <name>` | Starter skill directory name (default: derived from the project name) |
| `--no-install` | Skip `pnpm install` after scaffolding |
| `--help` | Show help |

### Examples

```bash
# New directory
npx @skills-house/create my-app

# Custom starter skill name
npx @skills-house/create my-app --skill onboarding

# Bootstrap an existing empty Git repo
cd my-existing-repo
npx @skills-house/create .

# Scaffold without installing dependencies (offline or CI)
npx @skills-house/create my-app --no-install
```

## What you get

```
my-app/
├── skills/<skill-name>/SKILL.md   # Starter skill source
├── scripts/                       # Shared script packages
├── internal-scripts/
│   ├── build/                     # Vendored @skills-house/build
│   └── install/                   # Vendored @skills-house/install
├── skills-dist/                   # Built output (after pnpm build)
├── package.json                   # build, dev, install:skills scripts
├── pnpm-workspace.yaml
└── README.md
```

### Default scripts

| Script | What it does |
|--------|----------------|
| `pnpm build` | Compile all skills under `skills/` into `skills-dist/` |
| `pnpm dev` | `build` + install skills to this project |
| `pnpm install:skills` | Install built skills (see `@skills-house/install`) |
| `pnpm remove:skills` | Remove installed skills from agent directories |

## Typical workflow

```bash
npx @skills-house/create my-app
cd my-app

# Edit the starter skill
$EDITOR skills/my-app/SKILL.md

# Build and install locally
pnpm dev

# Publish: push to GitHub, then consumers run:
# npx skills add YOUR_ORG/my-app --skill my-app -a cursor -y
```

If you used `--no-install`:

```bash
pnpm install
pnpm build
pnpm install:skills --scope project
```

## Requirements

- Node.js ≥ 20
- [pnpm](https://pnpm.io) (recommended; the scaffolder warns if it is missing)

## Related packages

| Package | Role |
|---------|------|
| [`@skills-house/build`](https://www.npmjs.com/package/@skills-house/build) | Compile source skills (also vendored in scaffolded projects) |
| [`@skills-house/install`](https://www.npmjs.com/package/@skills-house/install) | Install built skills locally (also vendored) |

Scaffolded projects work offline with vendored CLIs. You can also add the npm packages as `devDependencies` and drop the `internal-scripts/` copies when you prefer.

## Monorepo development

From a clone of [skills-house](https://github.com/al4f/skills-house):

```bash
nvm use && pnpm install && pnpm build
node internal-scripts/create/dist/cli.js my-app
```

```bash
pnpm --filter @skills-house/create build
pnpm --filter @skills-house/create test
```

After changing `@skills-house/build` or `@skills-house/install`, refresh vendored template files:

```bash
pnpm --filter @skills-house/build build
pnpm --filter @skills-house/install build
node scripts/sync-create-template.mjs
```

Pack for npm publish:

```bash
pnpm build
node scripts/pack-create.mjs
```

Publish tag format: `v<semver>-create`.

```bash
git tag v0.1.1-create
git push origin v0.1.1-create
```

## Learn more

- [skills-house docs](https://al4f.dev)
- [SKILL.md authoring spec](https://github.com/al4f/skills-house/blob/main/specs/authoring/skill-md-authoring.md)
- [Agent Skills specification](https://agentskills.io)
