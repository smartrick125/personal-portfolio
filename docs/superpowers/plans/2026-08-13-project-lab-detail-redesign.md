# Project Lab Detail Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four repeated vertical VFX case studies with one active-project Project Lab featuring a cinematic opening, a stable result stage, contextual Inspector, and content-aware tool dock.

**Architecture:** Keep the existing project catalog and copy as the only content sources, normalize them into a typed `ProjectLabProject[]` in `page.tsx`, and pass a controlled active-project index into one `ProjectLab`. Split the lab into focused client components for hero media, tool navigation, stage rendering, Inspector content, and fullscreen inspection; use a CSS Module and native React/browser APIs without adding dependencies.

**Tech Stack:** React 19, TypeScript, Vinext/Next 16, CSS Modules, native `<video>`, IntersectionObserver, Node test runner, ESLint.

## Global Constraints

- Preserve the four existing holographic highlight cards and their content.
- Render exactly one Project Lab and one active project at a time.
- Preserve every existing real video, image, logic step, node image, script, summary, tag, and proof metric.
- Render only tools supported by the active project's real content; never show empty categories.
- Use muted inline looping autoplay only when video exists; otherwise use the first gallery image with restrained parallax.
- Do not redesign the hero, profile, approach, contact, holographic highlight cards, or the separate Rendering Code Lab.
- Do not add Three.js, GSAP, Motion, or another animation dependency.
- Preserve original image aspect ratios and use `object-fit: contain` for node graphs.
- Support desktop mouse, mobile touch, keyboard, blocked autoplay, missing media, no JavaScript, and `prefers-reduced-motion: reduce` fallbacks.
- Preserve the user's unrelated uncommitted deletions of `public/file.svg`, `public/globe.svg`, and `public/window.svg`.
- Do not publish until implementation, production build, tests, lint, and manual browser verification pass.

---

## File Structure

### Files to create

- `app/components/project-lab/projectLabModel.ts` — shared lab types and pure view/media availability helpers.
- `app/components/project-lab/ProjectLab.tsx` — controlled active-project coordination and stable lab shell.
- `app/components/project-lab/ProjectLabHero.tsx` — cinematic media opening, autoplay fallback, visibility pause, and hero-to-stage state.
- `app/components/project-lab/ProjectToolDock.tsx` — semantic, content-aware lab view controls.
- `app/components/project-lab/ProjectStage.tsx` — result, gallery, node, and code primary presentation.
- `app/components/project-lab/ProjectInspector.tsx` — contextual metadata, logic, media selection, and source controls.
- `app/components/project-lab/ProjectFocusViewer.tsx` — accessible fullscreen node/code inspection dialog.
- `app/components/project-lab/ProjectLab.module.css` — isolated desktop, responsive, reduced-motion, and fallback styling.

### Files to modify

- `app/projectCatalog.ts` — export the existing catalog types so the lab model can consume them without duplicating data.
- `app/components/HolographicTiltCard.tsx` — accept an optional semantic click handler while preserving anchor fallback behavior.
- `app/page.tsx` — own the active project index, normalize existing data, connect highlight cards, render one Project Lab, and remove repeated case-study markup.
- `app/globals.css` — remove CSS used only by the deleted repeated case-study markup; retain shared Rendering Code Lab styles.
- `tests/rendered-html.test.mjs` — assert the single-lab structure, real content preservation, accessibility contracts, and absence of repeated case articles.

---

### Task 1: Typed Project Lab Model and Single Shared Shell

**Files:**
- Create: `app/components/project-lab/projectLabModel.ts`
- Create: `app/components/project-lab/ProjectLab.tsx`
- Create: `app/components/project-lab/ProjectLab.module.css`
- Modify: `app/projectCatalog.ts:1-23`
- Modify: `app/components/HolographicTiltCard.tsx:10-32,116-128`
- Modify: `app/page.tsx:1-6,290-319,660-865`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Produces: `ProjectLabView`, `ProjectLabMedia`, `ProjectLabProject`, `getAvailableViews(project)`, and `getHeroMedia(project)`.
- Produces: `ProjectLab({ projects, activeProjectIndex, onProjectChange })`.
- Produces: optional `onClick: MouseEventHandler<HTMLAnchorElement>` on `HolographicTiltCard`.
- Later tasks consume the model types and controlled Project Lab props without redefining them.

- [ ] **Step 1: Write the failing single-lab render test**

Extend the first rendered-HTML test after reading `html`:

```js
const labs = html.match(/data-project-lab="true"/g) ?? [];
const projectSwitches = html.match(/data-project-switch="true"/g) ?? [];

assert.equal(labs.length, 1);
assert.equal(projectSwitches.length, 4);
assert.match(html, /id="project-lab"/);
assert.doesNotMatch(html, /class="case-study"/);
```

Extend the source test's `Promise.all` with:

```js
readFile(new URL("../app/components/project-lab/projectLabModel.ts", import.meta.url), "utf8"),
readFile(new URL("../app/components/project-lab/ProjectLab.tsx", import.meta.url), "utf8"),
```

Then assert:

```js
assert.match(projectLabModel, /type ProjectLabView/);
assert.match(projectLabModel, /function getAvailableViews/);
assert.match(projectLabModel, /function getHeroMedia/);
assert.match(projectLab, /data-project-lab="true"/);
assert.match(projectLab, /<noscript>/);
assert.match(page, /activeProjectIndex/);
assert.match(page, /setActiveProjectIndex/);
```

- [ ] **Step 2: Run the test and verify the expected red state**

Run:

```powershell
$env:PATH = 'C:\Users\21265\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:PATH
& 'C:\Users\21265\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' test
```

Expected: FAIL because the project-lab source files and `data-project-lab` markup do not exist.

- [ ] **Step 3: Export the existing catalog types**

Change the declarations in `app/projectCatalog.ts` without changing catalog data:

```ts
export type MediaItem = {
  name: string;
  src: string;
};

export type TechnicalSummary = {
  name: string;
  src: string;
  paragraphs: string[];
};

export type ProjectCatalogItem = {
  id: string;
  folderName: string;
  videos: MediaItem[];
  gallery: MediaItem[];
  nodes: MediaItem[];
  script?: MediaItem;
  technicalSummary: TechnicalSummary;
};
```

- [ ] **Step 4: Create the lab model and exact availability rules**

Create `projectLabModel.ts` with these public types and helpers:

```ts
import type { MediaItem, TechnicalSummary } from "../../projectCatalog";

export type ProjectLabView = "result" | "gallery" | "logic" | "nodes" | "code";

export type ProjectLabMedia = MediaItem & {
  kind: "video" | "image" | "node" | "code";
};

export type ProjectLabProject = {
  id: string;
  folderName: string;
  title: string;
  description: string;
  tags: readonly string[];
  logic: readonly string[];
  promise: string;
  metric: string;
  metricLabel: string;
  accentName: "skill" | "shield" | "beam" | "fire";
  accentColor: string;
  videos: MediaItem[];
  gallery: MediaItem[];
  nodes: MediaItem[];
  script?: MediaItem;
  technicalSummary: TechnicalSummary;
};

export function getAvailableViews(project: ProjectLabProject): ProjectLabView[] {
  const views: ProjectLabView[] = ["result"];
  if (project.gallery.length > 0) views.push("gallery");
  if (project.logic.length > 0) views.push("logic");
  if (project.nodes.length > 0) views.push("nodes");
  if (project.script) views.push("code");
  return views;
}

export function getHeroMedia(project: ProjectLabProject): ProjectLabMedia | null {
  const video = project.videos[0];
  if (video) return { ...video, kind: "video" };
  const image = project.gallery[0];
  if (image) return { ...image, kind: "image" };
  return null;
}
```

- [ ] **Step 5: Add controlled active-project state and normalize existing data**

In `app/page.tsx`, add state next to existing page state:

```ts
const [activeProjectIndex, setActiveProjectIndex] = useState(0);
```

Build `labProjects` only from current data:

```ts
const labProjects = text.projects.map((project, index) => ({
  ...projectCatalog[index],
  title: project.title,
  description: project.description,
  tags: project.tags,
  logic: project.logic,
  promise: projectHighlights[index].promise,
  metric: projectHighlights[index].metric,
  metricLabel: projectHighlights[index].metricLabel,
  accentName: projectHighlightAccents[index].name,
  accentColor: projectHighlightAccents[index].color,
}));
```

Add a highlight activation handler:

```ts
const activateProject = (index: number) => {
  setActiveProjectIndex(index);
  requestAnimationFrame(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("project-lab")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
};
```

- [ ] **Step 6: Preserve anchor fallback while connecting highlight cards**

Add this prop to `HolographicTiltCardProps`:

```ts
onClick?: MouseEventHandler<HTMLAnchorElement>;
```

Import `MouseEventHandler`, accept `onClick`, and pass it to the anchor. In
`page.tsx`, every highlight uses `href="#project-lab"` and:

