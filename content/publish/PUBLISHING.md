# Publishing skills-house packages

Monorepo packages stay `private: true`. Use the pack scripts to emit npm-ready directories under `packages/publish/` (gitignored).

**First time?** Complete [NPM-SETUP.md](./NPM-SETUP.md) to create the `@skills-house` org and authenticate.

## Prerequisites

- `@skills-house` npm org created and your user has publish access
- `npm login` (verify with `npm whoami`)

## 1. Pack and publish the CLI

```bash
nvm use
pnpm build
pnpm pack:cli
cd packages/publish/cli
npm publish --access public
```

After publish:

```bash
npx @skills-house/cli add skill-auditor --dry-run
npx @skills-house/cli add skill-auditor
```

## 2. Pack and publish a skill package

```bash
pnpm build
pnpm pack:skill skill-auditor
cd packages/publish/skill-skill-auditor
npm publish --access public
```

Package name: `@skills-house/skill-skill-auditor`

Repeat for each skill you want distributable outside the monorepo.

## 3. Versioning

- Bump `version` in `internal-scripts/cli/package.json` (CLI) or in `scripts/pack-skill.mjs` default (skills) before each publish
- Re-run the pack script after bumping
- Tag releases: `git tag v0.1.0-cli && git push origin v0.1.0-cli`

## 4. Announce

Per the distribution RFC — publish with an article, not a bare registry drop:

1. Update [distribution RFC](https://al4f.dev/writing/skills-house-distribution-rfc.html) status
2. Post X thread 6 from `content/social/x-threads.md`
3. Link from README once packages are live
