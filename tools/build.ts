#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run
/**
 * Static site generator for irenemerz.ch.
 *
 * Renders the htm page components in src/pages/ through the Layout into plain
 * HTML in dist/ (deployed by .github/workflows/deploy.yml), copies the static
 * assets, bundles the gallery island with `deno bundle`, and emits the GitHub
 * Pages config files. dist/ is gitignored; nothing build-related lives in the
 * repository itself.
 *
 * Usage: deno task build
 */

import { render } from "preact-render-to-string";
import { Layout } from "../src/components/Layout.ts";
import { pages } from "../src/pages/index.ts";
import { html } from "../src/html.ts";
import { site } from "../src/site.ts";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SRC = new URL("../src/", import.meta.url).pathname;

async function writeText(rel: string, text: string) {
  const p = DIST + rel;
  await Deno.mkdir(p.slice(0, p.lastIndexOf("/")), { recursive: true });
  await Deno.writeTextFile(p, text);
}

/** Recursively copy a directory tree. */
async function copyDir(from: string, to: string) {
  await Deno.mkdir(to, { recursive: true });
  for await (const e of Deno.readDir(from)) {
    const s = `${from}/${e.name}`;
    const d = `${to}/${e.name}`;
    if (e.isDirectory) await copyDir(s, d);
    else await Deno.copyFile(s, d);
  }
}

/** Rewrite root-absolute refs to paths relative to the page's depth, so the
 *  built site works at any base URL (github.io project preview AND the root
 *  custom domain). Canonical/og URLs stay absolute on purpose. */
