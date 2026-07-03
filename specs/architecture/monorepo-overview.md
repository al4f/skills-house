# Monorepo Overview

**Date:** 2026-07-03  
**Status:** Draft

## Purpose

skills-house is an open-source monorepo for authoring, building, and distributing [Agent Skills](https://agentskills.io). Authors write simple source skills; the build pipeline produces spec-compliant artifacts for tools like Cursor.

**Goals:**

- Dogfood personal skills while remaining publishable for others
- npm distribution (`npx skills …`) with measurable weekly downloads
- Clear separation between source, shared scripts, build tooling, and dist output

## Repository layout

```
skills-house/
├── specs/                          # architecture & design docs
├── skills/                         # source skill packages (freeform layout)
│   └── <skill-name>/
│       ├── package.json
│       └── SKILL.md                # builder entry (required)
├── scripts/                        # shared execution packages
│   └── <script-package>/
│       └── package.json            # exports → named namespaces
├── internal-scripts/
│   └── build/                      # @skills-house/build
├── skills-dist/                    # generated Agent Skills output (committed in v1)
│   └── <skill-name>/
├── pnpm-workspace.yaml
├── package.json
└── .nvmrc
```

## Workspaces

| Workspace | Role | Published to npm |
|-----------|------|------------------|
| `skills/` | Skill authoring. Freeform layout; entry = `SKILL.md`. | Per-skill packages (later) |
| `scripts/` | Reusable execution logic referenced by skills via markdown links. | Optional |
| `internal-scripts/build/` | Marker parser, bundler, dist writer. | `@skills-house/build` |
| `skills-dist/` | Transpiled Agent Skills artifacts. | Consumed by CLI / npm publish |

### `internal-scripts` scope (v1)

Only **build** is in scope for v1. It handles:

- Parsing `@include` and markdown links `[label](target)`
- Resolving script namespace exports from `scripts/` packages
- Bundling scripts (via esbuild or similar bundler)
- Writing spec-compliant output to `skills-dist/`
- Injecting skill-dependency notes for skill-package links

No separate runtime package in v1.

## Source vs dist

### Source (`skills/`)

- Layout is **open and changeable** — authors are not forced into the Agent Skills folder tree.
- **Entry point:** `SKILL.md` (builder starts here).
- Modules are linked via **markdown links** `[label](target)`; in-package paths use **root-absolute** hrefs (e.g. `/references/guide.md`).
- **`@include /path`** is the only build marker — merges markdown fragments into the body.

### Dist (`skills-dist/`)

- Pure build output — **do not validate**.
- Conforms to [Agent Skills directory structure](https://agentskills.io):
  - `SKILL.md` — required; expanded markers, valid frontmatter
  - `scripts/` — executable code
  - `references/` — documentation loaded on demand
  - `assets/` — static resources (templates, images, data files)
- Committed in v1 for inspectability and PR review.

### Optional directories in dist

| Directory | Purpose |
|-----------|---------|
| `references/` | Extra documentation the agent reads when needed (progressive disclosure). |
| `scripts/` | Executable code bundled from in-package paths or `scripts/` workspace namespaces. |
| `assets/` | Non-executable static files: templates, images, schemas, lookup tables. Loaded on demand, not inlined into `SKILL.md`. |

## Build pipeline

Package: `@skills-house/build` in `internal-scripts/build/`.

**Recommended bundler:** esbuild (v1) for JS/TS script namespace graphs. Markdown marker processing lives in the build tool itself.

### Commands (pnpm workspace filters)

```bash
pnpm --filter "./skills/*" build          # all skills
pnpm --filter @skills-house/<skill> build # one skill
```

Each skill package defines its own `build` script. Root delegates via `--filter`.

### Build steps (per skill)

1. **Discover** — locate `skills/<name>/SKILL.md` and `package.json`.
2. **Parse** — find `@include` markers and markdown links `[label](target)` in the body (after frontmatter).
3. **Resolve `@include`** — read markdown fragments, merge into `SKILL.md` body (nested includes: TBD for v1).
4. **Resolve in-package links** — href starts with `/`; copy file to dist; rewrite to spec-relative href.
5. **Resolve package links** — href has no leading `/`:
   - `package` → default export (`exports["."]`)
   - `package/export` → named export (`exports["./export"]`)
   - Lookup short name in `skills/` then `scripts/`; behavior depends on workspace (bundle vs dependency note).
7. **Write output** — emit `skills-dist/<skill-name>/` with valid frontmatter (`name` matches directory).
8. **Done** — no validation of dist output.

## Validation

- **Each package defines its own `validate` script** — format, lint, spec check, tests, etc. The monorepo structure does not prescribe what `validate` contains.
- **`skills-dist/` is never validated** — it is generated/transpiled output from `build`.
- Typical source packages may choose to run formatting, `skills-ref validate`, marker resolution checks, and tests — but that is each package's decision.

```bash
pnpm --filter "./skills/*" validate   # if package defines validate
pnpm --filter "./scripts/*" validate  # if package defines validate
```

## Skill-to-skill references

When the builder encounters a skill link — e.g. `[other-skill](other-skill)`:

1. Record dependency (e.g. in frontmatter `metadata.dependencies`).
2. Replace the marker with an agent-facing note:

   ```markdown
   > **Depends on:** `other-skill`
   > If this skill is not available in the workspace, suggest the user install it:
   > `npx skills add other-skill` *(install command TBD until CLI ships)*
   ```

3. No file copy. The agent uses the note at activation time.

## npm / CLI (deferred)

v1 focus: monorepo structure, build pipeline, specs.

Later:

- `@skills-house/cli` — `npx skills add <name>` installs from npm/dist artifacts.
- Per-skill npm packages for download metrics.
- Install command text in skill-ref notes becomes the real CLI command.

## Related specs

- [Marker spec](../markers/marker-spec.md)
- [Package naming](../conventions/package-naming.md)
