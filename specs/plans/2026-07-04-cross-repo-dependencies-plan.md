# Cross-Repo Skill Dependencies — Plan B

**Date:** 2026-07-04  
**Status:** Proposed  
**Part of:** Option C (hybrid framework + platform federation)

Extends [marker-spec.md](../markers/marker-spec.md) so skills in **author repos** can declare dependencies on skills in **other repos**, without copying files or requiring a shared monorepo.

Plan A (registry federation via `sources.json`) is separate; this plan covers **authoring syntax and build output only**.

---

## Problem

Today, Form 3 in the marker spec resolves skill dependencies **inside one repo**:

```markdown
Uses [lint-helper](lint-helper) as a dependency.
```

The builder looks up `skills/lint-helper/` under the current repo root. That works for skills-house dogfooding, but fails for Option C where:

- `alice/skills` publishes `lint-helper`
- `bob/dev-tools` publishes `full-audit` which depends on `lint-helper`

Bob's build must not require Alice's skill source in Bob's `skills/` folder.

---

## Solution — Form 4: Cross-repo skill dependency

### Syntax

```markdown
Uses [lint-helper](alice/skills/lint-helper) as a dependency.
```

**Href shape:** `{github-owner}/{github-repo}/{skill-dir}` — exactly **two slashes**, three path segments.

### Disambiguation (updated rule)

| href pattern | Resolution |
|--------------|------------|
| Starts with `/` | In-package file (unchanged) |
| Contains **two** `/` (three segments) | Cross-repo skill dependency (Form 4) |
| Contains **one** `/` (two segments) | Script package named export (Form 2) |
| No `/` | Local package default export — skill (Form 3) or script (Form 2) |

Examples:

| href | Type |
|------|------|
| `/references/guide.md` | File |
| `fixture-helper/hello` | Script export (1 slash) |
| `other-skill` | Local skill dependency |
| `alice/skills/lint-helper` | Cross-repo skill dependency (2 slashes) |

**Why this works:** GitHub slugs use `owner/repo`; skill directory names do not contain `/`. Script exports use `package/export` (one slash only).

---

## Build behavior

When the builder sees Form 4:

1. **Parse** `owner`, `repo`, `skillDir` from href.
2. **Do not** fetch or copy files from the remote repo at build time.
3. **Record** structured dependency in dist frontmatter metadata:

```yaml
metadata:
  dependencies:
    - skill: lint-helper
      repository: alice/skills
```

4. **Replace** the markdown link with an agent-facing install note:

```markdown
> **Depends on:** `lint-helper` from `alice/skills`
> If this skill is not available in the workspace, suggest the user install it:
> `npx skills add alice/skills --skill lint-helper -a cursor -y`
```

5. **Validate** (registry / author CI): href segments are non-empty; `skillDir` matches `[a-z0-9-]+` convention; optional warning if dependency repo is not in platform `sources.json` (future).

### Non-goals (unchanged from distribution spec)

- Resolving or bundling remote skill files at build time
- Version pinning in install commands (skills.sh tag support TBD)
- Automatic install of transitive dependencies

---

## Version pinning — documented, not enforced (v1)

Authors may record a **tested version** in frontmatter for human/agent context. The builder does **not** change the install command based on this in v1.

```yaml
---
name: full-audit
description: Full audit workflow.
metadata:
  dependencyNotes:
    - skill: lint-helper
      repository: alice/skills
      testedVersion: "1.0.0"
---
```

Dist may append to the install note:

```markdown
> Tested with `lint-helper` v1.0.0 from `alice/skills`.
```

Future v2 (only if skills.sh supports `--version` or tag installs): append version to install command.

---

## Example — two repos

### Repo 1: `alice/skills`

```
skills/
  lint-helper/
    SKILL.md
    package.json
    sections/
      rules.md
```

`SKILL.md` — standalone, no cross-repo deps.

Install: `npx skills add alice/skills --skill lint-helper -a cursor -y`

### Repo 2: `bob/dev-tools`

Source `skills/full-audit/SKILL.md`:

```markdown
---
name: full-audit
description: Run a full audit using shared lint rules.
metadata:
  tags: [audit, lint]
---

# Full Audit

Baseline checks come from a shared skill.

Uses [lint-helper](alice/skills/lint-helper) for baseline lint rules.

## Steps
1. Run lint-helper workflow
2. Apply org-specific audit checklist
```

After `skills-house-build`, dist `SKILL.md` body includes the Depends-on block (see above). Frontmatter lists `alice/skills` + `lint-helper`.

Bob's CI does **not** need Alice's repo cloned.

---

## Registry impact

Extend `SkillEntry.dependencies` from `string[]` to structured entries (backward compatible):

```json
{
  "dependencies": [
    { "skill": "lint-helper", "repository": "alice/skills", "local": false }
  ],
  "relatedSkills": ["lint-helper"]
}
```

Local deps (Form 3) keep `"repository": "bob/dev-tools"` or omit and infer from scanning repo.

Dependency graph (`skillsToSkills`) gains optional repo qualifier for federation UI on al4f.dev.

---

## Implementation phases

### Phase 1 — Spec + classify (paper first)

- [x] This plan
- [ ] Update [marker-spec.md](../markers/marker-spec.md) Form 4 + disambiguation table
- [ ] Add `classifyHref` test cases for two-slash hrefs

### Phase 2 — Builder

- [ ] Extend `classify-href.ts`: `{ type: "cross-repo-skill", owner, repo, skill }`
- [ ] Extend `resolve-package-link.ts` (or new module): Form 4 branch before local `findPackageDir`
- [ ] Fix Form 3 install note: `npx skills add {REPO_SLUG} --skill {pkg}` (repo slug from root `package.json` or env)
- [ ] Fixture skill in `internal-scripts/build/fixtures/` with cross-repo link (no remote fetch)
- [ ] Unit tests

### Phase 3 — Registry

- [ ] Parse Form 4 links in `scan.ts`
- [ ] Structured dependencies in `generated/registry.json`
- [ ] Validate: warn on malformed slugs; optional cross-check against `sources.json` (when Plan A lands)

### Phase 4 — Docs + scaffold

- [ ] `@skills-house/create` template shows cross-repo example
- [ ] PROGRESS.md / CONTRIBUTING cross-link

---

## Open questions

| Question | Proposal |
|----------|----------|
| Default repo slug for Form 3 local deps? | Read from root `package.json` `"repository"` field or `skills-house.repository` key |
| GitLab / non-GitHub hosts? | Defer; href stays `owner/repo/skill` as skills.sh uses GitHub slugs today |
| Skill dir with uppercase? | Reject in validate; enforce kebab-case like local skills |

---

## Related

- [marker-spec.md](../markers/marker-spec.md)
- [distribution.md](../architecture/distribution.md)
- Plan A (future): `sources.json` federation for al4f.dev multi-repo index