function relativize(doc: string, depth: number): string {
  const prefix = "../".repeat(depth);
  const home = prefix === "" ? "./" : prefix;
  return doc
    .replace(
      /(src|href|poster)="\/((?:img|fonts|css|js)\/)/g,
      (_m, attr, dir) => `${attr}="${prefix}${dir}`,
    )
    .replace(
      /(src|href|poster)="\/(favicon\.ico)"/g,
      (_m, attr, file) => `${attr}="${prefix}${file}"`,
    )
    .replace(
      /url\((['"])\/((?:img|fonts|css|js)\/)/g,
      (_m, q, dir) => `url(${q}${prefix}${dir}`,
    )
    .replace(/href="\/"/g, `href="${home}"`)
    .replace(/href="\/([a-z0-9-]+\/)/g, (_m, seg) => `href="${prefix}${seg}`);
}

console.log("Rendering pages:");
const built: { path: string; title: string; description: string }[] = [];

for (const page of pages) {
  const depth = page.meta.path.split("/").filter(Boolean).length;
  const doc = relativize(
    "<!doctype html>\n" +
      render(html`<${Layout} meta=${page.meta}>${page.body}<//>`),
    depth,
  );
  const file = page.meta.path === "/"
    ? "index.html"
    : page.meta.path.replace(/^\/|\/$/g, "") + "/index.html";
  await writeText(file, doc);
  built.push({ ...page.meta });
  console.log(`  ${page.meta.path}`);
}

console.log("Copying stylesheet + fonts:");
await Deno.mkdir(DIST + "css", { recursive: true });
await Deno.copyFile(SRC + "styles.css", DIST + "css/site.css");
console.log("  css/site.css");
await Deno.mkdir(DIST + "fonts", { recursive: true });
for await (const f of Deno.readDir(SRC + "assets/fonts")) {
  await Deno.copyFile(
    SRC + "assets/fonts/" + f.name,
    DIST + "fonts/" + f.name,
  );
  console.log(`  fonts/${f.name}`);
}

console.log("Copying images:");
await copyDir(SRC + "assets/img", DIST + "img");
console.log("  img/");

await Deno.copyFile(SRC + "assets/favicon.ico", DIST + "favicon.ico");
console.log("  favicon.ico");

console.log("Bundling gallery island:");
const bundle = new Deno.Command(Deno.execPath(), {
  args: [
    "bundle",
    "--platform=browser",
    "--minify",
    "--no-check",
    "-o",
    DIST + "js/gallery.js",
    SRC + "islands/gallery.ts",
  ],
});
const bundleOut = await bundle.output();
if (!bundleOut.success) {
  console.error(new TextDecoder().decode(bundleOut.stderr));
  Deno.exit(1);
}
console.log("  js/gallery.js");

// ---------------------------------------------------------------------------
// GitHub Pages config
// ---------------------------------------------------------------------------

await writeText(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${
    built.map((b) => `  <url><loc>https://${site.host}${b.path}</loc></url>`)
      .join("\n")
  }
</urlset>
`,
);

await writeText(
  "robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: https://${site.host}/sitemap.xml\n`,
);

// Pins the canonical domain once Pages is configured for irenemerz.ch.
await writeText("CNAME", `${site.host}\n`);
await writeText(".nojekyll", "");

// 404 page with client-side redirects for the legacy Worldsoft CMS URLs.
const REDIRECTS: Record<string, string> = {
  "/68": "/",
  "/68/": "/",
  "/68/startseite": "/",
  "/68/startseite/": "/",
  "/68/aktuelles": "/",
  "/68/aktuelles/": "/",
  "/69/ueber-mich": "/biografie/",
  "/69/ueber-mich/": "/biografie/",
  "/70/meine-arbeiten": "/meine-arbeiten/",
  "/70/meine-arbeiten/": "/meine-arbeiten/",
  "/71/ausstellungen": "/ausstellungen/",
  "/71/ausstellungen/": "/ausstellungen/",
  "/73/impressum": "/impressum/",
  "/73/impressum/": "/impressum/",
  "/75/kontakt": "/kontakt/",
  "/75/kontakt/": "/kontakt/",
  "/77/links": "/links/",
  "/77/links/": "/links/",
};

// 404.html is served at the URL that 404'd, so relative refs would resolve
// against an unknown depth. Keep refs root-absolute and detect the site base
// at runtime (works both on username.github.io/<repo>/ and on the custom
// domain), with inline styles so the page never renders unstyled.
const notFoundNav = site.nav.map((n) =>
  `<a data-root href="${n.href}">${n.label}</a>`
)
  .join(" · ");
await writeText(
  "404.html",
  `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Seite nicht gefunden — ${site.title}</title>
<style>
body{margin:0;background:#fffefd;color:#5f5f5f;line-height:1.65;font-family:"Open Sans",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
main{max-width:46rem;margin:0 auto;padding:4rem 1.25rem}
h1{color:#3d3d3d;font-size:2rem;line-height:1.2;margin:0 0 1rem}
a{color:#5e4a48}.links a{margin-right:.75rem}.back{margin-top:2rem}
</style>
<script>
(function () {
  var REDIRECTS = ${JSON.stringify(REDIRECTS)};
  function finish(base) {
    var path = location.pathname.replace(/\\/+$/, "/");
    if (base && path.indexOf(base) === 0) path = path.slice(base.length - 1);
    var target = REDIRECTS[path];
    if (!target && /^\\/\\d+\\//.test(path)) target = "/";
    if (target) { location.replace(base + target); return; }
    var links = document.querySelectorAll("a[data-root]");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute("href", base + links[i].getAttribute("href"));
    }
  }
  // On project previews the site lives under /<repo>/; probe for it.
  var seg = location.pathname.split("/")[1] || "";
  if (seg && seg !== "css" && seg !== "js" && seg !== "img" && seg !== "fonts") {
    fetch(seg + "/css/site.css", { method: "HEAD" }).then(function (r) {
      finish(r.ok ? "/" + seg : "");
    }).catch(function () { finish(""); });
  } else {
    finish("");
  }
})();
</script>
</head>
<body>
<main>
  <article>
    <h1>Seite nicht gefunden</h1>
    <p>Die gesuchte Seite existiert nicht (oder wurde verschoben). Versuchen Sie es hier:</p>
    <p class="links">${notFoundNav}</p>
    <p class="back"><a data-root href="/">← Startseite</a></p>
  </article>
</main>
</body>
</html>
`,
);

console.log(`\nDone: ${built.length} pages. Output: ${DIST}`);
