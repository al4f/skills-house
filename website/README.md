# al4f.dev — Static Site

Minimal authority hub for al4f. Deploy the `website/` directory to any static host.

## Deploy options

### Cloudflare Pages / Netlify / Vercel

- **Build command:** none (static)
- **Output directory:** `website`
- **Custom domain:** `al4f.dev`

### Manual

```bash
# From repo root
npx serve website -p 3000
# Open http://localhost:3000
```

## Structure

```
website/
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

Diagram source files live in `docs/assets/` — copy updates to `website/assets/` when diagrams change.