```tsx
onClick={(event) => {
  event.preventDefault();
  activateProject(index);
}}
```

The real anchor destination remains usable when JavaScript does not run.

- [ ] **Step 7: Create the minimal shared Project Lab shell**

Implement the controlled shell with one root and four project buttons:

```tsx
type ProjectLabProps = {
  projects: ProjectLabProject[];
  activeProjectIndex: number;
  onProjectChange: (index: number) => void;
};

export function ProjectLab({ projects, activeProjectIndex, onProjectChange }: ProjectLabProps) {
  const activeProject = projects[activeProjectIndex] ?? projects[0];
  if (!activeProject) return null;

  return (
    <section
      id="project-lab"
      className={styles.lab}
      data-project-lab="true"
      style={{ "--lab-accent": activeProject.accentColor } as CSSProperties}
    >
      <header className={styles.header}>
        <p>PROJECT LAB / ACTIVE SYSTEM</p>
        <nav aria-label="Select project">
          {projects.map((project, index) => (
            <button
              type="button"
              data-project-switch="true"
              aria-pressed={index === activeProjectIndex}
              onClick={() => onProjectChange(index)}
              key={project.id}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{project.title}</strong>
            </button>
          ))}
        </nav>
      </header>
      <div className={styles.shell}>
        <h2>{activeProject.title}</h2>
        <p>{activeProject.description}</p>
      </div>
      <noscript>
        <div className={styles.noScriptFallback}>
          {projects.map((project) => (
            <article key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              {[...project.videos, ...project.gallery, ...project.nodes].map((item) => (
                <a href={item.src} key={item.src}>{item.name}</a>
              ))}
              {project.script && <a href={project.script.src}>{project.script.name}</a>}
            </article>
          ))}
        </div>
      </noscript>
    </section>
  );
}
```

Replace the `project-index` and `case-study-list` block in `page.tsx` with:

```tsx
<ProjectLab
  projects={labProjects}
  activeProjectIndex={activeProjectIndex}
  onProjectChange={setActiveProjectIndex}
/>
```

Delete the now-unused private `CodeViewer` function from `page.tsx`; Task 3
restores the same fetch-on-demand behavior inside `ProjectStage.tsx`, where the
Code view owns it.

- [ ] **Step 8: Add minimal scoped shell styling**

Create `ProjectLab.module.css` with stable layout primitives:

```css
.lab {
  --lab-accent: #7c6cff;
  position: relative;
  margin-bottom: 120px;
  color: #f7f9ff;
  background: #060a19;
  border: 1px solid rgba(151, 177, 255, 0.2);
  border-radius: 30px;
  overflow: clip;
  isolation: isolate;
}

.header {
  padding: 18px 22px;
  border-bottom: 1px solid rgba(151, 177, 255, 0.16);
}

.header nav {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.shell {
  min-height: 70vh;
  padding: 48px;
}
```

- [ ] **Step 9: Run tests and focused lint**

Run the test command from Step 2, then:

```powershell
& '.\node_modules\.bin\eslint.cmd' `
  'app/components/project-lab/projectLabModel.ts' `
  'app/components/project-lab/ProjectLab.tsx' `
  'app/components/HolographicTiltCard.tsx' `
  'app/page.tsx' `
  'tests/rendered-html.test.mjs'
```

Expected: tests PASS; lint reports zero errors. Existing `<img>` warnings in
`page.tsx` may remain but must not increase due to this task.

- [ ] **Step 10: Commit the single-lab foundation**

```powershell
git add app/projectCatalog.ts app/components/project-lab app/components/HolographicTiltCard.tsx app/page.tsx tests/rendered-html.test.mjs
git commit -m "feat(portfolio): add shared project lab shell"
```

---

### Task 2: Cinematic Hero, Autoplay Fallback, and Project Switching

**Files:**
- Create: `app/components/project-lab/ProjectLabHero.tsx`
- Modify: `app/components/project-lab/ProjectLab.tsx`
- Modify: `app/components/project-lab/ProjectLab.module.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `ProjectLabProject` and `getHeroMedia(project)` from Task 1.
- Produces: `ProjectLabHero({ project, compact })` with visibility-aware video behavior.
- Produces: `data-lab-phase="hero" | "compact"` on the lab root for CSS and QA.

- [ ] **Step 1: Add failing hero behavior contracts**

Read `ProjectLabHero.tsx` in the source test and assert:

