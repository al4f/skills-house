# Publishing skills-house packages

Packages stay `private: true` in the monorepo until you publish manually.

## Prerequisites

- npm account with access to `@skills-house` scope (create org on npmjs.com)
- `npm login`

## 1. Publish the CLI

```bash
nvm use
pnpm build
cd internal-scripts/cli
npm publish --access public
```

After publish:

```bash
npx @skills-house/cli add skill-auditor
```

## 2. Publish a skill package

```bash
pnpm build
node scripts/pack-skill.mjs skill-auditor
cd packages/publish/skill-skill-auditor
npm publish --access public
```

Package name: `@skills-house/skill-skill-auditor`

Repeat for each skill you want distributable outside the monorepo.

## 3. Versioning

- Bump `version` in package.json before each publish
- Tag releases: `git tag v0.1.0-cli && git push origin v0.1.0-cli`

## 4. Announce

Per the distribution RFC — publish with an article, not a bare registry drop:

1. Update [distribution RFC](https://al4f.github.io/skills-house/writing/skills-house-distribution-rfc.html) status
2. Post X thread 6 from `content/social/x-threads.md`
3. Link from README once packages are live
