# al4f.dev — Static Site

Minimal authority hub for al4f. Deployed automatically via GitHub Pages on push to `main`.

## GitHub Pages setup (one-time)

1. Repo **Settings → Pages → Build and deployment**
   - Source: **GitHub Actions**
2. Repo **Settings → Pages → Custom domain**
   - Enter: `al4f.dev`
3. At your DNS provider, add:
   - `A` records → GitHub Pages IPs (see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site))
   - Or `CNAME` `al4f.dev` → `al4f.github.io` (if using user/org site)
   - For project site: `CNAME` `al4f.dev` → `al4f.github.io`

The workflow [`.github/workflows/deploy-al4f-dev.yml`](../.github/workflows/deploy-al4f-dev.yml) deploys `website/` on every push.

## Local preview

```bash
npx serve website -p 3000
# Open http://localhost:3000
```

## Structure

```
website/
├── CNAME               # Custom domain (al4f.dev)
├── index.html          # Homepage
├── styles.css          # Global styles
├── feed.xml            # RSS feed
├── assets/             # Diagrams, OG image
└── writing/            # Blog articles
```

## Updating content

1. Add HTML article under `website/writing/`
2. Link from `website/writing/index.html` and `website/index.html`
3. Add entry to `website/feed.xml`
4. Push to `main` — GitHub Pages redeploys automatically

Use **relative paths** for assets and navigation (`styles.css`, `../assets/…`) so the site works on both `al4f.dev` and `al4f.github.io/skills-house/`.
