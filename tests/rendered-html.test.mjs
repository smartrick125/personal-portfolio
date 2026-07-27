import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio and its new archive structure", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Smartrick — Technical Artist<\/title>/i);
  assert.match(html, /class="starfield-canvas"/);
  assert.match(html, /A growing technical-art archive/);
  assert.match(html, /id="learning-archive"/);
  assert.match(html, /@ww2024260424/);
  assert.match(html, /gaussian-original\.jpg/);
  assert.match(html, /gaussian-effect\.jpg/);
  assert.match(html, /edge-original\.jpg/);
  assert.match(html, /edge-effect\.jpg/);
  assert.match(html, /DIRECT CONTACT/);
  assert.match(html, /TECHNICAL PROFILE/);
  assert.match(html, /PERSONAL LIFE ACCOUNT/);
  assert.doesNotMatch(html, /Source folder|No separate Script folder|Tianjin/);
});

test("keeps all comparison media available in the deployment bundle", async () => {
  const media = [
    "../public/rendering-code/gaussian-original.jpg",
    "../public/rendering-code/gaussian-effect.jpg",
    "../public/rendering-code/edge-original.jpg",
    "../public/rendering-code/edge-effect.jpg",
  ];

  await Promise.all(media.map((path) => access(new URL(path, import.meta.url))));

  const [page, catalog, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renderingCatalog.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /function StarfieldCanvas/);
  assert.match(page, /study\.comparison/);
  assert.match(catalog, /comparison\?:/);
  assert.match(css, /\.archive-mega/);
  assert.match(css, /\.code-comparison/);
  assert.match(css, /prefers-reduced-motion/);
});
