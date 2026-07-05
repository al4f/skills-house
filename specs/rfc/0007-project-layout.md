# RFC 0007: Project Layout and `.house`

**Status:** Accepted  
**Date:** 2026-07-05  
**Depends on:** [RFC 0001](./0001-framework-foundation.md), [RFC 0005](./0005-create.md)  
**Related:** [monorepo-overview.md](../architecture/monorepo-overview.md)

## Summary

Defines where skills-house lives in a repository and the **`.house/` isolation layout** for coexistence with existing JavaScript projects.

## 1. Default layout (greenfield)

For new projects created by `@skills-house/create`, skills-house occupies the **repository root** workspace:

```
repo-root/
├── skills/
├── scripts/
├── skills-dist/          # generated
├── package.json
├── pnpm-workspace.yaml
└── AGENTS.md
```

Agent skill install targets use **repository root** as `<root>` for `--scope project` (RFC 0004).

## 2. Problem: existing JavaScript projects

Many teams cannot give skills-house the repository root:

- Existing `package.json` / npm / pnpm / yarn workspaces
- Conflicting `build`, `test`, `lint` script names
- Corporate monorepo policies forbidding new root workspaces

RFC 0005 documents this as **accepted v0.x limitation** for `create` at monorepo root.

## 3. `.house/` isolation layout (normative target)

For coexistence, the framework MAY nest entirely under **`.house/`**:

```
repo-root/                    # existing app unchanged
├── package.json              # existing app
├── src/
└── .house/                   # skills-house enclave
    ├── package.json          # skills-house workspace root
    ├── pnpm-workspace.yaml
    ├── skills/
    ├── scripts/
    ├── skills-dist/
    └── AGENTS.md             # or merge pointers into root AGENTS.md
```

### 3.1 Tooling behavior

When `.house/package.json` exists (or env `SKILLS_HOUSE_ROOT=.house`):

| Tool | Root resolution |
|------|-----------------|
| `@skills-house/build` | `.house/` as repo root for skill discovery |
| `@skills-house/install` | `--scope project` uses git repo root for agent paths; dist from `.house/skills-dist/` |
| `@skills-house/create` | `--layout house` scaffolds into `.house/` instead of target root |

**Agent paths unchanged:** Skills still install to `<git-root>/.agents/skills/`, etc. — agents read the whole repo, not only `.house/`.

### 3.2 Root agent context

Projects SHOULD add a short pointer in root `AGENTS.md` (or Cursor rules):

```markdown
Skills-house workspace: `.house/`. Run build/install from that directory.
See `.house/AGENTS.md` for skill authoring rules.
```

## 4. Implementation phases

| Phase | Scope |
|-------|-------|
| **v0.x (current)** | Root layout only; document conflict risk; `.house/` specified but optional |
| **v1.x** | `@skills-house/create --layout house`; build/install root detection |
| **v1.x LTS** | `.house/` snapshot in LTS RFC index |

Until v1 implements §3, `.house/` is **spec-ready, code-pending**.

## 5. `.gitignore` recommendations

| Path | Ignore |
|------|--------|
| `skills-dist/` | Yes |
| `.house/skills-dist/` | Yes |
| `node_modules/` | Yes |
| `.agents/skills/` (optional) | Team choice — often committed for project scope |

## 6. Non-goals

- Automatic splitting of existing monorepos into `.house/`
- Multiple `.house/` instances per repo
- Moving agent skill directories inside `.house/` (agents expect standard paths at git root)

## 7. Compliance checklist (v1+)

- [ ] `SKILLS_HOUSE_ROOT` or auto-detect `.house/`
- [ ] Build discovers `skills/*` under enclave root
- [ ] Install `--from` defaults to enclave `skills-dist/`
- [ ] Create supports `--layout house`
