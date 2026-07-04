# Contributing to Skills House

skills-house is an open-source **framework** for building agentic, skill-based software with [Agent Skills](https://agentskills.io) — built by [al4f](https://al4f.dev).

Like `create-next-app` for web apps, scaffold a project with `npx create-skills-house` — freeform skill authoring and automated compile-and-ship. The audience is not only developers: skills work across Cursor, Claude Code, Codex, mobile agents, and similar tools.

**[al4f.dev](https://al4f.dev)** documents how to work with the framework and what you can build with it — not a skill catalog or marketplace.

There are **two contribution types** with different review policies.

## 1. Skill contributions (auto-merge)

Skills are **content**. When your PR only adds or updates a skill under `skills/<name>/`, and all checks pass, a bot approves and merges automatically — no maintainer interaction required.

### Requirements

Your skill PR must pass:

- Schema validation (`specs/schema/skill-frontmatter.schema.json`)
- Linting (`pnpm validate`)
- Documentation generation (`pnpm generate`)
- Dependency validation (script refs, skill deps, broken links)

### How to add a skill

1. Read [specs/markers/marker-spec.md](./specs/markers/marker-spec.md)
2. Create `skills/<name>/` with `SKILL.md` and `package.json`
3. Set frontmatter `name` to match the directory name exactly
4. Add optional `metadata.author`, `metadata.tags`, `metadata.version`
5. Use `@include /sections/...` for modular markdown
6. Use `[label](/references/...)` for in-package files
7. Use `[label](script-package/export)` for shared scripts in `scripts/`
8. Add `"build": "skills-house-build ."` and a `validate` script to `package.json`
9. Run `pnpm build && pnpm test && pnpm generate`
10. Open a PR that **only** changes files under `skills/<name>/` (and the matching `skills-dist/<name>/` build output)

Generated metadata and site data update automatically on merge.

## 2. Framework contributions (manual review)

Everything **except** skill content requires maintainer review. These PRs are **never** auto-merged.

Examples:

- Scaffold CLI and developer experience
- Website templates and styling
- Build system and optional dev CLI
- Documentation and specs
- Scripts, validators, generators
- GitHub Actions and APIs

Open a normal PR and wait for maintainer approval.

## Adding shared scripts

Script packages are framework contributions unless bundled as part of an approved framework change. To reference existing scripts from a skill:

1. Use markdown links: `[run](<name>/export-name)`
2. The build bundles resolved files into each skill's dist `scripts/`

To add a new shared script package, open a **framework** PR under `scripts/<name>/` with `package.json` exports and optional `skills-house` metadata (`inputs`, `outputs`, `examples`, `maintainers`).

## Local development

```bash
nvm use
pnpm install
pnpm build
pnpm test
pnpm generate    # metadata + website data
pnpm generate:check  # fail if generated output is stale
node scripts/sync-create-template.mjs  # after build/cli changes — refresh create-skills-house vendor
```

## Pull request checklist

### Skill PRs

- [ ] Changes limited to `skills/<name>/` (+ `skills-dist/<name>/`)
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] `pnpm validate` passes
- [ ] Frontmatter passes schema validation
- [ ] No secrets or credentials in committed files

### Framework PRs

- [ ] `pnpm build && pnpm test` pass
- [ ] Describe impact on generators, website, or CI
- [ ] Maintainer review requested

## Questions

Open a [GitHub issue](https://github.com/al4f/skills-house/issues) or read framework docs at [al4f.dev](https://al4f.dev).
