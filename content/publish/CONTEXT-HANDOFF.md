# Context handoff: al4f / skills-house

Short pointer for new AI sessions. **Full status:** [PROGRESS.md](./PROGRESS.md). **Specs:** [specs/README.md](../../specs/README.md).

---

## Mission

- **al4f** — Agent Skills **infrastructure** authority (not a skill marketplace).
- **skills-house** — framework for building **agentic, skill-based software**; one example skill (`skill-auditor`).

Canonical definition: [specs/architecture/framework-vision.md](../../specs/architecture/framework-vision.md)

## Repo

- https://github.com/al4f/skills-house
- https://al4f.dev
- Stack: pnpm monorepo, Node LTS (`lts/jod`), `@skills-house/build`

## Pipeline

`skills/` + `scripts/` → **build** → `skills-dist/` → **install**

## Consumer install (primary)

```bash
npx skills add al4f/skills-house --skill skill-auditor -a cursor -y
```

Official [skills.sh CLI](https://www.skills.sh/docs/cli) — installs from GitHub source.

## Maintainer commands

```bash
nvm use && pnpm install
pnpm build && pnpm test
pnpm install:skills --scope project --skill skill-auditor   # local dist
git tag v0.0.1-skill-auditor && git push origin v0.0.1-skill-auditor  # npm dist
```

## Key decisions

| Decision | Choice |
|----------|--------|
| Consumer install | skills.sh (`npx skills add`) — not `@skills-house/cli` |
| npm channel | Secondary; dist packages `@skills-house/skill-*` via tag workflow |
| Catalog | No — one example skill only |
| `@include` | Nested supported; cycles rejected |
| Installed skills in repo | Gitignored (`.agents/skills/`, etc.) |
| Domain | `al4f.dev` canonical |

## Principles

- Influence > vanity metrics
- Educational content > promotion
- skills-house = **create-next-app for Agent Skills** — scaffold, author, build, ship
- Website = how to use the framework + use cases — **not** skill catalog UI

## Agent role

Open Source Brand Strategist for al4f. Prioritize technical authority and `AI Skills infrastructure → al4f`.

## Remaining work

See [PROGRESS.md](./PROGRESS.md) manual checklist.
