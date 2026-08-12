# Holographic Project Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add strong pointer-driven magnetic depth and a mixed-palette holographic spectrum to the four `Selected visual systems` cards without changing project content or long-form case studies.

**Architecture:** Introduce one focused client component that owns pointer tracking and writes presentation values into CSS custom properties. Keep project data in `app/page.tsx`, retain the existing anchor markup and targets, and extend the existing highlight-card CSS with isolated transform, spectrum, accent, touch, focus, and reduced-motion layers.

**Tech Stack:** React 19, TypeScript, CSS custom properties, `requestAnimationFrame`, Vinext/Next.js, Node test runner, ESLint.

## Global Constraints

- Apply the effect only to the four top-level project highlight cards.
- Cap desktop pointer tilt at approximately 8–10 degrees and lift at approximately 8 px.
- Use a shared cyan-violet-pink spectrum plus one per-project accent color.
- Do not add Motion, GSAP, OGL, Three.js, React Bits, or any other dependency.
- Preserve every project title, image, label, metric, link target, and ordering.
- Disable tilt on coarse pointers and disable all motion under `prefers-reduced-motion: reduce`.
- Preserve keyboard activation and a clearly visible static focus state.
- Do not modify long case studies, Rendering Code Lab, hero animation, archive folds, or publishing configuration.

---

## File Map

- Create `app/components/HolographicTiltCard.tsx`: pointer event handling, animation-frame scheduling, neutral reset, CSS-variable interface, and anchor wrapper.
- Modify `app/page.tsx`: import the component, define four accent colors, and replace only the four highlight anchors with the component.
- Modify `app/globals.css`: perspective, card transform, image counter-parallax, spectrum sheen, project accent, focus, touch, and reduced-motion styling.
- Modify `tests/rendered-html.test.mjs`: verify four enhanced anchors render, all accent identities exist, the interaction component contains the required scheduling/cleanup behavior, and CSS contains every fallback contract.

---

### Task 1: Add the interaction component and preserve card semantics

**Files:**
- Create: `app/components/HolographicTiltCard.tsx`
- Modify: `app/page.tsx:3-5, 285-311, 662-688`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `href: string`, `accent: string`, `accentName: "skill" | "shield" | "beam" | "fire"`, `className?: string`, and `children: ReactNode`.
- Produces: `HolographicTiltCard(props): JSX.Element`, rendering one semantic `<a>` with `data-holographic-card`, `data-accent`, and CSS variables `--tilt-x`, `--tilt-y`, `--shine-x`, `--shine-y`, `--parallax-x`, `--parallax-y`, and `--card-accent`.

- [ ] **Step 1: Write the failing rendered-output and source-contract tests**

Extend the first test after `const html = await response.text();`:

```js
const holographicCards = html.match(/data-holographic-card="true"/g) ?? [];
assert.equal(holographicCards.length, 4);
for (const accent of ["skill", "shield", "beam", "fire"]) {
  assert.match(html, new RegExp(`data-accent="${accent}"`));
}
```

Extend the second test's `Promise.all` to read the new component:

```js
const [page, catalog, css, tiltCard] = await Promise.all([
  readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/renderingCatalog.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../app/components/HolographicTiltCard.tsx", import.meta.url), "utf8"),
]);

assert.match(page, /HolographicTiltCard/);
assert.match(tiltCard, /requestAnimationFrame/);
assert.match(tiltCard, /cancelAnimationFrame/);
assert.match(tiltCard, /onPointerMove/);
assert.match(tiltCard, /onPointerLeave/);
```

- [ ] **Step 2: Run the test and verify that it fails for the missing component/markup**

Run:

```powershell
pnpm test
```

Expected: FAIL because `app/components/HolographicTiltCard.tsx` is missing or because the rendered HTML contains zero `data-holographic-card="true"` anchors.

- [ ] **Step 3: Create the minimal focused interaction component**

Create `app/components/HolographicTiltCard.tsx` with this structure:

