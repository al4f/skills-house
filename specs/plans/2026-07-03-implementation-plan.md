# Implementation Plan

**Date:** 2026-07-03  
**Status:** Ready  
**Prerequisite:** [Monorepo overview](../architecture/monorepo-overview.md), [Authoring spec](../markers/marker-spec.md)

## Goal

Scaffold the skills-house monorepo and ship a minimal `@skills-house/build` that compiles one real skill from source → `skills-dist/`.

## Principles

1. **Simple first** — smallest working build; defer edge cases.
2. **One reference rule** — no per-type parse logic:
   - `href` starts with `/` → in-package file
   - otherwise → package ref: `package` = default export, `package/export` = named export
3. **YAGNI** — no CLI, no npm publish, no Turborepo until needed.
4. **Validate is per-package** — build tool does not own validate; dist is never validated.

---

## Phase 1 — Monorepo scaffold

**Outcome:** Empty workspace layout; `pnpm install` works.

### Tasks

1. Root `package.json`
   - `"private": true`
   - Scripts: `build`, `validate` delegate via `pnpm --filter`
   - Dev dependency: none yet

2. `pnpm-workspace.yaml`

   ```yaml
   packages:
     - "skills/*"
     - "scripts/*"
     - "internal-scripts/*"
   ```

3. Create empty directories with `.gitkeep` where needed:
   - `skills/`
   - `scripts/`
   - `internal-scripts/build/`
   - `skills-dist/`

4. Root `README.md` — one paragraph + link to `specs/`

**Skip for now:** Prettier, ESLint, CI, Turborepo, changesets.

---

## Phase 2 — Build package skeleton

**Outcome:** `@skills-house/build` CLI exists; runs with `--help`.

### Tasks

1. `internal-scripts/build/package.json`
   - `"name": "@skills-house/build"`
   - `"bin": { "skills-house-build": "./dist/cli.js" }`
   - `"type": "module"`
   - Build self with `tsup` or `esbuild` (pick one, keep it)

2. Minimal CLI (`src/cli.ts`):
   ```
   skills-house-build <skill-dir> [--out skills-dist]
   ```
   - Resolve skill dir → read `SKILL.md`
   - Stub: copy `SKILL.md` to output unchanged (proves pipeline)

3. Root script:
   ```json
   "build": "pnpm --filter \"./skills/*\" build"
   ```

4. Each skill's `package.json` `build` script:
   ```json
   "build": "skills-house-build ."
   ```

**Skip for now:** esbuild bundling, workspace package resolution, frontmatter validation.

---

## Phase 3 — Parser (markers + links)

**Outcome:** Builder expands `@include` and collects all markdown links.

### Tasks

1. **`parse-skill-md.ts`**
   - Split frontmatter / body (simple `---` split; no heavy YAML lib unless needed → `yaml` package is fine)
   - Find `@include /path` lines (regex: `^@include\s+(/[^\s]+)\s*$`)
   - Find markdown links: `\[([^\]]*)\]\(([^)]+)\)` in body
   - Return `{ frontmatter, body, includes: string[], links: { label, href }[] }`

2. **`resolve-includes.ts`**
   - For each include path: read file from skill package root
   - Replace `@include` line with file content (flat only — no nested includes in v1)
   - Error if file missing

3. **Wire into CLI** — write expanded body to dist `SKILL.md`

**Skip for now:** Nested `@include`, link resolution, package refs.

---

## Phase 4 — In-package file links

**Outcome:** `[label](/references/foo.md)` copies file and rewrites href.

### Tasks

1. **`resolve-file-links.ts`**
   - Filter links where `href.startsWith('/')`
   - Map prefix → dist folder (`/references/` → `references/`, etc.)
   - Copy file to `skills-dist/<skill>/<dest>/`
   - Rewrite href: `/references/foo.md` → `references/foo.md`

2. **Edge case policy (keep simple):**
   - Unknown prefix (not references/scripts/assets) → error with clear message
   - Missing file → error, fail build

