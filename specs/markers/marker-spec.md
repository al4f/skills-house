# SKILL.md Authoring Spec

**Date:** 2026-07-03  
**Status:** Adopted

Source `SKILL.md` (after YAML frontmatter) uses one build marker and standard markdown links. The parser and builder handle everything else.

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
> `npx skills add owner/repo --skill other-skill -a cursor -y`
```

Use the real GitHub slug for the current repo (e.g. `al4f/skills-house`), not the skill name alone.

---

### Form 4: Cross-repo skill dependency

**Status:** Proposed — see [cross-repo plan](../plans/2026-07-04-cross-repo-dependencies-plan.md).

For Option C (framework in author repos): depend on a skill published in **another** repository.

```markdown
Uses [lint-helper](alice/skills/lint-helper) as a dependency.
```

**Href shape:** `{github-owner}/{github-repo}/{skill-dir}` — exactly two slashes, three segments.

**Behavior (build-time only):**

1. Record structured dependency in dist metadata (`repository` + `skill`).
2. Replace link with agent-facing install note using skills.sh.
3. No file copy; no fetch from remote repo.

**Example (dist):**

```markdown
> **Depends on:** `lint-helper` from `alice/skills`
> If this skill is not available in the workspace, suggest the user install it:
> `npx skills add alice/skills --skill lint-helper -a cursor -y`
```

Version pinning in install commands is a **non-goal** for v1. Authors may document a tested version in frontmatter metadata (prose only).

---

## Link target disambiguation

One rule for all references. Slash count disambiguates package refs vs cross-repo skill deps.

```
href starts with /              → in-package file path
href has two slashes (3 parts)  → cross-repo skill dependency (Form 4)
href has one slash (2 parts)    → script package named export (Form 2)
href has no slash               → local package default export (Form 2 or 3)
```

**Reference table:**

| href | Meaning |
|------|---------|
| `/references/guide.md` | In-package file |
| `alice/skills/lint-helper` | Cross-repo skill dependency |
| `fixture-helper/hello` | Script package named export |
| `other-skill` | Local skill or script default export |

The builder looks up local package names in `skills/` and `scripts/` workspaces, reads `package.json` `exports`, and applies the appropriate output behavior (bundle files, inject skill-dependency note, etc.). Cross-repo hrefs skip local lookup entirely.

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
| Markdown link | `[label](package-name/export-name)` | Script package named export |
| Markdown link | `[label](owner/repo/skill-name)` | Cross-repo skill dependency |

## Related

- [Cross-repo dependencies plan](../plans/2026-07-04-cross-repo-dependencies-plan.md)
- [Monorepo overview](../architecture/monorepo-overview.md)
- [Agent Skills spec](https://agentskills.io)
