# Publishing skills-house packages

**Primary consumer install:** [skills.sh](https://www.skills.sh/docs/cli) — no publish step:

```bash
npx skills add al4f/skills-house --skill skill-auditor
```

**Secondary channel:** built dist packages on npm. Tag-driven via GitHub Actions — do not run `npm publish` locally.

**Setup:** [NPM-SETUP.md](./NPM-SETUP.md) — `@skills-house` org + `NPM_TOKEN` secret.

## How it works

1. Push a git tag to `main`
2. [publish-npm.yml](../../.github/workflows/publish-npm.yml) runs
3. Workflow builds, packs, publishes with `secrets.NPM_TOKEN`
4. GitHub Release created for the tag

## Release tags (skills)

| Tag | npm package | Example |
|-----|-------------|---------|
| `v<semver>-<skill-dir>` | `@skills-house/skill-<skill-dir>` | `v0.0.1-skill-auditor` |

`<skill-dir>` = folder under `skills/` (e.g. `skill-auditor` → `@skills-house/skill-skill-auditor`).

```bash
git checkout main && git pull
git tag v0.0.2-skill-auditor
git push origin v0.0.2-skill-auditor
```

## Versioning

- Semver from the tag (`v0.2.0-skill-auditor` → `0.2.0`)
- npm rejects duplicate versions — bump the tag
- GitHub Release notes auto-generated

## Announce

1. Update [distribution RFC](https://al4f.dev/writing/skills-house-distribution-rfc.html) if model changes
2. Post from `content/social/x-threads.md`
3. Link from README when live

## Optional: `@skills-house/cli` on npm

Not required for consumers (they use skills.sh). Only publish if you want a standalone `npx @skills-house/cli` for monorepo-style installs from npm dist:

```bash
git tag v0.0.1-cli && git push origin v0.0.1-cli
```