```js
assert.match(projectLabHero, /autoPlay/);
assert.match(projectLabHero, /muted/);
assert.match(projectLabHero, /loop/);
assert.match(projectLabHero, /playsInline/);
assert.match(projectLabHero, /IntersectionObserver/);
assert.match(projectLabHero, /\.pause\(\)/);
assert.match(projectLabHero, /onPlayRejected/);
assert.match(projectLab, /data-lab-phase/);
```

In the rendered HTML, assert the initial project contains a muted inline video:

```js
assert.match(html, /<video[^>]*autoplay[^>]*muted[^>]*loop[^>]*playsinline/i);
```

- [ ] **Step 2: Run tests and confirm they fail for missing hero behavior**

Run `pnpm test` using the bundled Node path from Task 1.

Expected: FAIL because `ProjectLabHero.tsx`, video attributes, and lab phase do
not exist.

- [ ] **Step 3: Implement deterministic hero-media rendering**

Create `ProjectLabHero.tsx` with this public contract:

```tsx
type ProjectLabHeroProps = {
  project: ProjectLabProject;
  compact: boolean;
};
```

Use `getHeroMedia(project)`. For video, render:

```tsx
<video
  ref={videoRef}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster={project.gallery[0]?.src}
  onPlay={() => setPlayRejected(false)}
>
  <source src={hero.src} type="video/mp4" />
</video>
```

Call `videoRef.current.play()` after project changes. Catch rejection and set
`playRejected` to true. When true, render a real button labeled `Play project
video` that calls `play()` again.

For image, render the actual lead image with its project title as alt text. For
no media, render project title, description, and tags without an invented image.

- [ ] **Step 4: Pause video when the lab is not visible**

Observe the hero root with `IntersectionObserver` at threshold `0.2`:

```ts
const observer = new IntersectionObserver(([entry]) => {
  const video = videoRef.current;
  if (!video) return;
  if (entry?.isIntersecting) {
    video.play().catch(() => setPlayRejected(true));
  } else {
    video.pause();
  }
}, { threshold: 0.2 });
```

Disconnect the observer on cleanup and pause the previous video before active
project media changes.

- [ ] **Step 5: Add hero-to-lab phase detection**

In `ProjectLab`, observe a sentinel placed after the hero. Set `compact` true
when the sentinel crosses the upper 35 percent of the viewport. Render:

```tsx
<section data-project-lab="true" data-lab-phase={compact ? "compact" : "hero"}>
```

The component must not attach a continuous window scroll handler. Use one
IntersectionObserver and disconnect it on cleanup.

- [ ] **Step 6: Style the cinematic and compact phases**

Add CSS Module rules:

```css
.transitionTrack {
  position: relative;
  min-height: 150svh;
}

.experience {
  position: sticky;
  top: 0;
  min-height: 100svh;
  padding: 6svh 0;
}

.stageFrame {
  width: 100%;
  height: 88svh;
  overflow: hidden;
  transition:
    width 520ms cubic-bezier(.2, .8, .2, 1),
    height 520ms cubic-bezier(.2, .8, .2, 1),
    border-radius 520ms ease;
}

.lab[data-lab-phase="compact"] .stageFrame {
  width: 65%;
  height: 78svh;
  border-radius: 0 0 0 24px;
}
```

Render the same `ProjectLabHero` instance inside `stageFrame` in both phases so
the video does not restart or load twice. The 150svh track creates the scroll
distance; IntersectionObserver changes phase once, and CSS transitions the
single media DOM node from fullscreen width into the stage. Do not duplicate
the hero video in a second result component.

- [ ] **Step 7: Reset view/media state and sequence project switching**

Keep `activeProjectIndex` as the requested project and add an internal
`displayedProjectIndex` for the currently rendered project:

```ts
const [displayedProjectIndex, setDisplayedProjectIndex] = useState(activeProjectIndex);
const [transitioning, setTransitioning] = useState(false);
const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sync = () => setReduceMotion(query.matches);
  sync();
  query.addEventListener("change", sync);
  return () => query.removeEventListener("change", sync);
}, []);

useEffect(() => {
  if (activeProjectIndex === displayedProjectIndex) return;
  if (reduceMotion) {
    setDisplayedProjectIndex(activeProjectIndex);
    setCompact(false);
    return;
  }

  setTransitioning(true);
  const timeout = window.setTimeout(() => {
    setDisplayedProjectIndex(activeProjectIndex);
    setCompact(false);
    requestAnimationFrame(() => setTransitioning(false));
  }, 160);

  return () => window.clearTimeout(timeout);
}, [activeProjectIndex, displayedProjectIndex, reduceMotion]);
```

