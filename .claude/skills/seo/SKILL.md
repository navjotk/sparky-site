---
name: seo
description: Search and social-preview review for the Sparky marketing site (sparky-box.com, static pages served by a Cloudflare Worker from dist/). Use when adding or editing a public page, changing titles or copy, preparing a campaign landing page, or when asked about SEO, metadata, link previews, sitemaps, structured data, or why a shared link looks wrong.
---

# SEO for sparky-box.com

## Repo facts that change the work

- Source pages live at the repo root; `dist/` is a **hand-maintained mirror** that Wrangler
  actually serves (`wrangler.toml` → `[assets] directory = "dist"`). **Every edit must be copied
  into `dist/`, or it never ships.** Verify with `diff -r --brief . dist` (ignoring `.git`).
- Cloudflare assets serve `/setup.html` at `/setup`. Canonical URLs use the extensionless form.
- Canonical origin is `https://sparky-box.com` (not `www`, not the workers.dev URL).
- The operator dashboard lives at `dashboard.sparky-box.com`; devices get `<name>.sparky-box.com`.
  Neither should ever be linked from, or canonicalised into, the marketing site.
- Check work locally with `npx wrangler dev --port 8788` and curl the routes; do not deploy to check.

## Every public page needs

1. A unique `<title>` under ~60 characters and a `<meta name="description">` of ~150.
2. `<link rel="canonical">` with the extensionless absolute URL.
3. Open Graph + Twitter tags: `og:type`, `og:site_name`, `og:locale` (`en_GB`), `og:title`,
   `og:description`, `og:url`, `og:image` (+ width, height, alt), `twitter:card=summary_large_image`,
   `twitter:title`, `twitter:description`, `twitter:image`. **Absolute URLs only** — scrapers do not
   resolve relative paths.
4. Exactly one `<h1>`, then headings in order. No skipping levels for visual size.
5. Real `alt` text on meaningful images; empty `alt=""` on decorative ones.
6. Transactional pages (`/billing`, `/billing/success`) get `<meta name="robots" content="noindex,follow">`
   and stay out of `sitemap.xml`.

## Site-wide files

- `robots.txt`: allow all, disallow `/billing`, and point at the sitemap.
- `sitemap.xml`: indexable pages only, with `lastmod` updated when a page changes.
- Structured data: `Organization` + `WebSite` JSON-LD on the homepage only. Do not add `Product`,
  `Offer`, `AggregateRating` or `Review` until real prices and real reviews exist — fabricated
  structured data is a manual-action risk, not a clever trick.
- Social image: `assets/png/social-card.png`, 1200×630, on the dark canvas `#121110`. Rebuild it from
  `assets/png/lockup-primary.png` (transparent): recolour the non-orange pixels to cream, crop to the
  bounding box, centre it. Do NOT composite `lockup-on-ink.png` — it carries its own panel background.

## Campaign landing pages

- One page per positioning, each with its own canonical URL, title and description.
- Near-duplicate pages must not canonicalise to each other while a test is running, or one arm
  disappears from search and the comparison rots. `noindex,follow` on the losing variants after
  the test, then fold the winner into `/`.
- Keep ad link tags (`utm_*`) out of canonical URLs.

## What actually matters for this product, in order

1. **Link previews.** Traffic arrives from Instagram, chat apps and forums. A broken preview costs
   more clicks than any ranking factor.
2. **Page weight and Core Web Vitals.** The site is hand-written HTML with one stylesheet. Keep it
   that way: no framework, no font CDN, no analytics bundle without a decision behind it. Use the
   `web-perf` skill to measure.
3. **Words people actually search.** Nobody searches "Sparky". They search the problem: running a
   home server, self-hosting without the admin, blocking ads for the whole house, a private
   assistant. Write pages for those, don't stuff keywords into the homepage.
4. **Rankings last.** A pre-launch one-page site ranks for nothing. Don't trade clarity for SEO.

## Never

- Invent reviews, ratings, customer counts, prices or availability, in copy or structured data.
- Add a second `<h1>`, or hide text for crawlers.
- Let `dist/` drift from source.

## Check before finishing

```
diff -r --brief --exclude=.git --exclude=.wrangler . dist   # dist in sync
grep -L 'rel="canonical"' *.html billing/*.html             # pages missing canonical
grep -L 'og:image' *.html billing/*.html                    # pages missing previews
```

Then preview the real markup: `npx wrangler dev --port 8788`, `curl -s localhost:8788/ | grep -E 'og:|canonical|<title>'`.
Validate a shared link with Facebook's Sharing Debugger and X's Card Validator once deployed.
