# npm setup for @skills-house

One-time setup before your first publish. The repo pack scripts (`pnpm pack:cli`, `pnpm pack:skill`) are ready — this configures the npm registry side.

## 1. Create the scope

1. Sign in at [npmjs.com](https://www.npmjs.com/)
2. Go to **Organizations** → **Create Organization**
3. Name: `skills-house` (publishes as `@skills-house/*`)
4. Choose the free plan unless you need paid features

If the org name is taken, pick an alternative and update package names in `internal-scripts/cli/package.json` and `scripts/pack-skill.mjs` before publishing.

## 2. Authenticate locally

```bash
npm login
npm whoami
```

Confirm your user is a member of the org:

```bash
npm org ls skills-house
```

## 3. Verify pack output (dry run)

```bash
nvm use
pnpm build
pnpm pack:cli
pnpm pack:skill skill-auditor

# Inspect tarballs without publishing
cd packages/publish/cli && npm pack --dry-run
cd ../skill-skill-auditor && npm pack --dry-run
```

The CLI package must include:

- `dist/cli.js`
- `install/install-skills.sh`
- `install/lib/agent-targets.sh`

## 4. Publish

Follow [PUBLISHING.md](./PUBLISHING.md):

```bash
cd packages/publish/cli
npm publish --access public

cd ../skill-skill-auditor
npm publish --access public
```

## 5. Smoke test

```bash
npx @skills-house/cli add skill-auditor --dry-run
```

## 6. Tag the release

```bash
git tag v0.0.1-cli
git tag v0.0.1-skill-auditor
git push origin v0.0.1-cli v0.0.1-skill-auditor
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ENEEDAUTH` | Run `npm login` |
| `402 Payment Required` / scope access | Confirm org membership; use `--access public` |
| `403 Forbidden` | Your user may not have publish rights on `@skills-house` |
| `404 Scope not found` | Create the `skills-house` org first |

## Optional: scoped registry defaults

Copy `.npmrc.example` to your home directory or project if you use a private registry mirror later. Public publish uses the default npm registry.