Render all header, hero, stage, and Inspector content from
`projects[displayedProjectIndex]`. Apply an exit class while `transitioning` is
true, then use a 260 ms CSS enter transition after the requested project becomes
the displayed project. Rapid switching clears the previous timeout, preventing
mixed media and text.

- [ ] **Step 8: Run tests, lint, and commit**

Run `pnpm test` and focused ESLint for the project-lab files. Then:

```powershell
git add app/components/project-lab tests/rendered-html.test.mjs
git commit -m "feat(portfolio): add cinematic project lab hero"
```

---

### Task 3: Content-Aware Tool Dock, Stage, and Inspector

**Files:**
- Create: `app/components/project-lab/ProjectToolDock.tsx`
- Create: `app/components/project-lab/ProjectStage.tsx`
- Create: `app/components/project-lab/ProjectInspector.tsx`
- Modify: `app/components/project-lab/ProjectLab.tsx`
- Modify: `app/components/project-lab/ProjectLab.module.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `ProjectLabView`, `ProjectLabProject`, and `getAvailableViews`.
- Produces: `ProjectToolDock({ views, activeView, onViewChange })`.
- Produces: `ProjectStage({ project, activeView, mediaIndex, onMediaError, onExpand })`.
- Produces: `ProjectInspector({ project, activeView, mediaIndex, onMediaChange, onExpand })`.

- [ ] **Step 1: Add failing semantic tool and content tests**

Add rendered assertions:

```js
assert.match(html, /role="tablist"[^>]*aria-label="Project lab tools"/);
assert.match(html, /role="tab"[^>]*aria-selected="true"/);
for (const label of ["Result", "Gallery", "Logic", "Nodes", "Code"]) {
  assert.match(html, new RegExp(`>${label}<`));
}
assert.match(html, /data-project-stage="true"/);
assert.match(html, /data-project-inspector="true"/);
```

Read the three new component files plus `ProjectLab.module.css` in the source
test, binding the stylesheet text as `projectLabCss`, and assert:

```js
assert.match(projectToolDock, /viewLabels/);
assert.match(projectToolDock, /role="tablist"/);
assert.match(projectStage, /data-project-stage="true"/);
assert.match(projectInspector, /technicalSummary/);
assert.match(projectLabCss, /object-fit:\s*contain/);
```

- [ ] **Step 2: Run tests and confirm the new contracts fail**

Run `pnpm test`.

Expected: FAIL because the dock, stage, Inspector, and semantic attributes do
not exist.

- [ ] **Step 3: Implement the semantic content-aware dock**

Use an explicit view-label map:

```ts
const viewLabels: Record<ProjectLabView, string> = {
  result: "Result",
  gallery: "Gallery",
  logic: "Logic",
  nodes: "Nodes",
  code: "Code",
};
```

Render only `views` returned by `getAvailableViews(project)`. Every control is:

```tsx
<button
  id={`lab-tab-${view}`}
  role="tab"
  type="button"
  aria-selected={view === activeView}
  aria-controls={`lab-panel-${view}`}
  tabIndex={view === activeView ? 0 : -1}
  onClick={() => onViewChange(view)}
>
  {viewLabels[view]}
