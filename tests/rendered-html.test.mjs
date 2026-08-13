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
  assert.match(html, /role="tablist"[^>]*aria-label="Project lab tools"/);
  assert.match(html, /role="tab"[^>]*aria-selected="true"/);
  const controlledPanels = html.match(/role="tab"[^>]*aria-controls="lab-panel-active"/g) ?? [];
  assert.equal(controlledPanels.length, 5);
  for (const label of ["Result", "Gallery", "Logic", "Nodes", "Code"]) {
    assert.match(html, new RegExp(`>${label}<`));
  }
  assert.match(html, /id="lab-panel-active"[^>]*data-project-stage="true"/);
  assert.match(html, /data-project-inspector="true"[^>]*aria-hidden="true"[^>]*inert=""/);
  assert.match(html, /aria-label="Show result video Full_View\.mp4"/);
  assert.match(html, /href="\/projects\/catalog\/Full_Skill_Effect\/Technical_Summary\/full-skill-effect-shader\.docx"[^>]*>Full_Skill_Effect_Shader\.docx</);
  assert.match(html, /<video[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline/i);
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
  for (const title of [
    "Full Skill Effect",
    "Interactive Energy Shield",
    "Energy Beam",
    "Stylized Dissolve Fire",
  ]) {
    assert.match(html, new RegExp(title, "i"));
  }
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

  const [
    page,
    catalog,
    css,
    holographicCard,
    projectLabModel,
    projectLab,
    projectLabHero,
    projectToolDock,
    projectStage,
    projectInspector,
    projectFocusViewer,
    projectLabCss,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/renderingCatalog.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/HolographicTiltCard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/projectLabModel.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/ProjectLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/ProjectLabHero.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/ProjectToolDock.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/ProjectStage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/ProjectInspector.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/project-lab/ProjectFocusViewer.tsx", import.meta.url), "utf8").catch(
      (error) => {
        if (error && typeof error === "object" && error.code === "ENOENT") return "";
        throw error;
      },
    ),
    readFile(new URL("../app/components/project-lab/ProjectLab.module.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /function StarfieldCanvas/);
  assert.match(page, /HolographicTiltCard/);
  assert.match(holographicCard, /requestAnimationFrame/);
  assert.match(holographicCard, /cancelAnimationFrame/);
  assert.match(holographicCard, /onPointerMove/);
  assert.match(holographicCard, /onPointerLeave/);
  assert.match(page, /study\.comparison/);
  assert.doesNotMatch(page, /case-study-list/);
  assert.doesNotMatch(page, /className="case-study"/);
  assert.match(catalog, /comparison\?:/);
  assert.match(page, /className="rendering-lab"/);
  assert.match(css, /\.rendering-lab\s*\{/);
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
  assert.match(projectLab, /data-lab-phase/);
  assert.match(projectLabHero, /autoPlay/);
  assert.match(projectLabHero, /muted/);
  assert.match(projectLabHero, /loop/);
  assert.match(projectLabHero, /playsInline/);
  assert.match(projectLabHero, /IntersectionObserver/);
  assert.match(projectLabHero, /\.pause\(\)/);
  assert.match(projectLabHero, /onPlayRejected/);
  assert.match(projectLabHero, /<video[\s\S]*src=\{hero\.src\}/);
  assert.doesNotMatch(projectLabHero, /<source\s+src=\{hero\.src\}/);
  assert.match(projectLabHero, /onPointerMove/);
  assert.match(projectLabHero, /prefers-reduced-motion/);
  assert.match(projectLab, /window\.clearTimeout\(switchTimeoutRef\.current\)/);
  assert.match(projectLab, /window\.cancelAnimationFrame\(exitFrameRef\.current\)/);
  assert.match(projectLab, /window\.cancelAnimationFrame\(transitionFrameRef\.current\)/);
  assert.match(projectLab, /if \(activeProjectIndex === displayedProjectIndex\) \{[\s\S]*finishProjectSwitch/);
  assert.match(projectToolDock, /viewLabels/);
  assert.match(projectToolDock, /role="tablist"/);
  assert.match(projectToolDock, /aria-controls="lab-panel-active"/);
  assert.match(projectStage, /data-project-stage="true"/);
  assert.match(projectStage, /project\.videos\[mediaIndex\]/);
  assert.match(projectStage, /project\.gallery\.find/);
  assert.match(projectStage, /failedMedia\?\.has\(resultVideo\.src\)/);
  assert.match(projectStage, /!response\.ok/);
  assert.match(projectStage, /\.catch\(/);
  assert.match(projectStage, /This source file is currently unavailable\./);
  assert.match(projectStage, /id="lab-panel-active"/);
  assert.match(projectInspector, /technicalSummary/);
  assert.match(projectInspector, /project\.videos\.map/);
  assert.match(projectInspector, /href=\{project\.technicalSummary\.src\}/);
  assert.match(projectInspector, /inert=\{!compact \? true : undefined\}/);
  assert.match(projectInspector, /aria-hidden=\{!compact\}/);
  assert.match(projectInspector, /<span className=\{styles\.logicStepText\}>\{step\}<\/span>/);
  assert.doesNotMatch(projectInspector, /<p>\{step\}<\/p>/);
  assert.match(projectFocusViewer, /role="dialog"/);
  assert.match(projectFocusViewer, /aria-modal="true"/);
  assert.match(projectFocusViewer, /Escape/);
  assert.match(projectFocusViewer, /focusableElements/);
  assert.match(projectFocusViewer, /candidate\.isConnected/);
  assert.match(projectFocusViewer, /candidate\.closest\("\[inert\]"\)/);
  assert.match(projectFocusViewer, /document\.activeElement === candidate/);
  assert.match(projectFocusViewer, /tryRestoreFocus\(triggerRef\.current\)/);
  assert.match(projectLabHero, /onError=\{\(\) => onMediaError\?\.\(hero\.src\)\}/);
  assert.match(projectLabCss, /\.heroParallaxImage/);
  assert.match(projectLabCss, /object-fit:\s*contain/);
  assert.match(projectLabCss, /--image-parallax-x/);
  assert.match(projectLabCss, /@media\s*\(prefers-reduced-motion:\s*reduce\),\s*\(pointer:\s*coarse\)/);
  assert.match(projectLabCss, /@media\s*\(max-width:\s*760px\)/);
  assert.match(projectLabCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(projectLabCss, /@media\s*\(pointer:\s*coarse\)/);
  assert.match(
    projectLabCss,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.projectContent,[\s\S]*?\.stageFrame,[\s\S]*?\.inspector,[\s\S]*?\.stageContent,[\s\S]*?\.focusDialog\s*\{[\s\S]*?animation:\s*none\s*!important;[\s\S]*?transition:\s*none\s*!important;[\s\S]*?transform:\s*none\s*!important;/,
  );
  assert.doesNotMatch(
    projectLabCss,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.hero,\s*\.workspace/,
  );
  assert.match(
    projectLabCss,
    /\.lab\[data-lab-phase="hero"\]\s+\.inspector,\s*\.lab\[data-lab-phase="hero"\]\s+\.toolDock\s*\{[\s\S]*?visibility:\s*hidden;[\s\S]*?opacity:\s*0;[\s\S]*?pointer-events:\s*none;/,
  );
  assert.match(
    projectLabCss,
    /\.lab\[data-lab-phase="compact"\]\s+\.inspector,\s*\.lab\[data-lab-phase="compact"\]\s+\.toolDock\s*\{[\s\S]*?visibility:\s*visible;[\s\S]*?opacity:\s*1;[\s\S]*?pointer-events:\s*auto;/,
  );
  assert.match(
    projectLabCss,
    /\.inspector\s*\{[^}]*transition:\s*opacity 260ms ease,\s*transform 360ms cubic-bezier\(\.2, \.8, \.2, 1\),\s*visibility 0s linear 360ms;/,
  );
  assert.match(
    projectLabCss,
    /\.lab\[data-lab-phase="compact"\]\s+\.inspector\s*\{[^}]*transition:\s*opacity 260ms ease,\s*transform 360ms cubic-bezier\(\.2, \.8, \.2, 1\),\s*visibility 0s linear 0s;/,
  );
  assert.match(projectLab, /<ProjectInspector[\s\S]*?compact=\{compact\}/);
  assert.doesNotMatch(projectLab, /mobileLayout/);
  const stagePosition = projectLab.indexOf("<ProjectStage");
  const mobileSentinelPosition = projectLab.indexOf("ref={mobileSentinelRef}");
  const toolDockPosition = projectLab.indexOf("<ProjectToolDock");
  const inspectorPosition = projectLab.indexOf("<ProjectInspector");
  const desktopSentinelPosition = projectLab.indexOf("ref={desktopSentinelRef}");
  assert.ok(stagePosition >= 0, "ProjectStage must remain in the shared project lab workspace");
  assert.ok(
    stagePosition < mobileSentinelPosition
      && mobileSentinelPosition < toolDockPosition
      && toolDockPosition < inspectorPosition,
    "mobile phase sentinel must follow Stage and precede Dock/Inspector",
  );
  assert.ok(
    inspectorPosition < desktopSentinelPosition,
    "desktop phase sentinel must remain after the sticky workspace",
  );
  assert.match(
    projectLab,
    /query\.matches\s*\?\s*mobileSentinelRef\.current\s*:\s*desktopSentinelRef\.current/,
  );
  assert.doesNotMatch(projectLab, /addEventListener\("scroll"/);
  assert.match(
    projectLabCss,
    /\.transitionTrack\s*\{[^}]*position:\s*relative;[^}]*min-height:\s*150svh;/,
  );
  assert.match(
    projectLabCss,
    /\.desktopPhaseSentinel\s*\{[^}]*position:\s*absolute;[^}]*inset-inline:\s*0;[^}]*top:\s*50svh;/,
  );
  assert.match(
    projectLabCss,
    /@media\s*\(max-width:\s*760px\)\s*\{[\s\S]*?\.desktopPhaseSentinel\s*\{[^}]*display:\s*none;/,
  );
  assert.match(
    projectLabCss,
    /\.lab\[data-lab-phase="hero"\]\s+\.inspector\s*\{[\s\S]*?max-height:\s*0;[\s\S]*?padding-block:\s*0;/,
  );
  assert.match(
    projectLabCss,
    /\.lab\[data-lab-phase="compact"\]\s+\.inspector\s*\{[\s\S]*?max-height:\s*42svh;/,
  );
  assert.match(projectLab, /<noscript>/);
  assert.match(page, /activeProjectIndex/);
  assert.match(page, /setActiveProjectIndex/);
});

test("removes the legacy project index presentation", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /\.project-index\s*\{/);
});

test("removes the legacy VFX case study presentation", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /\.case-study\s*\{/);
});

test("project switching preserves the sentinel-owned lab phase", async () => {
  const projectLab = await readFile(
    new URL("../app/components/project-lab/ProjectLab.tsx", import.meta.url),
    "utf8",
  );

  assert.match(projectLab, /const \[compact, setCompact\] = useState\(false\)/);
  assert.match(
    projectLab,
    /setCompact\(\(entry\?\.boundingClientRect\.top \?\? Number\.POSITIVE_INFINITY\) <= window\.innerHeight \* 0\.35\)/,
  );
  assert.doesNotMatch(
    projectLab,
    /setCompact\(false\)/,
    "project switch completion must not overwrite the phase last synchronized by the sentinel",
  );
});
