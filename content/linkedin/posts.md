# LinkedIn Technical Posts — al4f

Publish one post per week. Educational tone. Link to al4f.dev, not "please star."

---

## Post 1: Agent Skills at Scale

**Hook**

Agent Skills are becoming the reuse layer for coding agents — but most teams hit the same wall after skill #3.

**Body**

Duplicated shell scripts. 400-line SKILL.md files that burn context on every activation. Manual copying into ~/.cursor/skills, .agents/skills, ~/.claude/skills.

The Agent Skills spec defines what agents *load*. It doesn't define how authors *write* at scale.

I built skills-house as a framework for that gap:

→ Source (freeform authoring with @include)
→ Build (compile to spec-compliant dist)
→ Install (one command, multiple agents)

Not a skill catalog — infrastructure for skill authors.

**CTA**

Full architecture write-up: https://al4f.dev/writing/agent-skills-at-scale.html

Open source: https://github.com/al4f/skills-house

#AgentSkills #AIEngineering #OpenSource

---

## Post 2: One Marker Philosophy

**Hook**

The best build pipelines have fewer magic syntaxes, not more.

**Body**

skills-house uses exactly one build marker: @include

Everything else is a standard markdown link.

/include /sections/workflow.md  → merge at build time
[guide](/references/deep-dive.md)  → copy to dist
[run](fixture-helper/hello)  → bundle from shared scripts/

One disambiguation rule:
• /path → in-package file
• package/export → workspace package

That's the whole parser surface. Authors stay productive. Dist stays spec-compliant.

**CTA**

Marker spec: https://github.com/al4f/skills-house/blob/main/specs/markers/marker-spec.md

More writing: https://al4f.dev

#DeveloperExperience #AIAgents #BuildTools

---

## Post 3: Framework vs Catalog

**Hook**

skills-house is intentionally not a skill marketplace.

**Body**

When you discover a repo with 50 agent skills, you wonder: which ones are maintained? which patterns do they use? am I importing someone else's workflow or a tool I can adapt?

skills-house takes the Vite/Bun lane:

→ Build pipeline for Agent Skills
→ Monorepo for your own skills + shared scripts
→ Multi-agent install from one dist output
→ One example skill showing the patterns

You bring your skills. The framework handles compile and ship.

**CTA**

RFC on distribution (npx skills add): https://al4f.dev/writing/skills-house-distribution-rfc.html

GitHub: https://github.com/al4f/skills-house

#OpenSource #AIEngineering #AgentSkills
