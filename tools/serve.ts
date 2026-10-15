#!/usr/bin/env -S deno run --allow-read --allow-net
/** Minimal static file server for the local preview of dist/.
 *  Usage: deno task serve [port]  (run `deno task build` first) */

const DIST = new URL("../dist/", import.meta.url).pathname;

/** Accepts "8000", "0.0.0.0:8000" or nothing (defaults to 127.0.0.1:8000). */
function parseTarget(
  arg: string | undefined,
): { port: number; hostname: string } {
  if (!arg) return { port: 8000, hostname: "127.0.0.1" };
  if (arg.includes(":")) {
    const [hostname, port] = arg.split(":");
    return { hostname, port: Number(port) || 8000 };
  }
  return { port: Number(arg) || 8000, hostname: "127.0.0.1" };
}
const { port, hostname } = parseTarget(Deno.args[0]);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

async function tryFile(rel: string): Promise<Uint8Array | null> {
  try {
    return await Deno.readFile(DIST + rel);
  } catch {
    return null;
  }
}

Deno.serve({ port, hostname }, async (req) => {
  const url = new URL(req.url);
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith("/")) path += "index.html";

  let body = await tryFile(path);
  if (!body && !path.endsWith("/index.html")) {
    body = await tryFile(path + "/index.html");
  }
  if (!body && path === "/index.html") body = await tryFile("index.html");

  if (!body) {
    const notFound = await tryFile("404.html");
    return new Response(
      notFound ? notFound as unknown as BodyInit : "Not found",
      { status: 404, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
  return new Response(body as unknown as BodyInit, {
    headers: { "content-type": MIME[ext] || "application/octet-stream" },
  });
});

console.log(
  `Serving ${DIST} at http://${
    hostname === "0.0.0.0" ? "127.0.0.1" : hostname
  }:${port}/`,
);