</button>
```

Implement ArrowLeft, ArrowRight, Home, and End roving-focus behavior. Focus the
new tab after keyboard navigation but not after pointer clicks.

- [ ] **Step 4: Implement stage view rules**

`ProjectStage` uses this exact mapping:

- `result`: active video, or first gallery image, or readable text fallback.
- `gallery`: `project.gallery[mediaIndex]` with full-width contained image.
- `logic`: keep the result media visible; do not replace it with text cards.
- `nodes`: `project.nodes[mediaIndex]` with `object-fit: contain` and Expand.
- `code`: define a private `ProjectCodeViewer({ src, name })` inside
  `ProjectStage.tsx`. Move the former `CodeViewer` fetch effect from `page.tsx`
  into it unchanged in behavior: clear stale content when `src` changes, fetch
  only while the Code view is active, ignore completion after cleanup, and
  render the source in a named, horizontally scrollable `<pre><code>` block.

Add `data-project-stage="true"`, `role="tabpanel"`, `aria-labelledby`, and a
stable `id` matching the active tab. When an image errors, call
`onMediaError(src)` and render `This media is currently unavailable.` without
removing the other media controls.

- [ ] **Step 5: Implement contextual Inspector rules**

`ProjectInspector` renders:

- `result`: description, tags, promise, metric, metric label, and technical
  summary paragraphs inside a collapsed `Read technical notes` disclosure.
- `gallery`: current filename, `current / total`, previous/next buttons, and
  thumbnail buttons for every gallery image.
- `logic`: all logic steps as numbered selectable rows; selecting a row changes
  the highlighted Inspector row only.
- `nodes`: current node name, `current / total`, previous/next buttons, and
  `Expand node graph`.
- `code`: script name, `Open source file` link, and a concise statement that the
  code controls the active project's runtime behavior.

Every previous/next button uses modulo navigation only when the collection has
more than one item. With one item, both buttons are disabled.

- [ ] **Step 6: Coordinate view and media state in ProjectLab**

Add:

```ts
const [activeView, setActiveView] = useState<ProjectLabView>("result");
const [activeMediaIndex, setActiveMediaIndex] = useState(0);
const [failedMedia, setFailedMedia] = useState<Set<string>>(() => new Set());
```

On view change, reset media index to zero. In an effect keyed to
`displayedProjectIndex`, reset active view to `result`, media index to zero, and
failed media to a new empty Set. If the current view is unavailable after data
changes, fall back to `result`.

- [ ] **Step 7: Style the stable 65/35 lab layout and tool dock**

Add:

```css
.stage {
  width: 100%;
  height: 100%;
  background: #050817;
  border-right: 1px solid rgba(151, 177, 255, 0.16);
}

.inspector {
  position: absolute;
  top: 6svh;
  right: 0;
  width: 35%;
  height: 78svh;
  overflow: auto;
  background: rgba(8, 13, 32, 0.96);
  opacity: 0;
  transform: translateX(32px);
  pointer-events: none;
  transition: opacity 260ms ease, transform 360ms cubic-bezier(.2, .8, .2, 1);
}