**Skip for now:** Binary asset special-casing beyond copy.

---

## Phase 5 — Package reference resolution

**Outcome:** `[run](visual-companion/start-server)` bundles script export.

### Unified resolver (`resolve-package-link.ts`)

```
parsePackageHref(href):
  if href includes '/':
    [pkg, exportName] = split on first '/'
  else:
    pkg = href, exportName = '.'   // default export
```

1. **Lookup** — find `scripts/<pkg>/package.json` or `skills/<pkg>/package.json` (scripts first, then skills — or enforce unique short names via convention)

2. **Read export** — `exports["./" + exportName]` or `exports["."]`

3. **Behavior by workspace:**
   | Workspace | Default export | Named export |
   |-----------|----------------|--------------|
   | `scripts/` | Bundle export target(s) → dist `scripts/` | Same |
   | `skills/` | Inject dependency note (no copy) | Same (v1: treat same as default) |

4. **Script bundling (v1 minimal):**
   - Single file export → copy file
   - JS/TS with imports → esbuild bundle to dist `scripts/<basename>`
   - Shell scripts → copy as-is

5. **Rewrite link** in dist to point at bundled path or replace skill link with dependency blockquote

**Skip for now:**
- Transitive dependency tracing across multiple script files (esbuild handles JS)
- Skill named exports (same as default in v1)
- Cross-workspace name collisions (document: unique short names)

---

## Phase 6 — First real skill

**Outcome:** `brainstorming` skill builds end-to-end.

### Tasks

1. Add `scripts/visual-companion/` with `package.json` exports (from existing skill scripts)

2. Add `skills/brainstorming/`:
   - `SKILL.md` with frontmatter, `@include`, file links, script package links
   - `sections/`, `references/` as needed

3. Run `pnpm --filter @skills-house/brainstorming build`

4. Manually inspect `skills-dist/brainstorming/` against [Agent Skills spec](https://agentskills.io)

5. Skill `validate` script (optional, skill defines it):
   - `skills-ref validate .` on source if tool available
   - format check if desired

---

## Phase 7 — Polish (only if Phase 6 exposes gaps)

Pick from actual pain, not speculation:

- [ ] Frontmatter `name` must match dir — enforce in build
- [ ] `pnpm --filter "./skills/*" build` at root
- [ ] Basic build tests (fixture skill in `internal-scripts/build/fixtures/`)
- [ ] Document package short-name uniqueness in conventions spec

**Explicitly deferred:**
- `npx skills` CLI / npm publish
- Turborepo caching
- Nested `@include`
- Runtime skill resolution
- Committed vs gitignored `skills-dist/` policy change

---

## Suggested build order

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
```

Each phase should produce a runnable state. Do not start Phase 5 until Phase 4 works with a fixture skill that only uses file links.

---

## File map (end state)

```
internal-scripts/build/
├── package.json
├── src/
│   ├── cli.ts
│   ├── parse-skill-md.ts
│   ├── resolve-includes.ts
│   ├── resolve-file-links.ts
│   ├── resolve-package-link.ts
│   └── build-skill.ts          # orchestrator
└── fixtures/
    └── minimal-skill/          # Phase 3+ tests

skills/brainstorming/
├── package.json
├── SKILL.md
├── sections/
└── references/

scripts/visual-companion/
├── package.json
└── scripts/
    ├── start-server.sh
    └── server.cjs

skills-dist/brainstorming/      # generated
```

---

## Reference rule (implementation cheat sheet)

```typescript
function classifyHref(href: string) {
  if (href.startsWith('/')) return { type: 'file', path: href };
  const slash = href.indexOf('/');
  if (slash === -1) return { type: 'package', pkg: href, export: '.' };
  return { type: 'package', pkg: href.slice(0, slash), export: './' + href.slice(slash + 1) };
}
```

No other disambiguation logic needed in v1.

---

## Related

- [Monorepo overview](../architecture/monorepo-overview.md)
- [Authoring spec](../markers/marker-spec.md)
- [Package naming](../conventions/package-naming.md)
