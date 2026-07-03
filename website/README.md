# al4f.dev — Static Site

Modern React static site for al4f and Skills House. **Live at https://al4f.dev**

Built with Vite + React and pre-rendered at build time. Deployed automatically via GitHub Pages on push to `main`.

## GitHub Pages setup (one-time)

1. Repo **Settings → Pages → Build and deployment**
   - Source: **GitHub Actions**
2. Repo **Settings → Pages → Custom domain**
   - Enter: `al4f.dev`
3. DNS (configured): apex `CNAME` flattening or `ALIAS` → `al4f.github.io`

The workflow [`.github/workflows/deploy-al4f-dev.yml`](../.github/workflows/deploy-al4f-dev.yml) builds `website/` and deploys `website/dist/` on every push.

## Local development

```bash
# From repo root
pnpm install
pnpm --filter @skills-house/website dev
# Open http://localhost:5173
```

## Build

```bash
pnpm build:website
# Output: website/dist/
pnpm --filter @skills-house/website preview
```

## Structure

```
website/
├── public/             # Static assets, registry JSON, CNAME, feed.xml
│   ├── data/           # Generated registry data (from pnpm generate)
│   └── assets/         # Diagrams, OG image
├── src/
│   ├── components/     # Layout, header, footer
│   ├── pages/          # Route pages
│   ├── content/        # Writing article HTML bodies
│   └── lib/            # Registry types, routes, writing metadata
├── scripts/prerender.mjs
└── dist/               # Build output (deployed to GitHub Pages)
```

## Updating registry content

Skills and scripts pages are driven by generated JSON:

```bash
pnpm generate
```

This updates `generated/` and `website/public/data/`. Commit the changes, then push — CI rebuilds and redeploys the site.

## Updating writing

1. Add article HTML body under `website/src/content/writing/<slug>.html`
2. Register metadata in `website/src/lib/writing.ts`
3. Add RSS entry in `website/public/feed.xml`
