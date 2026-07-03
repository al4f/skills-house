# Contributing to Skills House

Skills House is the official platform for publishing, discovering, and reusing AI Skills — built by [al4f](https://al4f.dev). GitHub stores the source; [al4f.dev](https://al4f.dev) is the experience.

There are **two contribution types** with different review policies.

## 1. Skill contributions (auto-merge)

Skills are **content**. When your PR only adds or updates a skill under `skills/<name>/`, and all checks pass, a bot approves and merges automatically — no maintainer interaction required.

### Requirements

Your skill PR must pass:

- Schema validation (`specs/schema/skill-frontmatter.schema.json`)
- Linting (`pnpm validate`)
- Documentation generation (`pnpm generate`)
- Dependency validation (script refs, skill deps, broken links)

### How to publish a skill

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

The registry, search index, dependency graph, and website pages regenerate automatically on merge.

## 2. Platform contributions (manual review)

Everything **except** skill content requires maintainer review. These PRs are **never** auto-merged.

Examples:

- Website templates and styling
- CLI and build system
- Documentation and specs
- Scripts, validators, generators
- GitHub Actions and APIs

Open a normal PR and wait for maintainer approval.

## Adding shared scripts

Script packages are platform contributions unless bundled as part of an approved platform change. To reference existing scripts from a skill:

1. Use markdown links: `[run](<name>/export-name)`
2. The build bundles resolved files into each skill's dist `scripts/`

To add a new shared script package, open a **platform** PR under `scripts/<name>/` with `package.json` exports and optional `skills-house` metadata (`inputs`, `outputs`, `examples`, `maintainers`).

## Local development

```bash
nvm use
pnpm install
pnpm build
pnpm test
pnpm generate    # registry + website data
pnpm generate:check  # fail if generated output is stale
```

## Pull request checklist

### Skill PRs

- [ ] Changes limited to `skills/<name>/` (+ `skills-dist/<name>/`)
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] `pnpm validate` passes
- [ ] Frontmatter passes schema validation
- [ ] No secrets or credentials in committed files

### Platform PRs

- [ ] `pnpm build && pnpm test` pass
- [ ] Describe impact on generators, website, or CI
- [ ] Maintainer review requested

## Questions

Open a [GitHub issue](https://github.com/al4f/skills-house/issues) or read articles at [al4f.dev](https://al4f.dev).
