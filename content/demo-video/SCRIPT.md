# Demo Video: Author to Install in 5 Minutes

**Target length:** 4–5 minutes  
**Title:** Author an Agent Skill and Install It in 5 Minutes — skills-house  
**Host:** al4f  

## Pre-recording setup

- Clean terminal, dark theme
- skills-house cloned and `pnpm install` done
- Cursor open (optional, for final demo)
- Screen recording at 1920×1080

## Script

### 0:00 — Hook (15s)

**VO:** "Agent Skills give coding agents reusable expertise. But authoring them at scale gets messy. I'll show you how skills-house goes from source to installed skill in five minutes."

**Screen:** al4f.dev homepage → GitHub repo

---

### 0:15 — The problem (30s)

**VO:** "Without a build pipeline, you copy-paste scripts, maintain giant SKILL.md files, and manually install into each agent's skills directory."

**Screen:** README "Why skills-house?" section

---

### 0:45 — Create a minimal skill (60s)

**VO:** "Source layout is freeform. Only SKILL.md is required."

**Screen:** Show `skills/skill-auditor/SKILL.md` structure:

```
---
name: skill-auditor
description: ...
---

# Skill Auditor

@include /sections/checklist.md
```

**VO:** "@include merges sections at build time. Markdown links handle everything else."

---

### 1:45 — Build (45s)

**Screen:**
```bash
nvm use
pnpm --filter @skills-house/build build
node internal-scripts/build/dist/cli.js skills/skill-auditor
```

**VO:** "The build compiles markers, resolves links, bundles shared scripts, and writes spec-compliant dist."

**Screen:** Show `skills-dist/skill-auditor/` tree

---

### 2:30 — Install (45s)

**Screen:**
```bash
pnpm install:skills --scope project --skill skill-auditor
```

**VO:** "One command installs to Cursor, Claude, Codex, or all at once. Global or project scope."

**Screen:** Show `.agents/skills/skill-auditor/`

---

### 3:15 — Verify in agent (60s, optional)

**VO:** "The skill is now available to your agent. The description field tells the router when to load it."

**Screen:** Cursor skills panel or mention skill activation

---

### 4:15 — Close (30s)

**VO:** "skills-house is open source. Clone it, read the specs, adapt the patterns."

**Screen:** End card:
- al4f.dev
- github.com/al4f/skills-house
- "Built by al4f"

---

## Post-production

- Add captions (no autoplay audio dependency)
- Upload to YouTube
- Embed on al4f.dev and README
- Share as 60s clip on X with link to full video

## Assets needed

- [ ] Screen recording
- [ ] End card graphic (use og-card.svg as base)
- [ ] YouTube thumbnail (diagram-pipeline.svg + title)
