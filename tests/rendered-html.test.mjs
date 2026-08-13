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
  const holographicCards = html.match(/data-holographic-card="true"/g) ?? [];
  const labs = html.match(/data-project-lab="true"/g) ?? [];
  const projectSwitches = html.match(/data-project-switch="true"/g) ?? [];
  assert.equal(holographicCards.length, 4);
  assert.equal(labs.length, 1);
  assert.equal(projectSwitches.length, 4);
  assert.match(html, /id="project-lab"/);
  assert.doesNotMatch(html, /class="case-study"/);
  for (const accent of ["skill", "shield", "beam", "fire"]) {
    assert.match(html, new RegExp(`data-accent="${accent}"`));
  }
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

  const [page, catalog, css, holographicCard, projectLabModel, projectLab] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renderingCatalog.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HolographicTiltCard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/projectLabModel.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/ProjectLab.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /function StarfieldCanvas/);
  assert.match(page, /HolographicTiltCard/);
  assert.match(holographicCard, /requestAnimationFrame/);
  assert.match(holographicCard, /cancelAnimationFrame/);
  assert.match(holographicCard, /onPointerMove/);
  assert.match(holographicCard, /onPointerLeave/);
  assert.match(page, /study\.comparison/);
  assert.match(catalog, /comparison\?:/);
  assert.match(css, /\.archive-mega/);
  assert.match(css, /\.code-comparison/);
  assert.match(css, /\.holographic-tilt-card::before/);
  assert.match(css, /--card-accent/);
  assert.match(css, /--shine-x/);
  assert.match(css, /--tilt-x/);
  assert.match(css, /pointer:\s*coarse/);
  assert.match(css, /\.holographic-tilt-card:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(projectLabModel, /type ProjectLabView/);
  assert.match(projectLabModel, /function getAvailableViews/);
  assert.match(projectLabModel, /function getHeroMedia/);
  assert.match(projectLab, /data-project-lab="true"/);
  assert.match(projectLab, /<noscript>/);
  assert.match(page, /activeProjectIndex/);
  assert.match(page, /setActiveProjectIndex/);
});
