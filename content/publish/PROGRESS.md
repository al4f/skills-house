# Brand Plan Progress

Last updated: Jul 2026 — post skills.sh distribution adoption.

## Shipped (in repo)

| Area | Status |
|------|--------|
| Framework positioning (not a catalog) | Done |
| `@skills-house/build` — `@include`, links, nested includes | Done |
| Example skill `skill-auditor` | Done |
| CI + tests + pack scripts | Done |
| al4f.dev site + GitHub Pages + custom domain | Done |
| Distribution spec — skills.sh primary, npm secondary | `specs/architecture/distribution.md` |
| npm publish workflow (tag → GitHub Actions) | `.github/workflows/publish-npm.yml` |
| `@skills-house/skill-skill-auditor@0.0.1` on npm | Published |
| Consumer install via skills.sh | `npx skills add al4f/skills-house --skill skill-auditor` |

## Live

| URL | Purpose |
|-----|---------|
| https://al4f.dev | Authority hub |
| https://github.com/al4f/skills-house | Source + skills.sh install target |
| https://www.npmjs.com/package/@skills-house/skill-skill-auditor | npm dist channel |

---

## Manual checklist (remaining)

### Distribution & visibility

- [ ] Verify install in a real project (`snappfood-vendor` or similar):

  ```bash
  npx skills add al4f/skills-house --skill skill-auditor -a cursor -y
  ```

- [ ] Add [skills.sh badge](https://www.skills.sh/docs/cli) to README when listing is stable

### Brand & content

- [ ] **GitHub profile** — `content/github-profile/SETUP.md`
- [ ] **Publish X thread 1** — `content/publish/thread-1-ready.md`
- [ ] **Publish LinkedIn post 1** — `content/publish/linkedin-1-ready.md`
- [ ] **Record demo** — `content/demo-video/SCRIPT.md`
- [ ] **Ecosystem posts** — `content/ecosystem/ENGAGEMENT.md`
- [ ] Update distribution RFC article status to **Adopted** on al4f.dev

---

## Optional / low priority

| Item | Notes |
|------|-------|
| Publish `@skills-house/cli` to npm | Not needed — consumers use official `npx skills` from skills.sh |
| Second example skill | Only if it teaches a new framework pattern |
| Turborepo / build caching | When skill count justifies it |
| Version pinning in skill dependency graphs | Non-goal per distribution spec |

---

## Guides

| Task | Doc |
|------|-----|
| Install in any repo | `content/publish/INSTALL.md` |
| npm org + tags | `content/publish/NPM-SETUP.md`, `PUBLISHING.md` |
| Architecture | `specs/architecture/` |
| Continue in new chat | `content/publish/CONTEXT-HANDOFF.md` |