```tsx
"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type AccentName = "skill" | "shield" | "beam" | "fire";

type HolographicStyle = CSSProperties & {
  "--tilt-x": string;
  "--tilt-y": string;
  "--shine-x": string;
  "--shine-y": string;
  "--parallax-x": string;
  "--parallax-y": string;
  "--card-accent": string;
};

type HolographicTiltCardProps = {
  href: string;
  accent: string;
  accentName: AccentName;
  children: ReactNode;
  className?: string;
};

const neutralVariables = {
  "--tilt-x": "0deg",
  "--tilt-y": "0deg",
  "--shine-x": "50%",
  "--shine-y": "50%",
  "--parallax-x": "0px",
  "--parallax-y": "0px",
} as const;

export function HolographicTiltCard({
  href,
  accent,
  accentName,
  children,
  className = "",
}: HolographicTiltCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  const writeVariables = (x: number, y: number) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const nx = Math.min(1, Math.max(-1, ((x - rect.left) / rect.width - 0.5) * 2));
    const ny = Math.min(1, Math.max(-1, ((y - rect.top) / rect.height - 0.5) * 2));
    card.style.setProperty("--tilt-x", `${-ny * 10}deg`);
    card.style.setProperty("--tilt-y", `${nx * 10}deg`);
    card.style.setProperty("--shine-x", `${(nx + 1) * 50}%`);
    card.style.setProperty("--shine-y", `${(ny + 1) * 50}%`);
    card.style.setProperty("--parallax-x", `${-nx * 8}px`);
    card.style.setProperty("--parallax-y", `${-ny * 8}px`);
  };

  const flushPointer = () => {
    frameRef.current = null;
    if (!pendingRef.current) return;
    writeVariables(pendingRef.current.x, pendingRef.current.y);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    pendingRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(flushPointer);
    }
  };

  const onPointerLeave = () => {
    pendingRef.current = null;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    const card = cardRef.current;
    if (!card) return;
    for (const [property, value] of Object.entries(neutralVariables)) {
      card.style.setProperty(property, value);
    }
  };

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const style = { ...neutralVariables, "--card-accent": accent } as HolographicStyle;

  return (
    <a
      ref={cardRef}
      className={`highlight-card holographic-tilt-card ${className}`.trim()}
      href={href}
      data-holographic-card="true"
      data-accent={accentName}
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </a>
  );
}
```

Keep the pointer formula, 10-degree cap, 8-pixel counter-parallax, neutral reset, and cleanup behavior exact unless the compiler requires a type-only adjustment.

- [ ] **Step 4: Integrate the component into only the four highlight cards**

Add the import:

```tsx
import { HolographicTiltCard } from "./components/HolographicTiltCard";
```

Add the approved accent metadata next to `projectHighlights`:

```tsx
const projectHighlightAccents = [
  { name: "skill", color: "#7c6cff" },
  { name: "shield", color: "#63e6ff" },
  { name: "beam", color: "#4ca6ff" },
  { name: "fire", color: "#ff7b9d" },
] as const;
```

Inside the existing map, read `const accent = projectHighlightAccents[index];` and replace only the opening/closing anchor with:

```tsx
<HolographicTiltCard
  href={`#${assets.id}`}
  accent={accent?.color ?? "#7c6cff"}
  accentName={accent?.name ?? "skill"}
  key={project.title}
>
  <img
    src={assets.gallery[0]?.src}
    alt=""
    loading="lazy"
  />
  <span className="highlight-shade" aria-hidden="true" />
  <div className="highlight-topline">
    <span>0{index + 1}</span>
    <span>{project.tags[0]}</span>
  </div>
  <div className="highlight-copy">
    <p>{project.title}</p>
    <h4>{highlight.promise}</h4>
  </div>
  <div className="highlight-proof">
    <strong>{highlight.metric}</strong>
    <span>{highlight.metricLabel}</span>
  </div>
  <b aria-hidden="true">↘</b>
