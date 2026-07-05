# RFC 0005: `@skills-house/create`

**Status:** Accepted  
**Date:** 2026-07-05  
**Depends on:** [RFC 0001](./0001-framework-foundation.md), [RFC 0007](./0007-project-layout.md)  
**Related:** [framework-vision.md](../architecture/framework-vision.md)

## Summary

Normative behavior for the project scaffold: bootstrap a skills-house ecosystem on a target repository with minimal embedded logic.

## 1. Purpose

`@skills-house/create` is a **boilerplate generator** that:

1. Creates (or fills) a project directory with skills-house workspace layout.
2. Adds starter skill, scripts workspace, build/install wiring, and agent context files.
3. Delegates heavy tooling to **npm-installed** `@skills-house/*` packages — the create package itself stays lightweight.

Design goal: **minimum internal implementation**; prefer `pnpm add @skills-house/build …` over vendoring compiler source into the template.

## 2. CLI interface

```bash
npx @skills-house/create <project-directory> [options]

Options:
  --skill <name>     Starter skill directory name (default: derived from project name)
  --no-install       Skip pnpm install after scaffolding
  --help
```

### Examples

```bash
npx @skills-house/create my-app
npx @skills-house/create my-app --skill onboarding
npx @skills-house/create .    # bootstrap current directory (existing git repo)
```

## 3. Generated project structure

Scaffold MUST include at minimum:

```
<project>/
├── package.json              # workspace root; repository URL placeholder or git-detected
├── pnpm-workspace.yaml       # skills/*, scripts/*
├── .nvmrc                    # Node LTS pin
├── AGENTS.md                 # always-on agent context; references framework skill
├── skills/
│   └── <starter-skill>/
│       ├── package.json
│       └── SKILL.md
├── scripts/                  # empty or example script package
├── skills-dist/              # gitignored; build output
└── (optional) .gitignore entries for dist and agent dirs
```

Template MUST wire scripts:

```json
{
  "scripts": {
    "build": "… @skills-house/build …",
    "validate": "…",
    "install:skills": "… @skills-house/install …"
  },
  "devDependencies": {
    "@skills-house/build": "<semver from registry>",
    "@skills-house/install": "<semver from registry>"
  }
}
```

Versions are injected at pack/publish time from the create package release — **not** hardcoded to monorepo paths.

## 4. Template source

| Environment | Template source |
|-------------|-----------------|
| `@skills-house/create` npm package | Bundled `templates/default/` |
| Monorepo dev | Same template under `internal-scripts/create/templates/default/` |

Create MUST NOT depend on cloning the skills-house monorepo at scaffold time.

## 5. Framework skill bootstrap

Scaffolded `AGENTS.md` MUST instruct authors to install the framework skill:

```bash
npx skills add <owner>/<repo> --skill skill-auditor -a cursor -y
```

Use `YOUR_ORG/<project>` placeholder until `repository` in `package.json` is set (see [hardcoded-exceptions.md](../conventions/hardcoded-exceptions.md)).

## 6. Fresh project requirement (known constraint)

**Accepted limitation (v0.x):** Scaffolding into an **existing JavaScript/TypeScript monorepo** with its own `package.json`, workspaces, and tooling causes **high conflict risk** (duplicate roots, script name collisions, workspace overlap).

### Normative guidance

| Scenario | Recommendation |
|----------|----------------|
| Greenfield agentic project | `npx @skills-house/create my-app` — **supported** |
| Existing repo, empty subdirectory | Supported if subdirectory is isolated |
| Existing JS monorepo root | **Discouraged** — use RFC 0007 `.house/` layout (planned) or dedicated repo |

Create SHOULD detect conflicting root markers (`package.json` with foreign workspace, existing `pnpm-workspace.yaml` overlap) and warn or fail with actionable message.

This constraint is **technical debt** tracked for post‑v1 `.house` isolation (RFC 0007).

## 7. Post-scaffold steps

Default flow (unless `--no-install`):

1. `pnpm install` in target directory.
2. Print next steps: `pnpm build`, framework skill install, `pnpm install:skills`.

Create does **not** run build or install automatically (author explicit control).

## 8. `--no-install` mode

For air-gapped or custom package managers: emit files only; user runs install manually.

## 9. Product skill

Agents discover create capabilities via the **`create` product skill** (RFC 0006).

## 10. Non-goals

- Migrating existing non-skills-house repos automatically
- Interactive wizard (may be added later; not required for compliance)
- Vendoring full build pipeline source into template
- Choosing package manager other than pnpm in v0.x scaffold (pnpm is default)

## 11. Compliance checklist

- [ ] Template installs `@skills-house/*` from npm registry
- [ ] No hardcoded `al4f/skills-house` in generated tooling output
- [ ] Starter skill validates against RFC 0002
- [ ] Warns on high-conflict existing project roots
