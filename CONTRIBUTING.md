# Contributing to skills-house

Thanks for helping improve Agent Skills infrastructure. This guide distills the [specs](./specs/) into a contributor workflow.

## Before you start

1. Read [specs/architecture/monorepo-overview.md](./specs/architecture/monorepo-overview.md)
2. Read [specs/markers/marker-spec.md](./specs/markers/marker-spec.md)
3. Clone, `nvm use`, `pnpm install`, `pnpm build`, `pnpm test`

## Adding a skill

1. Create `skills/<name>/` with `SKILL.md` and `package.json`
2. Set frontmatter `name` to match the directory name exactly
3. Use `@include /sections/...` for modular markdown
4. Use `[label](/references/...)` for in-package files
5. Use `[label](script-package/export)` for shared scripts in `scripts/`
6. Add a `build` script: `"build": "skills-house-build ."`
7. Run `pnpm build && pnpm test`
8. Optionally run the [skill-auditor](./skills/skill-auditor/) checks on your skill

## Adding shared scripts

1. Create `scripts/<name>/package.json` with `exports` map
2. Reference from skills via markdown links: `[run](<name>/export-name)`
3. The build bundles resolved files into each skill's dist `scripts/`

## Pull request checklist

- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] Skill `name` in frontmatter matches directory
- [ ] No secrets or credentials in committed files
- [ ] Dist changes in `skills-dist/` are intentional (committed in v1)

## Code of conduct

Be constructive and technical. Prefer educational discussion over promotion.

## Questions

Open a [GitHub issue](https://github.com/al4f/skills-house/issues) or read articles at [al4f.dev](https://al4f.dev).