</HolographicTiltCard>
```

- [ ] **Step 5: Run focused verification**

Run:

```powershell
pnpm test
pnpm exec eslint app/components/HolographicTiltCard.tsx app/page.tsx tests/rendered-html.test.mjs
```

Expected: both commands PASS. The rendered HTML test reports exactly four enhanced anchors and all four accent names.

- [ ] **Step 6: Commit Task 1**

Stage only the files from this task:

```powershell
git add -- app/components/HolographicTiltCard.tsx app/page.tsx tests/rendered-html.test.mjs
git diff --staged --check
git commit -m "feat(portfolio): add holographic card interaction"
```

---

### Task 2: Add the holographic spectrum, depth, and fallback styling

**Files:**
- Modify: `app/globals.css:3652-3776, 3588-3600`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: the CSS variables and data attributes emitted by `HolographicTiltCard`.
- Produces: `.holographic-tilt-card` visual behavior plus coarse-pointer and reduced-motion fallbacks.

- [ ] **Step 1: Add failing CSS-contract assertions**

After the existing CSS assertions, add:

```js
assert.match(css, /\.holographic-tilt-card::before/);
assert.match(css, /--card-accent/);
assert.match(css, /--shine-x/);
assert.match(css, /--tilt-x/);
assert.match(css, /pointer:\s*coarse/);
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.match(css, /\.holographic-tilt-card:focus-visible/);
```

- [ ] **Step 2: Run the test and verify that the new CSS contract fails**

Run:

```powershell
pnpm test
```

Expected: FAIL at the first missing holographic CSS selector.

- [ ] **Step 3: Replace the highlight hover transform with variable-driven depth**

Extend `.highlight-scroll` with enough vertical breathing room for the strong tilt without clipping:

```css
.highlight-scroll {
  perspective: 1400px;
  padding-block: 18px 34px;
}
```

Extend `.highlight-card` with neutral variables and transform preservation:

```css
.holographic-tilt-card {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  --shine-x: 50%;
  --shine-y: 50%;
  --parallax-x: 0px;
  --parallax-y: 0px;
  --card-accent: #7c6cff;
  transform:
    perspective(1100px)
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y))
    translateY(0);
  transform-style: preserve-3d;
  will-change: transform;
}

.holographic-tilt-card:hover {
  transform:
    perspective(1100px)
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y))
    translateY(-8px)
    scale(1.012);
  border-color: color-mix(in srgb, var(--card-accent) 72%, #d7f6ff);
  box-shadow:
    0 38px 90px rgba(24, 20, 82, 0.34),
    0 0 36px color-mix(in srgb, var(--card-accent) 25%, transparent);
}
```

Remove or narrow the old `.highlight-card:hover, .highlight-card:focus-visible { transform: translateY(-8px); }` rule so it cannot overwrite the variable-driven transform. Keep non-transform focus styling separately.

- [ ] **Step 4: Add isolated spectrum, accent, and counter-parallax layers**

Add the shared spectrum sheen:

```css
.holographic-tilt-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  background:
    radial-gradient(
      circle at var(--shine-x) var(--shine-y),
      rgba(112, 229, 255, 0.5),
      rgba(120, 91, 255, 0.26) 27%,
      rgba(240, 121, 255, 0.18) 43%,
      transparent 67%
    ),
    linear-gradient(115deg, transparent 30%, rgba(164, 235, 255, 0.16) 48%, transparent 66%);
  mix-blend-mode: screen;
  transition: opacity 260ms ease;
}

.holographic-tilt-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--card-accent) 68%, transparent);
  border-radius: inherit;
  box-shadow: inset 0 0 34px color-mix(in srgb, var(--card-accent) 13%, transparent);
}

.holographic-tilt-card:hover::before,
.holographic-tilt-card:focus-visible::before {
  opacity: 0.92;
}
```

Keep text above the effect and counter-move only the image:

```css
.holographic-tilt-card > img {
  transform:
    translate3d(var(--parallax-x), var(--parallax-y), 0)
    scale(1.08);
}

.holographic-tilt-card > :not(img):not(.highlight-shade) {
  position: relative;
  z-index: 2;
}

