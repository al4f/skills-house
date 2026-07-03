# Brand Plan Progress

Last updated after nested `@include` support (post PR #6).

## Done (in repo)

| Item | Status |
|------|--------|
| Visual companion rebrand | Done (brainstorming removed) |
| README authority layer + framework positioning | Done |
| Architecture SVG diagrams | Done |
| al4f.dev static site | Done |
| GitHub Pages deploy workflow | Done |
| Website paths fix (github.io/skills-house) | Done |
| al4f.dev custom domain (DNS) | Done |
| Flagship + supporting articles | Done |
| X thread series (draft) | `content/social/x-threads.md` |
| LinkedIn posts (draft) | `content/linkedin/posts.md` |
| Ready-to-post copies | `content/publish/thread-1-ready.md`, `linkedin-1-ready.md` |
| CI + CONTRIBUTING + issue templates | Done |
| skill-auditor example skill | Done |
| Spec v2 article + ecosystem notes | Done |
| Distribution RFC | Done |
| Demo video script | `content/demo-video/SCRIPT.md` |
| CLI scaffold (`pnpm skills add`) | Done |
| npm pack script | `scripts/pack-skill.mjs` |
| Context handoff doc | `content/publish/CONTEXT-HANDOFF.md` |

## Live URLs

| URL | Purpose |
|-----|---------|
| https://al4f.dev | **Canonical** — authority hub |
| https://al4f.github.io/skills-house/ | GitHub Pages mirror (same site) |

## Your manual checklist

- [x] **DNS** — `al4f.dev` → GitHub Pages (Cloudflare CNAME flattening)
- [ ] **GitHub profile** — `content/github-profile/SETUP.md`
- [ ] **Publish thread 1** — `content/publish/thread-1-ready.md`
- [ ] **Publish LinkedIn post 1** — `content/publish/linkedin-1-ready.md`
- [ ] **Record demo** — `content/demo-video/SCRIPT.md`
- [ ] **Ecosystem posts** — `content/ecosystem/ENGAGEMENT.md`
- [ ] **npm publish** — `content/publish/PUBLISHING.md` (`pnpm pack:cli` / `pnpm pack:skill`)

## Next code milestones (roadmap)

- [ ] Publish `@skills-house/cli` to npm
- [ ] Publish `@skills-house/skill-skill-auditor` to npm
- [x] Nested `@include` support
