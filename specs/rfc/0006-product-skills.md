# RFC 0006: Product Skills

**Status:** Accepted  
**Date:** 2026-07-05  
**Depends on:** [RFC 0001](./0001-framework-foundation.md)  
**Related:** [framework-vision.md](../architecture/framework-vision.md) — framework skill (`skill-auditor`)

## Summary

Each `@skills-house/*` CLI product MUST ship an **Agent Skill** that documents its full capability surface for reading agents — flags, inputs, examples, and boundaries.

## 1. Rationale

Agents working in a skills-house repo should not need to read npm READMEs or source code to invoke `build`, `install`, or `create` correctly. Product skills are **operational manuals in Agent Skills format**, loaded on demand via progressive disclosure.

This follows RFC 0001 KPI: **adopt Agent Skills**, don't invent parallel documentation systems.

## 2. Required product skills

| Product | Skill name (proposed) | Documents |
|---------|----------------------|-----------|
| `@skills-house/build` | `skills-house-build` | Build commands, skill dir input, dist output, addressing rules summary |
| `@skills-house/install` | `skills-house-install` | Source/target model, all flags, glob/`all`, skills.sh vs dist install |
| `@skills-house/create` | `skills-house-create` | Scaffold usage, `--no-install`, fresh project guidance, `.house` pointer |

The reference monorepo framework skill **`skill-auditor`** remains the **ecosystem manual** (authoring, validate, repo conventions). Product skills are **narrower** — one CLI each.

## 3. Skill content requirements

Each product skill `SKILL.md` MUST include:

1. **When to use** — trigger description in frontmatter (min 20 chars).
2. **Command synopsis** — exact CLI name and subcommands.
3. **Inputs** — required/optional args with tables (source/target vocabulary for install).
4. **Examples** — at least three: minimal, common, advanced (e.g. glob, `--from`, `--scope project`).
5. **Boundaries** — what the tool does **not** do (consumer vs dev channel).
6. **Related RFC** — link to normative RFC (`specs/rfc/000N-….md`).

Product skills MAY `@include` section fragments and link to bundled helper scripts (any language).

## 4. Packaging and location

### Reference monorepo (transition)

| Phase | Location |
|-------|----------|
| **Current** | Product logic in `internal-scripts/`; product skills may live in `skills/` or co-located under `internal-scripts/<product>/` |
| **Target** | Product skills under `skills/skills-house-*`; shared CLI helpers under `scripts/` workspace packages |

Relocating skills/scripts out of `internal-scripts/` into `skills/` and `scripts/` MUST NOT change CLI behavior (RFC 0003–0005).

### Published npm packages

Each `@skills-house/*` package SHOULD expose its product skill path in `package.json`:

```json
{
  "files": ["dist/", "skill/"],
  "skills": {
    "product": "./skill/SKILL.md"
  }
}
```

Exact manifest key may vary; normative requirement is **discoverable skill folder in the npm tarball** for optional install via dist.

## 5. Installation for agents

Authors install product skills the same way as other skills:

```bash
# After build, local dev
pnpm install:skills --skill skills-house-install --scope project

# Consumer (when product skills published in repo)
npx skills add owner/repo --skill skills-house-install
```

Scaffolded projects SHOULD reference product skills from `AGENTS.md` when authors opt in to full CLI guidance.

## 6. Scripts bundled with product skills

Product skills MAY reference scripts in `scripts/` packages (e.g. validation wrappers, example invocations). Those scripts follow **language-agnostic** policy (RFC 0001 §3.2).

## 7. Non-goals

- One mega-skill replacing `skill-auditor`
- Auto-generated SKILL.md from `--help` alone without human-authored triggers and examples
- Product skills as npm consumer install channel

## 8. Compliance checklist

- [ ] Each of build/install/create has a product skill
- [ ] Skill documents full flag surface (including planned flags as "planned")
- [ ] Boundaries section distinguishes skills.sh vs `@skills-house/install`
- [ ] Frontmatter validates against schema
