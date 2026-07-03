# Brand Plan Progress

Last updated after npm package configuration (PR #10).

## Done (in repo)

| Item | Status |
|------|--------|
| Visual companion rebrand | Done (brainstorming removed) |
| README authority layer + framework positioning | Done |
| Architecture SVG diagrams | Done |
| al4f.dev static site | Done |
| GitHub Pages deploy workflow | Done |
| Website paths fix (github.io/skills-house) | Done |
| Flagship + supporting articles | Done |
| X thread series (draft) | `content/social/x-threads.md` |
| LinkedIn posts (draft) | `content/linkedin/posts.md` |
| CI + CONTRIBUTING + issue templates | Done |
| skill-auditor example skill | Done |
| Spec v2 article + ecosystem notes | Done |
| Distribution RFC | Done |
| Demo video script | `content/demo-video/SCRIPT.md` |
| CLI scaffold (`pnpm skills add`) | Done |
| npm pack scripts | `pnpm pack:cli` / `pnpm pack:skill` |
| Nested `@include` support | Done (PR #8) |
| npm publish package layout | CLI bundles install scripts; flat skill npm layout supported |
| Tag-driven npm publish workflow | `.github/workflows/publish-npm.yml` + `NPM_TOKEN` secret |

## Live URLs

| URL | Purpose |
|-----|---------|
| https://al4f.github.io/skills-house/ | Site (working) |
| https://al4f.dev | Custom domain |

## Your manual checklist

- [ ] **npm org + `NPM_TOKEN` secret** — `content/publish/NPM-SETUP.md`
- [ ] **Push release tags** — `content/publish/PUBLISHING.md` (`v0.0.1-cli`, `v0.0.1-skill-auditor`)
- [ ] **GitHub profile** — `content/github-profile/SETUP.md`
- [ ] **Publish thread 1** — `content/publish/thread-1-ready.md`
- [ ] **Publish LinkedIn post 1** — `content/publish/linkedin-1-ready.md`
- [ ] **Record demo** — `content/demo-video/SCRIPT.md`
- [ ] **Ecosystem posts** — `content/ecosystem/ENGAGEMENT.md`

## Next code milestones (roadmap)

- [ ] Publish `@skills-house/cli` to npm (blocked on org setup)
- [ ] Publish `@skills-house/skill-skill-auditor` to npm (blocked on org setup)
