# Thread 1 — Ready to post

Copy each block as a separate tweet. Attach `docs/assets/diagram-pipeline.svg` on tweet 3.

---

**1/4**

Agent Skills are powerful — until you maintain more than one.

Duplicated scripts. Bloated SKILL.md files. Manual copying into ~/.cursor/skills, .agents/skills, ~/.claude/skills.

The spec defines what agents load. It doesn't solve authoring at scale.

---

**2/4**

I split authoring from distribution:

• Source (skills/) — freeform, modular
• Build (@skills-house/build) — compile to spec-compliant dist
• Dist (skills-dist/) — what agents consume
• Install — one command, multiple agents

skills-house is a framework for skill authors — not a skill catalog.

---

**3/4**

[Attach diagram-pipeline.svg]

Authors optimize for readability.
Agents need a fixed contract.

A build step lets both win.

---

**4/4**

Full architecture write-up:
https://al4f.dev/writing/agent-skills-at-scale.html

Open source:
https://github.com/al4f/skills-house

Building in public. More threads coming.

More at al4f.dev
