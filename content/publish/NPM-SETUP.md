# npm setup for @skills-house

One-time setup. Publishing runs in **GitHub Actions** when you push a release tag — not from your laptop.

## 1. Create the npm org

1. Sign in at [npmjs.com](https://www.npmjs.com/)
2. **Organizations** → **Create Organization**
3. Name: `skills-house` (publishes as `@skills-house/*`)
4. Free plan is enough

If the name is taken, pick an alternative and update package names in `internal-scripts/cli/package.json` and `scripts/pack-skill.mjs` before the first release.

## 2. Create an automation token

Use an **Automation** token (required for CI — bypasses 2FA on publish):

1. npm → **Access Tokens** → **Generate New Token**
2. Type: **Granular Access Token** (recommended) or **Classic** → **Automation**
3. For granular: enable **Bypass 2FA** and grant read + write on `@skills-house/*`
4. Copy the token — shown once

Do **not** use a "Publish" classic token — CI will fail with `403 Forbidden ... bypass 2fa enabled is required`.

## 3. Add the token to GitHub

1. Open [skills-house → Settings → Secrets and variables → Actions](https://github.com/al4f/skills-house/settings/secrets/actions)
2. **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste the npm automation token

No local `npm login` is required for publishing.

## 4. Verify pack output locally (optional)

```bash
nvm use
pnpm build
pnpm pack:cli
pnpm pack:skill skill-auditor

cd packages/publish/cli && npm pack --dry-run
cd ../skill-skill-auditor && npm pack --dry-run
```

The CLI package must include:

- `dist/cli.js`
- `install/install-skills.sh`
- `install/lib/agent-targets.sh`

## 5. Release with git tags

Push a tag to `main`. GitHub Actions (`.github/workflows/publish-npm.yml`) builds, packs, publishes to npm, and creates a GitHub Release.

| Tag | Publishes |
|-----|-----------|
| `v0.0.1-cli` | `@skills-house/cli@0.0.1` |
| `v0.0.1-skill-auditor` | `@skills-house/skill-skill-auditor@0.0.1` |

```bash
# After merging release prep to main:
git checkout main && git pull

# CLI
git tag v0.0.1-cli
git push origin v0.0.1-cli

# Skill (after CLI or independently)
git tag v0.0.1-skill-auditor
git push origin v0.0.1-skill-auditor
```

Watch the run: [Actions → Publish npm](https://github.com/al4f/skills-house/actions/workflows/publish-npm.yml)

## 6. Smoke test

**Install in any repo with `skills.sh`** (no CLI npm package needed):

```bash
cd /path/to/your-repo
curl -fsSL https://raw.githubusercontent.com/al4f/skills-house/main/skills.sh | bash -s -- add skill-auditor --scope project --dry-run
```

See [INSTALL.md](./INSTALL.md) for full usage.

## Troubleshooting

| Error | Fix |
|-------|-----|
| Workflow skipped / no publish | Tag must match `v<semver>-cli` or `v<semver>-<skill-name>` |
| `NPM_TOKEN` missing | Add repository secret (step 3) |
| `403 Forbidden` ... `bypass 2fa` | Regenerate token as **Automation** (not Publish); update `NPM_TOKEN` secret |
| `403 Forbidden` (other) | Token needs publish access to `@skills-house` scope |
| `402 Payment Required` | Confirm org exists; workflow uses `--access public` |
| Version already published | Bump semver in the tag (npm rejects duplicate versions) |

## Optional: scoped registry defaults

Copy `.npmrc.example` if you use a registry mirror. Public publish uses registry.npmjs.org.
