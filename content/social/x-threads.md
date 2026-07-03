# Building Skills House — X Thread Series

Publish one thread per week. Each ends with: `More at al4f.dev` + GitHub link. No "please star" begging.

---

## Thread 1: Why Agent Skills need a build pipeline

**Tweet 1 (hook)**
Agent Skills are powerful — until you maintain more than one.

Duplicated scripts. Bloated SKILL.md files. Manual copying into ~/.cursor/skills, .agents/skills, ~/.claude/skills.

The spec defines what agents load. It doesn't solve authoring at scale.

**Tweet 2**
I split authoring from distribution:

• Source (skills/) — freeform, modular
• Build (@skills-house/build) — compile markers + links
• Dist (skills-dist/) — spec-compliant output
• Install — one command, all agents

**Tweet 3**
[Attach diagram-pipeline.svg]

Authors optimize for readability.
Agents need a fixed contract.

A build step lets both win.

**Tweet 4**
Wrote the full architecture breakdown:

→ al4f.dev/writing/agent-skills-at-scale.html
→ github.com/al4f/skills-house

Building in public. More threads coming on @include, shared scripts, and multi-agent install.

---

## Thread 2: One marker philosophy — @include only

**Tweet 1**
skills-house uses exactly ONE build marker: @include

Everything else is a standard markdown link.

No @ref. No magic syntax per package type. One rule for all references.

**Tweet 2**
@include /sections/workflow.md  → merge markdown into body

[guide](/references/deep-dive.md)  → copy file to dist

[run](fixture-helper/hello)  → bundle from scripts/ workspace

**Tweet 3**
Link resolution rule:

href starts with /  → in-package file
href has no /       → workspace package export

That's it. Parser stays simple. Authors stay productive.

**Tweet 4**
Full marker spec in the repo:
github.com/al4f/skills-house/blob/main/specs/markers/marker-spec.md

More at al4f.dev

---

## Thread 3: Sharing scripts across skills without copy-paste

**Tweet 1**
Every skill repo eventually copy-pastes the same shell script into 3 directories.

skills-house fixes this with scripts/ workspace packages.

**Tweet 2**
scripts/fixture-helper/package.json:

exports: {
  "./hello": "./scripts/hello.sh"
}

Skills reference: [Run](fixture-helper/hello)

Build bundles into each skill's dist/scripts/.

**Tweet 3**
One script package. Many skills. No duplication.

The build resolves exports at compile time — agents still get self-contained dist.

**Tweet 4**
Pattern works for any shared tooling: validators, scaffolds, server helpers.

skills-house repo: github.com/al4f/skills-house
al4f.dev

---

## Thread 4: Installing one skill into Cursor, Claude, and Codex

**Tweet 1**
Built a skill once. Now install it everywhere:

pnpm build
pnpm install:skills

One dist output → Cursor, Claude, Codex, open-standard .agents/skills

**Tweet 2**
Global:
~/.cursor/skills/
~/.claude/skills/
~/.agents/skills/

Project:
.cursor/skills/
.claude/skills/
.agents/skills/

**Tweet 3**
Flags:
--agent cursor
--scope project
--skill skill-auditor
--copy (instead of symlink)

**Tweet 4**
Multi-agent install shouldn't require per-agent authoring forks.

Full docs: github.com/al4f/skills-house
al4f.dev

---

## Thread 5: Dogfooding — skill-auditor as framework example

**Tweet 1**
skills-house is a framework, not a skill catalog.

The included skill-auditor example shows how to validate skills before publish — frontmatter, links, layout.

**Tweet 2**
The example uses @include for modular sections:
• audit checklist
• manual review points
• references/ for on-demand docs

SKILL.md stays short. Context stays small.

**Tweet 3**
Shared validate.sh lives in scripts/skill-auditor-tools/ — referenced by link, bundled at build time.

That's the framework pattern: write once, build, install your own skills.

**Tweet 4**
Try the framework:
github.com/al4f/skills-house

Example skill: skills/skill-auditor/
al4f.dev

---

## Thread 6: What I'm building next in skills-house

**Tweet 1**
skills-house roadmap (honest):

✅ Monorepo + build pipeline
✅ Multi-agent install
✅ CI on PRs
✅ skill-auditor (framework example)

Next: distribution RFC → npx skills add

**Tweet 2**
Not rushing npm publish.

Sequence:
1. Authority content (al4f.dev articles)
2. OSS hygiene (CI, CONTRIBUTING)
3. Framework example (skill-auditor)
4. Then CLI + per-skill packages

**Tweet 3**
RFC live:
al4f.dev/writing/skills-house-distribution-rfc.html

Feedback welcome on GitHub issues.

**Tweet 4**
Building Agent Skills infrastructure in public.

Follow: github.com/al4f
Read: al4f.dev
