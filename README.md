# irenemerz.ch

Static rebuild of the original irenemerz.ch (previously a Worldsoft CMS site)
for GitHub Pages. No framework runtime in the browser — pages are rendered at
build time with Preact (via `htm` templates) on Deno, plus one small vanilla-JS
island for the gallery filter, lightbox and purchase-inquiry mailto. A single
hand-written stylesheet.

Visitor-facing text is German; all code, comments and this README are English.
UI strings are centralized in `src/i18n.ts` so additional locales can be added
without touching the components.

## Project layout

```
deno.json                 tasks + dependencies (preact, htm, linkedom)
src/                      everything the site is made of
  site.ts                 global config (nav, contact info, canonical host)
  i18n.ts                 visitor-facing UI strings (de default, typed)
  types.ts                shared types
  html.ts                 htm bound to Preact
  pages/                  one component per page (meta + body)
  components/             Layout (head/header/footer/banner), ArtworkGrid
  islands/gallery.ts      client island: filter, lightbox, inquiry (mailto)
  styles.css              the whole design, hand-written
  data/artworks.json      artworks with stable uuid ids (gallery data source)
  assets/                 fonts, favicon, images (artworks are
                          assets/img/artworks/<uuid>.jpg / <uuid>-t.jpg)
tools/                    build tooling, not part of the site
  build.ts                static site generator (renders into dist/)
  serve.ts                local preview server for dist/
  check.ts                verifies all references + GitHub Pages files
dist/                     build output (gitignored, deployed by CI)
.github/workflows/        GitHub Pages deploy workflow (deploy.yaml)
```

## Tasks

```
deno task build         # render pages, copy assets, bundle island → dist/
deno task check         # verify references, no CDN dependencies, artwork files
deno task serve         # serve dist/ at http://127.0.0.1:8000/
deno task preview       # build + serve in one go
```

Content lives directly in `src/pages/*.ts` as htm components — edit, run
`deno task build`, commit. The build is fully offline; nothing is fetched at
build time. Nothing build-related is committed: `dist/` is gitignored and
deployed by the GitHub Actions workflow.

### Adding an artwork

1. Create the image (max 1600px, JPEG) and a thumbnail (480px) and store them
   as `src/assets/img/artworks/<uuid>.jpg` and
   `src/assets/img/artworks/<uuid>-t.jpg`
   (uuid e.g. `uuidgen | tr -d '-' | cut -c1-12`).
2. Add an entry to `src/data/artworks.json`: `id`, `category` (Holz, Stein,
   Metall or Weben), `description` (short text), `image`, `thumb`,
   `width`/`height` (pixels of the full image), `thumbWidth`/`thumbHeight`
   (pixels of the thumbnail).
3. `deno task build && deno task check` — the check reports missing image files.

The uuid never appears on the site itself; it is only included in the
inquiry email so the artwork can be identified unambiguously.

## Deploying (GitHub Pages)

Deployment runs through **GitHub Actions**
(`.github/workflows/deploy.yaml`): every push to `main` runs format/lint/
type-check, builds the site into `dist/`, verifies it, and deploys it with the
official Pages actions. No build output lives in the repository.

One-time setup:

- Push this repo to GitHub (branch `main`).
- Repo **Settings → Pages** → Source: **GitHub Actions** (not "Deploy from a
  branch").
- Custom domain: enter `irenemerz.ch` (the build emits a `CNAME` file into
  `dist/`).

### DNS via Cloudflare (orange cloud)

| Type  | Name | Value                  |
| ----- | ---- | ---------------------- |
| CNAME | @    | `<username>.github.io` |
| CNAME | www  | `<username>.github.io` |

- Keep both records proxied (orange cloud). In Cloudflare **SSL/TLS →
  Overview** set the mode to **Full** (GitHub issues an origin certificate for
  the custom domain once it is verified in the Pages settings).
- Add both `irenemerz.ch` and `www.irenemerz.ch` in the Pages settings;
  verification runs over the Cloudflare proxy and can take a moment.
- Optional: enable **Cloudflare Web Analytics** for visitor statistics
  (cookie-free; if wanted, its snippet goes into `src/components/Layout.ts`).

## Purchase inquiry

Clicking an artwork opens the lightbox with description, category and a
«Kaufanfrage senden» button. It opens a prefilled email to `mail@irenemerz.ch`
(subject + body including the artwork id) which the visitor completes with
their contact details — no backend, no third party.

## Docker (live testing)

```
docker build -t irenemerz .
docker run --rm -p 8000:8000 irenemerz                     # http://localhost:8000
docker run --rm -p 8000:8000 -v "$PWD":/site irenemerz     # with live files
```

## Migration notes

- **URLs changed**: `/68/startseite` → `/`, `/69/ueber-mich` → `/biografie/`,
  `/70/meine-arbeiten` → `/meine-arbeiten/`, `/71/ausstellungen` →
  `/ausstellungen/`, `/73/impressum` → `/impressum/`, `/75/kontakt` →
  `/kontakt/`, `/77/links` → `/links/`. Old URLs are redirected client-side
  via `404.html`.
- **Artwork filenames**: every image has a stable uuid (`<uuid>.jpg`); the
  mapping to the legacy CMS path is kept in `src/data/artworks.json`
  (`legacy` field).
- **Privacy policy**: the Worldsoft CMS cookie paragraph was replaced with an
  accurate description of this static site (no cookies, no tracking).
- **Fonts**: Open Sans is self-hosted (woff2, variable); there are no external
  CDN dependencies — `deno task check` fails if any creep back in.
- The legacy mirror (`.legacy/`, gitignored) is kept for reference only;
  nothing depends on it.
