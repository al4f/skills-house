# RFC 0003: `@skills-house/build`

**Status:** Accepted  
**Date:** 2026-07-05  
**Depends on:** [RFC 0001](./0001-framework-foundation.md), [RFC 0002](./0002-skill-source-package.md)  
**Related:** [monorepo-overview.md](../architecture/monorepo-overview.md), [skill-md-authoring.md](../authoring/skill-md-authoring.md)

## Summary

Normative behavior for the skill compiler: input, addressing rules, build steps, and output.

## 1. Purpose

`@skills-house/build` compiles **skill source packages** into **Agent Skills dist** folders.

It exists to:

1. Merge `@include` fragments into a single `SKILL.md` body.
2. Resolve markdown links — copy in-package files, bundle script packages, record skill dependencies.
3. Emit spec-compliant output for install and agent consumption.

It does **not** generate catalogs, search indexes, or dependency graphs for product features.

## 2. CLI interface

### Commands

```bash
# Build all skills in workspace (monorepo root)
skills-house-build
pnpm build   # invokes build for all skill packages

# Build one skill (CI / explicit path)
node @skills-house/build/dist/cli.js skills/<name>
skills-house-build skills/<name>
```

### Input

| Argument | Required | Description |
|----------|----------|-------------|
| `<skill-dir>` | No (default: all workspace skills) | Path to `skills/<name>/` containing `SKILL.md` + `package.json` |

The builder discovers the skill entry via `package.json` **`exports["."]`**, which MUST resolve to `SKILL.md` (RFC 0002).

### Output

| Option | Default | Description |
|--------|---------|-------------|
| Output directory | `<repo-root>/skills-dist/<skill-name>/` | One dist folder per skill |

Dist is **write-only generated output** — never validated as source; never edited by hand.

## 3. Addressing rules

All resolution uses paths and hrefs from source `SKILL.md` (after frontmatter). See [skill-md-authoring.md](../authoring/skill-md-authoring.md).

### 3.1 `@include`

- Syntax: `@include /path/to/fragment.md`
- Recursive expansion; **cycles rejected** with error.
- Markdown only; merged into body (not copied separately unless also linked).

### 3.2 In-package file links

- Href starts with `/` → file under skill package root.
- Copied to dist subfolder by prefix:

| Source prefix | Dist folder |
|---------------|-------------|
| `/references/**` | `references/` |
| `/scripts/**` | `scripts/` |
| `/assets/**` | `assets/` |

- Href rewritten to spec-relative (no leading `/`).

### 3.3 Script package links

- Href has **no** leading `/` and matches `scripts/<pkg>/export-name`.
- Resolved via workspace `scripts/<pkg>/package.json` **`exports`**.
- Matched files copied/bundled into dist `scripts/`.

Export naming: `[label](fixture-helper/hello)` → `exports["./hello"]` on package whose short name is `fixture-helper`.

### 3.4 Skill package links

- Href has no leading `/` and matches another `skills/<other>/` package default export.
- **No file copy.**
- Dependency recorded in `metadata.dependencies`.
- Link replaced with install-suggestion block; repo slug from root `package.json` `repository` URL (see [hardcoded-exceptions.md](../conventions/hardcoded-exceptions.md)).

### 3.5 Disambiguation rule

```
href starts with "/"  → in-package file
href otherwise        → workspace package reference (skills/ or scripts/)
```

## 4. Build pipeline (normative steps)

For each skill source package:

1. **Read entry** — `SKILL.md` via `exports["."]`; parse YAML frontmatter + body.
2. **Validate name** — frontmatter `name` MUST match parent directory name.
3. **Expand includes** — `@include` recursive merge.
4. **Collect links** — scan body for markdown links.
5. **Resolve file links** — copy files; rewrite hrefs.
6. **Resolve package links** — bundle scripts; inject skill dependency notes.
7. **Write dist** — `skills-dist/<name>/SKILL.md` + copied/bundled assets.

No validation step on dist output in the build itself (validation is separate `pnpm validate` on source packages).

## 5. Monorepo integration

Root `package.json`:

```json
{
  "scripts": {
    "build": "pnpm --filter @skills-house/build build && … && pnpm --filter \"./skills/*\" build"
  }
}
```

Each `skills/<name>/package.json` SHOULD define:

```json
{
  "scripts": {
    "build": "skills-house-build ."
  }
}
```

## 6. GitHub-backed execution

Build output MUST make script entry points **discoverable** in dist `SKILL.md` (paths and labels) so agents on runtimes without local shell execution can still trigger repo-connected workflows. Detail in [framework-vision.md](../architecture/framework-vision.md).

## 7. Non-goals

- Transforming or linting script source code by language
- Publishing dist to npm
- Per-agent dist variants
- Resolving transitive skill dependencies into a single bundle

## 8. Implementation notes (non-normative)

Current implementation: `internal-scripts/build/`. Planned relocation of product skill + helper scripts to `packages/skills` / `packages/scripts` per RFC 0006 does not change CLI behavior.

## 9. Compliance checklist

- [ ] Reads `SKILL.md` through `package.json` exports
- [ ] Rejects include cycles
- [ ] Dist tree matches Agent Skills layout
- [ ] Skill dependency notes use dynamic repo slug
- [ ] Does not require TypeScript in bundled skill scripts
