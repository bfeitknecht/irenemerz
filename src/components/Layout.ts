import type { ComponentChildren } from "preact";
import { site } from "../site.ts";
import { strings } from "../i18n.ts";
import { html } from "../html.ts";

export interface PageMeta {
  /** Absolute path like "/biografie/". "/" for the home page. */
  path: string;
  /** <title> and og:title. */
  title: string;
  /** Big heading in the banner strip; omit on the home page. */
  heading?: string;
  description: string;
}

function Head({ meta }: { meta: PageMeta }) {
  const canonical = `https://${site.host}${meta.path}`;
  return html`
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${meta.title === site.title
        ? site.title
        : `${meta.title} — ${site.title}`}</title>
      <meta name="description" content=${meta.description} />
      <link rel="canonical" href=${canonical} />
      <link rel="icon" href=${site.favicon} />
      <meta property="og:site_name" content=${site.title} />
      <meta property="og:title" content=${meta.title} />
      <meta property="og:url" content=${canonical} />
      <meta property="og:description" content=${meta.description} />
      <meta name="twitter:card" content="summary" />
      <link rel="preload" href="/fonts/open-sans-latin.woff2" as="font"
        type="font/woff2" crossorigin />
      <link rel="stylesheet" href="/css/site.css" />
      <script src="/js/gallery.js" defer></script>
    </head>
  `;
}

export function Header({ path }: { path: string }) {
  return html`
    <header class="site-header">
      <a class="site-logo" href="/">
        <img src=${site.logo} alt=${site.title} width="400" height="102" />
      </a>
      <nav class="site-nav" aria-label=${strings.navLabel}>
        <ul>
          ${site.nav.map((item) =>
            html`<li><a href=${item.href} aria-current=${
              path === item.href ? "page" : undefined
            }>${item.label}</a></li>`
          )}
        </ul>
      </nav>
    </header>
  `;
}

export function Footer() {
  return html`
    <footer class="site-footer">
      <div class="footer-inner">
        <h2>${strings.footerHeading}</h2>
        <p class="footer-address"><strong>${site
          .address[0]}</strong><br />${site.address[1]}</p>
        <p>${strings.footerPhone}: <a href=${site.phoneHref}>${site
          .phone}</a></p>
        <p>${strings.footerEmail}: <a href=${`mailto:${site.email}`}>${site
          .email}</a></p>
        <p class="footer-legal">
          © 2019–${new Date()
            .getFullYear()} atelier irène merz · <a href="/impressum/">${strings
            .footerImprint}</a>
        </p>
      </div>
    </footer>
  `;
}

export function Layout(
  { meta, children }: { meta: PageMeta; children?: ComponentChildren },
) {
  const isHome = meta.path === "/";
  return html`
    <html lang="de">
      <${Head} meta=${meta} />
      <body>
        <${Header} path=${meta.path} />
        <main class="site-main">
          ${!isHome && html`
            <div class="page-banner">
              <h1>${meta.heading ?? meta.title}</h1>
            </div>
          `}
          <div class="page-content">${children}</div>
        </main>
        <${Footer} />
      </body>
    </html>
  `;
}
