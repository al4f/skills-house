# SKILL.md Authoring Spec

**Date:** 2026-07-05  
**Status:** Adopted  
**Normative:** [RFC 0002](../rfc/0002-skill-source-package.md), [RFC 0003](../rfc/0003-build.md)

Source `SKILL.md` (after YAML frontmatter) uses one build marker and standard markdown links. The parser and builder handle everything else.

## Dependency mention rule

In `SKILL.md` and any `@include` fragment, mention **only direct dependencies** of the skill package (`package.json` `dependencies` / workspace links):

| Allowed | Not allowed |
|---------|-------------|
| `[dep](other-skill)` when `other-skill` is a direct skill dependency | Transitive skill or npm deps |
| `[run](script-pkg/export)` when `script-pkg` is a direct dependency | Internals of a script package (e.g. a Python lib it uses) |
| Third-party packages the skill directly depends on | Packages only used inside bundled scripts |

Rationale: agent context stays aligned with the package graph. See [RFC 0002 §4](../rfc/0002-skill-source-package.md#4-dependency-mention-rule-authoring).

## Path convention

In-package paths in links and `@include` are **root-absolute from the skill package**:

```
✅ /references/guide.md
✅ /sections/workflow.md
✅ /assets/template.html
❌ ./references/guide.md
❌ ../shared/foo.md
```

## `@include` — the only marker

**Syntax:** `@include /path/to/fragment.md`

**Behavior:** Read the markdown file and merge its content into `SKILL.md` body at build time. Fragments may contain their own `@include` markers; the builder expands them recursively. Circular includes are rejected with an error. The fragment is not copied as a separate dist file (unless also linked elsewhere).

**Applies to:** Markdown only.

**Example (source):**

```markdown
---
name: my-skill
description: What it does and when to use it.
---

# My Skill

@include /sections/checklist.md

## Process
...
```

**Example (dist):** Body contains expanded checklist content inline.

---

## Markdown links — all references

Every non-inline reference uses standard markdown link syntax: `[label](target)`.

The parser reads `target` (href) and the builder resolves it. No `@ref` marker exists.

### Form 1: In-package file

```markdown
See [the guide](/references/guide.md).
[extract script](/scripts/extract.py)
[template](/assets/template.html)
```

**Behavior:**

- Copy file to the appropriate dist subfolder.
- Rewrite href to a spec-relative path (no leading `/`).

**Routing:**

| Source path prefix | Dist destination |
|--------------------|------------------|
| `/references/**` | `references/` |
| `/scripts/**` | `scripts/` |
| `/assets/**` | `assets/` |

**Example (dist):**

```markdown
See [the guide](references/guide.md).
```

---

### Form 2: Script namespace export

```markdown
[Run helper](fixture-helper/hello)
```

**Not a file path.** The href matches a named export from a `scripts/` workspace package (`package.json` `exports`).

**Resolution:**

1. Find workspace package matching `fixture-helper` (short directory name).
2. Read `exports["./hello"]`.
3. Bundle resolved files into dist `scripts/`.

**Script package `package.json`:**

```json
{
  "name": "@skills-house/script-fixture-helper",
  "exports": {
    "./hello": "./scripts/hello.sh"
  }
}
```

Export names are used directly as link targets: `fixture-helper/<export-name>`.

---

### Form 3: Skill package

```markdown
Uses [other-skill](other-skill) as a dependency.
```

**Not a file path.** References another skill in the `skills/` workspace.

**Behavior (build-time only):**

1. Record dependency in dist metadata.
2. Replace link with agent-facing install-suggestion note.
3. No file copy.

**Example (dist):**

```markdown
> **Depends on:** `other-skill`
> If this skill is not available in the workspace, suggest the user install it:
> `npx skills add al4f/skills-house --skill other-skill`
```

---

## Link target disambiguation

One rule for all references. No special cases per package type at parse time.

```
href starts with /     → in-package file path
href has no leading /  → package reference (resolved via package.json exports)
```

**Package references:**

| href | Meaning |
|------|---------|
| `other-skill` | Package default export (`exports["."]` or package main) |
| `fixture-helper/hello` | Package named export (`exports["./hello"]`) |

The builder looks up the short package name in `skills/` and `scripts/` workspaces, reads `package.json` `exports`, and applies the appropriate output behavior (bundle files, inject skill-dependency note, etc.) based on which workspace the package lives in.

**In-package file example:**

| Source link | Resolves to |
|-------------|-------------|
| `[guide](/references/guide.md)` | Copy file from skill package → dist |

**Package reference examples:**

| Source link | Resolves to |
|-------------|-------------|
| `[run](fixture-helper/hello)` | Named export from scripts package |
| `[helper](fixture-helper)` | Default export from scripts package |
| `[dep](other-skill)` | Default export from skills package → dependency note |

---

## Summary

| Mechanism | Syntax | Purpose |
|-----------|--------|---------|
| `@include` | `@include /sections/foo.md` | Merge markdown into body |
| Markdown link | `[label](/references/foo.md)` | In-package file (href starts with `/`) |
| Markdown link | `[label](package-name)` | Package default export |
| Markdown link | `[label](package-name/export-name)` | Package named export |

## Related

- [Skill frontmatter](../schema/skill-frontmatter.md)
- [Monorepo overview](../architecture/monorepo-overview.md)
- [Agent Skills spec](https://agentskills.io)