.lab[data-lab-phase="compact"] .inspector {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

.toolDock {
  position: sticky;
  bottom: 0;
  z-index: 5;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(118px, 1fr);
  border-top: 1px solid rgba(151, 177, 255, 0.18);
  background: rgba(7, 11, 27, 0.94);
  backdrop-filter: blur(18px);
}
```

Keep text layers above decorative effects and ensure focus rings use the active
project's `--lab-accent`.

- [ ] **Step 8: Run tests, lint, and commit**

Run `pnpm test` and focused ESLint. Then:

```powershell
git add app/components/project-lab tests/rendered-html.test.mjs
git commit -m "feat(portfolio): add project lab tools and inspector"
```

---

### Task 4: Fullscreen Focus Viewer, Mobile Bottom Sheet, and Motion Fallbacks

**Files:**
- Create: `app/components/project-lab/ProjectFocusViewer.tsx`
- Modify: `app/components/project-lab/ProjectLab.tsx`
- Modify: `app/components/project-lab/ProjectStage.tsx`
- Modify: `app/components/project-lab/ProjectInspector.tsx`
- Modify: `app/components/project-lab/ProjectLab.module.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Produces: `ProjectFocusViewer({ open, title, children, onClose, triggerRef })`,
  where `triggerRef` is `RefObject<HTMLButtonElement | null>`.
- Consumes: `onExpand(kind, trigger)`, where `kind` is `"node" | "code"` and
  `trigger` is the exact `HTMLButtonElement` that opened the viewer.
- Produces: dialog focus trap, Escape close, and focus restoration.

- [ ] **Step 1: Add failing accessibility and responsive style contracts**

Read `ProjectFocusViewer.tsx` and `ProjectLab.module.css`, then assert:

```js
assert.match(projectFocusViewer, /role="dialog"/);
assert.match(projectFocusViewer, /aria-modal="true"/);
assert.match(projectFocusViewer, /Escape/);
assert.match(projectFocusViewer, /focusableElements/);
assert.match(projectFocusViewer, /triggerRef\.current\?\.focus/);
assert.match(projectLabCss, /@media\s*\(max-width:\s*760px\)/);
assert.match(projectLabCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
assert.match(projectLabCss, /@media\s*\(pointer:\s*coarse\)/);
```

- [ ] **Step 2: Run tests and confirm they fail**

Run `pnpm test`.

Expected: FAIL because the fullscreen viewer and responsive fallback contracts
do not exist.

- [ ] **Step 3: Implement the accessible fullscreen viewer**

Render nothing when closed. When open, render a portal to `document.body` with:

```tsx
<div className={styles.focusBackdrop} role="presentation">
  <section
    ref={dialogRef}
    className={styles.focusDialog}
    role="dialog"
    aria-modal="true"
    aria-labelledby="project-focus-title"
  >
    <header>
      <h2 id="project-focus-title">{title}</h2>
      <button type="button" onClick={onClose} aria-label="Close fullscreen viewer">×</button>
    </header>
    <div className={styles.focusContent}>{children}</div>
  </section>
</div>
```

On open, save `document.activeElement`, focus the close button, lock body
overflow, and listen for `Escape`. Trap Tab and Shift+Tab between:

```ts
const focusableElements = dialog.querySelectorAll<HTMLElement>(
  'button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])',
);
```

On close/unmount, restore body overflow and call
`triggerRef.current?.focus()`, falling back to the saved active element.

- [ ] **Step 4: Connect node and code expansion**

Track focus-view content in `ProjectLab`:

```ts
type FocusContent = { kind: "node" | "code"; title: string } | null;
const [focusContent, setFocusContent] = useState<FocusContent>(null);
```

Node expansion renders the selected node image contained at full size. Code
expansion renders the same fetched code source in a full-width `<pre>`. Closing
returns focus to the exact Expand button.

- [ ] **Step 5: Add mobile bottom-sheet behavior**

At `max-width: 760px`:

```css
.transitionTrack {
  min-height: auto;
}

.experience {
  position: relative;
  min-height: 0;
  padding: 0;
}

.stageFrame,
.lab[data-lab-phase="compact"] .stageFrame {
  width: 100%;
  height: max(48svh, 380px);
  border-radius: 0;
}

.stage {
  border-right: 0;
}

.inspector {
  position: relative;
  top: auto;
  right: auto;
  width: 100%;
  height: auto;
  max-height: 42svh;
  overflow: auto;
  border-top: 1px solid rgba(151, 177, 255, 0.18);
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

.toolDock {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: inline mandatory;
}

.toolDock button {
  min-width: 112px;
  min-height: 48px;
  scroll-snap-align: start;
}
```

The mobile lab does not use sticky hero contraction. It crossfades from hero to
workspace after the sentinel threshold.

- [ ] **Step 6: Add coarse-pointer and reduced-motion fallbacks**

At coarse pointer, disable hero image parallax and increase control hit areas.
At reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .hero,
  .workspace,
  .inspector,
  .stageContent,
  .focusDialog {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
```

Reuse the existing `reduceMotion` state for project exit timing. The highlight
activation handler already checks the same media query before selecting smooth
scrolling, so reduced-motion users receive instant state and scroll changes.

- [ ] **Step 7: Run tests, lint, and commit**

Run `pnpm test` and focused ESLint. Then:

```powershell
git add app/components/project-lab tests/rendered-html.test.mjs
git commit -m "feat(portfolio): add project lab responsive focus viewer"
```

---

### Task 5: Remove Legacy Case-Study Presentation and Verify the Complete Experience

**Files:**
- Modify: `app/globals.css:1193-1588,2579-2757,3286-3558,3943-3978`
- Modify: `tests/rendered-html.test.mjs`
- Verify: `app/page.tsx`
- Verify: all files under `app/components/project-lab/`

**Interfaces:**
- Consumes: complete Project Lab from Tasks 1-4.
- Produces: no legacy VFX case-study markup or orphaned case-study-only CSS.
- Keeps: Rendering Code Lab selectors and behavior intact.

- [ ] **Step 1: Add failing legacy-cleanup and preservation assertions**

Add source assertions:

```js
assert.doesNotMatch(page, /case-study-list/);
assert.doesNotMatch(page, /className="case-study"/);
assert.doesNotMatch(css, /\.project-index\s*\{/);
assert.doesNotMatch(css, /\.case-study\s*\{/);
assert.match(page, /className="rendering-lab"/);
assert.match(css, /\.rendering-lab\s*\{/);
assert.match(html, /gaussian-original\.jpg/);
assert.match(html, /edge-effect\.jpg/);
```

Add real-content preservation assertions for all four projects:

```js
for (const title of [
  "Full Skill Effect",
  "Interactive Energy Shield",
  "Energy Beam",
  "Stylized Dissolve Fire",
]) {
  assert.match(html, new RegExp(title, "i"));
}
```

- [ ] **Step 2: Run tests and verify legacy CSS assertions fail**

Run `pnpm test`.

Expected: FAIL because old `.project-index` and `.case-study` rules remain.

- [ ] **Step 3: Remove only orphaned VFX case-study styles**

Delete selectors that no longer have markup owners, including:

- `.project-index` and descendants.
- `.case-study`, `.case-header`, `.case-number`, and `.case-summary`.
- `.folder-banner`.
- `.case-block` and `.case-label` when no remaining Rendering Code Lab markup
  uses them.
- `.gallery-scroll`, `.node-scroll`, `.logic-grid`, and VFX-only video-scroll
  rules after equivalent lab behavior exists in the CSS Module.
- Their responsive overrides and semantic contrast group entries.

Before deleting each selector group, run:

```powershell
rg -n 'project-index|case-study|case-header|folder-banner|case-block|gallery-scroll|node-scroll|logic-grid' app
```

Keep any selector still used by Rendering Code Lab or another public section.

- [ ] **Step 4: Run the complete automated verification suite**

Run fresh commands from the main project root:

```powershell
$env:CI = 'true'
$env:PATH = 'C:\Users\21265\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:PATH
& 'C:\Users\21265\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' test
& 'C:\Users\21265\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' lint
& 'C:\Users\21265\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' build
```

Expected:

- Tests: all pass with zero failures.
- Lint: zero errors; review and report warnings instead of hiding them.
- Build: exit code 0 with a complete Vinext build.

- [ ] **Step 5: Run desktop browser QA**

Start the local server on a loopback-only address. Verify at a normal desktop
viewport:

1. Exactly one Project Lab exists.
2. Each holographic card activates the correct project and scrolls to the lab.
3. A video project opens with muted looping playback.
4. Leaving the lab viewport pauses the video.
5. Scrolling transitions from cinematic hero to the stable 65/35 workspace.
6. Project switching resets to Result and never mismatches media with text.
7. The tool dock exposes only available views.
8. Gallery and node previous/next controls stay within their collections.
9. Logic selection changes the Inspector highlight but preserves result media.
10. Node and code Expand open the correct fullscreen content.
11. No horizontal page overflow or console errors originate from the site.

- [ ] **Step 6: Run keyboard and reduced-motion QA**

Verify:

1. Tab reaches every project, tool, media, disclosure, and Expand control.
2. Tool tabs support ArrowLeft, ArrowRight, Home, and End.
3. Focus is visibly styled against every dark surface.
4. Fullscreen focus stays within the dialog, Escape closes it, and focus returns
   to the trigger.
5. With reduced motion enabled, hero contraction, parallax, scan-line motion,
   and large translations are absent.
6. Anchor fallback content remains readable when JavaScript is disabled in a
   separate static/SSR inspection.

- [ ] **Step 7: Run mobile-width and coarse-pointer QA**

At 390 × 844 and a coarse-pointer emulation, verify:

1. Stage stacks above the Inspector bottom sheet.
2. Tool controls are at least 48 px high and horizontally scroll without page
   overflow.
3. Project switching remains reachable without returning to the page top.
4. Images preserve aspect ratio; node graphs use contain behavior.
5. Fullscreen node/code viewers fit the viewport and close correctly.
6. No pointer parallax or desktop sticky contraction remains active.

- [ ] **Step 8: Fix discovered defects through regression tests**

For every discovered defect, first add a focused failing assertion to
`tests/rendered-html.test.mjs` or the relevant source contract, run it to verify
failure, implement the minimal fix, and rerun the full commands from Step 4.

- [ ] **Step 9: Commit cleanup and verified refinements**

```powershell
git add app/globals.css app/page.tsx app/components/project-lab tests/rendered-html.test.mjs
git commit -m "refactor(portfolio): replace long case studies with project lab"
```

- [ ] **Step 10: Stop the brainstorming companion before implementation handoff completes**

After the implementation preview is available, stop the brainstorming server
using its recorded session directory so the old design-choice page does not
remain open as if it were the product preview. Preserve `.superpowers/` as an
ignored local artifact and do not commit its contents.

---

## Publishing Gate

Publishing is a separate, explicitly authorized final action after Task 5 is
green. Before publishing:

1. Confirm `.openai/hosting.json` still contains project ID
   `appgprj_6a61fe68b2cc81918855ddff9d3ab605`.
2. Build and package the exact committed source, excluding unrelated uncommitted
   SVG deletions.
3. Save a new version to the existing Sites project; do not create a new site.
4. Deploy to the current public access mode only after the user approves that
   publish action.
5. Poll deployment status to `succeeded`.
6. Open the exact deployed URL and confirm one lab, four project switches,
   primary media loading, no site-origin console errors, and usable mobile
   layout.
