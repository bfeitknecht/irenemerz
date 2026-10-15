#!/usr/bin/env -S deno run --allow-read
/**
 * Verify the built site in dist/:
 *  - every local reference in HTML/CSS resolves to a file
 *  - no Worldsoft CMS / third-party CDN references remain in the output
 *  - GitHub Pages config files exist
 *  - every artwork in src/data/artworks.json has its image + thumb
 *
 * Run after `deno task build`. Usage: deno task check
 */

const DIST = new URL("../dist/", import.meta.url).pathname;
const missing = new Set<string>();
const cdnRefs = new Map<string, Set<string>>();

const CDN_HOSTS = [
  "worldsoft",
  "static.worldsoft-cms.info",
  "images.worldsoft-cms.info",
  "fonts.worldsoft.ch",
  "fonts.gstatic.com",
  "fonts.googleapis.com",
  "jquery.com",
  "bootstrapcdn.com",
];

function* walk(dir: string): Generator<string> {
  for (const e of Deno.readDirSync(dir)) {
    const p = dir + "/" + e.name;
    if (e.isDirectory) {
      if (e.name === ".git" || e.name === ".deno-cache") continue;
      yield* walk(p);
    } else yield p;
  }
}

function exists(p: string): boolean {
  try {
    Deno.statSync(p);
    return true;
  } catch {
    return false;
  }
}

function resolveLocal(dir: string, ref: string): string {
  // root-absolute refs resolve against the site root (custom-domain deployment)
  if (ref.startsWith("/")) dir = "";
  const parts = (dir === "" ? [] : dir.split("/")).concat(ref.split("/"));
  const out: string[] = [];
  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return DIST + out.join("/");
}

function checkRef(file: string, dir: string, ref: string) {
  if (
    !ref || /^(https?:)?\/\//.test(ref) ||
    /^(data:|mailto:|tel:|#|javascript:)/.test(ref)
  ) return;
  const clean = ref.split("?")[0].split("#")[0];
  if (!clean) return;
  if (!exists(resolveLocal(dir, clean))) missing.add(`${file} -> ${ref}`);
}

const REF_RE =
  /(?:src|href|poster)=["']([^"']+)["']|url\((['"]?)([^)"']+)\2\)/g;

for (const f of walk(DIST)) {
  const rel = f.slice(DIST.length);
  if (!/\.(html|css|js|xml|txt)$/.test(f)) continue;
  const content = Deno.readTextFileSync(f);
  for (const m of content.matchAll(REF_RE)) {
    const ref = m[1] ?? m[3] ?? "";
    checkRef(rel, rel.split("/").slice(0, -1).join("/"), ref);
  }
  for (const host of CDN_HOSTS) {
    if (content.includes(host)) {
      const set = cdnRefs.get(host) ?? new Set<string>();
      set.add(rel);
      cdnRefs.set(host, set);
    }
  }
}

// Artwork data must match the files on disk (public layout: /img/...).
const artworks = JSON.parse(
  Deno.readTextFileSync(
    new URL("../src/data/artworks.json", import.meta.url).pathname,
  ),
) as { id: string; image: string; thumb: string }[];
for (const a of artworks) {
  for (const ref of [a.image, a.thumb]) {
    if (!exists(resolveLocal("", ref))) missing.add(`artworks.json -> ${ref}`);
  }
}

for (
  const f of [
    "index.html",
    "404.html",
    "CNAME",
    ".nojekyll",
    "robots.txt",
    "sitemap.xml",
  ]
) {
  if (!exists(DIST + f)) missing.add(`missing GitHub Pages file: ${f}`);
}

if (missing.size || cdnRefs.size) {
  for (const m of missing) console.error(`MISSING: ${m}`);
  for (const [host, files] of cdnRefs) {
    console.error(`CDN REF (${host}): ${[...files].join(", ")}`);
  }
  Deno.exit(1);
}

console.log(
  `check ok: all references resolve, no CDN dependencies, ` +
    `${artworks.length} artworks verified.`,
);
