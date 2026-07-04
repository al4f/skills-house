# @skills-house/create

Scaffold a new skills-house project:

```bash
npx @skills-house/create my-app
cd my-app && pnpm dev
```

**Until published to npm**, scaffold from a clone of this repo:

```bash
git clone https://github.com/al4f/skills-house.git
cd skills-house && nvm use && pnpm install && pnpm build
node internal-scripts/create/dist/cli.js my-app
```

## Publish to npm

Tag format: `v<semver>-create` (e.g. `v0.1.1-create`). GitHub Actions packs and publishes via `.github/workflows/publish-npm.yml`.

```bash
git tag v0.1.1-create
git push origin v0.1.1-create
```

## Monorepo development

```bash
pnpm --filter @skills-house/create build
pnpm --filter @skills-house/create test
```

After changing `@skills-house/build` or `@skills-house/cli`, refresh vendored template files:

```bash
pnpm --filter @skills-house/build build
pnpm --filter @skills-house/cli build
node scripts/sync-create-template.mjs
```

Pack for npm publish:

```bash
pnpm build
node scripts/pack-create.mjs
```