.holographic-tilt-card .highlight-shade {
  z-index: 1;
}
```

Ensure the existing negative z-index image/shade rules are overridden for this component so the new pseudo-elements remain behind the text but above the image.

- [ ] **Step 5: Add keyboard, coarse-pointer, and reduced-motion fallbacks**

Add a static focus treatment without synthetic tilt:

```css
.holographic-tilt-card:focus-visible {
  outline: 3px solid #c6f4ff;
  outline-offset: 5px;
  border-color: var(--card-accent);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--card-accent) 22%, transparent);
}
```

Add the coarse-pointer fallback:

```css
@media (pointer: coarse) {
  .holographic-tilt-card,
  .holographic-tilt-card:hover,
  .holographic-tilt-card:active {
    transform: none;
    will-change: auto;
  }

  .holographic-tilt-card:active { transform: scale(0.985); }
  .holographic-tilt-card::before { opacity: 0.34; }
  .holographic-tilt-card > img { transform: scale(1.035); }
}
```

Append component-specific rules inside the existing reduced-motion query:

```css
.holographic-tilt-card,
.holographic-tilt-card:hover,
.holographic-tilt-card:focus-visible {
  transform: none;
  will-change: auto;
}

.holographic-tilt-card::before { opacity: 0.22; }
.holographic-tilt-card > img { transform: scale(1.025); }
```

- [ ] **Step 6: Run automated verification**

Run:

```powershell
pnpm test
pnpm lint
```

Expected: both commands PASS with no new warnings from the changed files.

- [ ] **Step 7: Commit Task 2**

```powershell
git add -- app/globals.css tests/rendered-html.test.mjs
git diff --staged --check
git commit -m "style(portfolio): add holographic depth treatment"
```

---

### Task 3: Perform interaction, responsive, and regression verification

**Files:**
- Modify only if verification reveals a defect: `app/components/HolographicTiltCard.tsx`, `app/page.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: the completed `HolographicTiltCard` component and stylesheet contract.
- Produces: a locally verified feature with recorded command outcomes and no unrelated changes.

- [ ] **Step 1: Run the complete project verification suite**

```powershell
pnpm test
pnpm lint
pnpm build
```

Expected: all three commands exit with code 0. `pnpm test` already includes a production build; the explicit final build confirms the final source state independently.

- [ ] **Step 2: Start the local site and inspect the four cards at desktop width**

Run:

```powershell
pnpm dev
```

At a desktop viewport, verify:

- exactly four enhanced cards appear in `Selected visual systems`;
- movement reaches a strong but controlled angle near card corners;
- image counter-parallax moves opposite the card;
- spectrum origin follows the pointer;
- each accent differs while the cyan-violet base remains shared;
- pointer exit returns smoothly to neutral;
- each card still navigates to its original in-page case-study anchor.

- [ ] **Step 3: Verify keyboard, mobile, and reduced-motion behavior**

Verify with browser emulation or equivalent settings:

- Tab reaches all four cards in order and shows the static focus ring;
- Enter activates the correct anchor;
- at mobile width the card does not tilt or overflow horizontally;
- coarse-pointer mode retains static spectrum/press feedback;
- reduced-motion mode has no lift, tilt, sweep tracking, or image parallax;
- the hero starfield, long case studies, Rendering Code Lab, and archive folds remain visually and functionally unchanged.

- [ ] **Step 4: If verification finds a defect, add a failing regression assertion before fixing it**

For markup or fallback defects, add a precise assertion to `tests/rendered-html.test.mjs`, run `pnpm test` to see it fail, apply the smallest fix, and rerun the full suite. Do not change unrelated sections.

- [ ] **Step 5: Commit only verification-driven fixes, if any**

If files changed during verification:

```powershell
git add -- app/components/HolographicTiltCard.tsx app/page.tsx app/globals.css tests/rendered-html.test.mjs
git diff --staged --check
git commit -m "fix(portfolio): refine holographic card fallbacks"
```

If no files changed, do not create an empty commit.

- [ ] **Step 6: Report completion without publishing**

Report the exact files changed, automated command outcomes, desktop/mobile/reduced-motion checks, commits created, and any unrelated pre-existing worktree changes left untouched. Publishing remains out of scope for this plan.
