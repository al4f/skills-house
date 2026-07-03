# Publishing skills-house packages

Publishing is **tag-driven via GitHub Actions**. Do not run `npm publish` locally.

**First time?** Complete [NPM-SETUP.md](./NPM-SETUP.md) — create the `@skills-house` org and add `NPM_TOKEN` to GitHub Secrets.

## How it works

1. You push a git tag to `main`
2. [publish-npm.yml](../../.github/workflows/publish-npm.yml) runs on GitHub
3. Workflow builds, packs, publishes to npm using `secrets.NPM_TOKEN`
4. A GitHub Release is created for the tag

## Release tags

| Tag format | npm package | Example |
|------------|-------------|---------|
| `v<semver>-cli` | `@skills-house/cli` | `v0.0.1-cli` |
| `v<semver>-<skill-dir>` | `@skills-house/skill-<skill-dir>` | `v0.0.1-skill-auditor` |

`<skill-dir>` is the folder name under `skills/` (e.g. `skill-auditor`).

## Publish the CLI

```bash
git checkout main && git pull

# Optional: bump default version in internal-scripts/cli/package.json before tagging
# (CI also sets version from the tag at publish time)

git tag v0.0.1-cli
git push origin v0.0.1-cli
```

After the workflow succeeds:

```bash
npx @skills-house/cli add skill-auditor --dry-run
```

## Publish a skill

```bash
git tag v0.0.1-skill-auditor
git push origin v0.0.1-skill-auditor
```

Package name: `@skills-house/skill-skill-auditor`

Repeat with a new tag per skill and semver.

## Versioning

- Semver comes from the **tag** (`v0.2.0-cli` → `0.2.0`)
- npm rejects re-publishing the same version — bump the tag
- GitHub Release notes are auto-generated per tag

## Announce

Per the distribution RFC — publish with an article, not a bare registry drop:

1. Update [distribution RFC](https://al4f.dev/writing/skills-house-distribution-rfc.html) status
2. Post X thread 6 from `content/social/x-threads.md`
3. Link from README once packages are live
