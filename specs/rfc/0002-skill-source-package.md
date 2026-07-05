# RFC 0002: Skill Source Package Model

**Status:** Accepted  
**Date:** 2026-07-05  
**Depends on:** [RFC 0001](./0001-framework-foundation.md)  
**Related:** [skill-md-authoring.md](../authoring/skill-md-authoring.md), [skill-frontmatter.md](../schema/skill-frontmatter.md)

## Summary

Defines what a **skill source package** is in a skills-house repository — the unit `@skills-house/build` consumes.

## 1. Definition

A skill source package is a **JavaScript package** (pnpm/npm workspace member) that:

1. Lives at `skills/<skill-name>/` (short directory name = skill name).
2. Contains **`SKILL.md`** as the builder entry point.
3. Declares **`package.json`** with at least `name` and **`exports`** pointing to `SKILL.md`.

### Minimal `package.json`

```json
{
  "name": "@skills-house/skill-my-skill",
  "private": true,
  "exports": {
    ".": "./SKILL.md"
  }
}
```

The `"."` export is the **canonical root** the builder reads. Additional exports MAY expose named entry files for cross-package linking (see authoring spec).

### What it is not

- Dist output (Agent Skills folder tree) — that is build output in `skills-dist/`.
- An npm-published skill package — skills distribute via skills.sh Git source, not npm.

## 2. Dependencies

A skill package MAY declare dependencies in `package.json`:

| Dependency kind | Allowed | Referenced in `SKILL.md` |
|-----------------|---------|--------------------------|
| Other skill packages (`skills/`) | Yes | Yes — skill link form |
| Script packages (`scripts/`) | Yes | Yes — namespace export form |
| Monorepo workspace packages | Yes | Yes — if direct dependency |
| Third-party npm packages | Yes | Yes — if direct dependency |
| Transitive-only packages | Yes in `package.json` | **No** — see §4 |

Dependencies exist for:

- Build-time link resolution (bundle scripts, record skill deps).
- Optional runtime use by bundled scripts (not enforced by build).

The builder does **not** run `npm install` inside skill folders; workspace hoisting supplies packages.

## 3. Freeform layout

Inside `skills/<name>/`, authors MAY use any folder structure. Only conventions:

- **`SKILL.md`** required at package root.
- In-package paths in links and `@include` are **root-absolute** (`/references/guide.md`), not relative (`./references/...`).

Optional conventional folders (not required in source):

```
skills/my-skill/
├── package.json
├── SKILL.md              # required — builder entry (exports["."])
├── sections/             # optional — merge via @include
├── references/           # optional — linked files
├── assets/               # optional — linked files
└── scripts/              # optional — in-package scripts (any language)
```

## 4. Dependency mention rule (authoring)

In `SKILL.md` and included markdown fragments, authors MAY mention **only direct dependencies** of the skill package:

- Direct skill dependency → `[label](other-skill)` link form.
- Direct script package → `[label](script-pkg/export)` link form.
- Direct third-party or monorepo package → document by name/version if needed for the agent.

**MUST NOT** mention transitive dependencies as if the skill depends on them (e.g. a library used only inside `scripts/fixture-helper` must not appear in `SKILL.md` unless `fixture-helper` is a direct dependency and the link targets that package).

Rationale: keeps agent context accurate and matches `package.json` dependency graph.

Validation: skill packages SHOULD enforce this in `validate` scripts; `@skills-house/build` MAY warn in future versions.

## 5. Script language

Files under in-package `scripts/` or pulled from `scripts/` workspace packages MAY be **any language**. See RFC 0001 §3.2.

Bundled dist layout places them under Agent Skills `scripts/` regardless of extension.

## 6. Frontmatter

Source `SKILL.md` frontmatter follows [skill-frontmatter.md](../schema/skill-frontmatter.md).

- `name` MUST match directory name `<skill-name>`.
- `metadata.dependencies` MUST NOT be hand-authored; builder injects from skill-package links.

## 7. Relationship to dist

| Source | Dist |
|--------|------|
| `@include` markers | Expanded inline in `SKILL.md` body |
| `/path` markdown links | Copied; hrefs rewritten spec-relative |
| `script-pkg/export` links | Files bundled to `scripts/` |
| `other-skill` links | Replaced with install-suggestion note |
| `package.json` exports | Not copied to dist |

Dist MUST conform to Agent Skills; source MUST NOT.

## 8. Workspace placement

In the reference monorepo:

```yaml
# pnpm-workspace.yaml
packages:
  - "skills/*"
  - "scripts/*"
  - "internal-scripts/*"
```

Scaffolded projects replicate `skills/*` and `scripts/*` (RFC 0005).
