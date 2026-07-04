# create-skills-house

Scaffold a new skills-house project:

```bash
npx create-skills-house my-app
cd my-app && pnpm dev
```

## Monorepo development

```bash
pnpm --filter create-skills-house build
pnpm --filter create-skills-house test
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
