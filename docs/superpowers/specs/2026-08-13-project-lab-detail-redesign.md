# Project Lab Detail Redesign

## Goal

Replace the four repeated, vertically stacked project case studies with one
immersive and reusable `Project Lab`. The redesign must shorten the work
section, encourage active exploration, and strengthen the portfolio's
Technical Artist identity without hiding any existing project evidence.

## Confirmed Direction

The experience combines two approved ideas:

- A cinematic, near-fullscreen project opening.
- An interactive lab interface with a persistent result stage, bottom tool
  dock, and right-side Inspector.

Only one project is active at a time. The four existing holographic highlight
cards and a project switcher select which project appears in the lab. The four
full case-study stacks are removed from the rendered page after their content
has been migrated into the lab views.

## Experience Flow

1. The visitor selects one of the four existing holographic project cards.
2. The page navigates to the shared Project Lab and activates that project.
3. The project opens with a near-fullscreen hero using its strongest available
   media.
4. Projects with video use muted, inline, looping autoplay. Projects without
   video use the first high-quality image with restrained pointer or scroll
   parallax.
5. As the visitor continues scrolling, the hero contracts into the lab's main
   stage. The title moves into the lab header, the project switcher remains
   accessible, the tool dock appears, and the Inspector enters from the right.
6. Further exploration happens inside the stable lab viewport instead of
   adding more full-page sections.
7. Switching projects replaces the active media, accent, labels, and available
   tools in place. The page does not jump to another repeated article.

## Desktop Layout

The active lab uses a two-column layout:

- Main stage: approximately 65 percent of the available width.
- Inspector: approximately 35 percent of the available width.
- Tool dock: attached to the bottom of the lab and spanning the available
  width.
- Project switcher: located in the lab header and able to select any of the
  four projects.

The main stage is the visual anchor. The Inspector explains the active view
without replacing the result. This preserves a direct relationship between
what the visitor sees and how the effect was built.

## Tool Dock Views

The tool dock is generated from the active project's real data. Its preferred
order is:

1. `Result`
2. `Gallery`
3. `Logic`
4. `Nodes`
5. `Code`

Unavailable views are omitted rather than rendered as empty or disabled
placeholders.

### Result

- Main stage: autoplay video when available; otherwise the lead project image.
- Inspector: description, tags, proof metric, and concise project status.
- Multiple videos are selected from a compact media control without creating
  additional page sections.

### Gallery

- Main stage: image viewer preserving the original aspect ratio.
- Inspector: image name, index, and a compact thumbnail navigator.
- Previous and next controls support keyboard operation and clear disabled
  states.

### Logic

- Main stage: keeps the final result visible for reference.
- Inspector: numbered implementation steps using the existing project logic.
- Changing steps updates the highlighted explanation in the Inspector but does
  not replace the result media.

### Nodes

- Main stage: selected Shader Graph or node-module image using `object-fit:
  contain`.
- Inspector: node name, current index, and navigation between all node images.
- An `EXPAND` action opens a focused full-viewport viewer so wide node graphs
  remain legible.

### Code

- Rendered only when the project has a script or source asset.
- Main stage: code viewer with horizontal scrolling and existing source text.
- Inspector: script purpose, relevant project context, and an available source
  link.

## Transitions and Motion

The main transformation is scroll-driven:

- The near-fullscreen opening contracts into the lab stage as the visitor
  scrolls forward.
- The project title and metadata move into their stable lab positions during
  the same transition.
- The tool dock fades and rises into place.
- The Inspector enters from the right after the stage has reached its stable
  size.

View changes inside the lab use short opacity, translation, and restrained
scan-line transitions. Project changes follow an exit-update-enter sequence so
media and text never flash in mismatched states. Continuous decorative motion
is avoided.

## Mobile Behavior

At mobile widths:

- The stage occupies the top of the lab.
- The right Inspector becomes a bottom sheet.
- The tool dock becomes a horizontally scrollable, touch-sized control row.
- The complex scroll contraction is replaced by a stable fade and scale
  transition.
- Node and code views retain their dedicated fullscreen viewers.
- Pointer parallax is disabled.
- The current project remains switchable without returning to the top of the
  page.

## Data and Component Boundaries

Existing data remains authoritative:

- `projectCatalog` continues to own videos, gallery images, node images,
  scripts, and technical summaries.
- Existing project copy continues to own title, description, tags, and logic.
- Existing highlight metadata continues to own promise and proof metrics.

The implementation introduces focused units with clear ownership:

- `ProjectLab`: active-project and active-view coordination.
- `ProjectLabHero`: cinematic opening and hero-to-stage transition.
- `ProjectSwitcher`: selects one of the four project records.
- `ProjectToolDock`: renders only available views and changes the active view.
- `ProjectStage`: renders the active view's primary media or code.
- `ProjectInspector`: renders contextual description and controls.
- `ProjectMediaViewer`: reusable gallery, video, and node selection behavior.
- `ProjectFocusViewer`: accessible fullscreen node or code viewer.

The active project index, active view, and active media index are UI state.
Project content is not copied into component-local data.

## Fallback and Error Behavior

- If autoplay is blocked, the video remains visible with native or explicit
  play controls.
- If the preferred video is absent, the first gallery image becomes the hero.
- If both video and gallery media are absent, the lab presents project text and
  available logic without inventing a placeholder result.
- If a media asset fails to load, the current view reports that the asset is
  unavailable and retains navigation to other real media.
- Without client-side JavaScript, project summaries and direct media links
  remain present in a readable fallback structure.
- Internal source-folder labels, empty categories, zero-file messages, and
  placeholder aspect-ratio notices are not rendered publicly.

## Accessibility

- Project and tool controls use semantic buttons with clear selected states.
- Keyboard focus remains visible on the project switcher, tool dock, media
  controls, and fullscreen viewer.
- The fullscreen viewer traps focus while open, closes with `Escape`, and
  restores focus to its trigger.
- Video is muted by default and never autoplays with sound.
- Active-view changes provide an appropriate status announcement without
  narrating decorative motion.
- `prefers-reduced-motion: reduce` disables scroll contraction, parallax,
  scan-line sweeps, and large spatial transitions.

## Performance Boundaries

- Only the active project's lead media loads eagerly.
- Inactive project media, gallery images, nodes, and source text load on demand.
- Videos pause when the lab is outside the viewport or when their view becomes
  inactive.
- Motion uses transforms and opacity rather than layout-heavy continuous
  animation.
- The redesign adds no Three.js, GSAP, Motion, or other animation dependency.
- Only one lab instance and one set of media controls exist on the page.

## Scope

### Included

- Replace the four long Shader Graph/VFX case-study stacks with the shared lab.
- Preserve every existing real video, image, logic step, node image, script,
  summary, tag, and proof metric through the lab views.
- Connect the four holographic highlight cards to the shared active-project
  state.
- Implement desktop, mobile, keyboard, reduced-motion, and loading fallbacks.

### Excluded

- Redesigning the hero, profile, approach, contact, or holographic highlight
  cards.
- Migrating the separate Rendering Code Lab during this iteration.
- Adding new project content or inventing missing media.
- Adding background audio, WebGL, page-to-page routing, or external animation
  libraries.
- Publishing before local implementation and verification are complete.

## Verification

The redesign is ready to publish only when all of the following are verified:

1. The production build succeeds.
2. The rendered-HTML tests and lab-specific behavior tests pass.
3. ESLint reports no errors for the project.
4. All four projects activate inside the same lab without creating repeated
   long articles.
5. Each project exposes only the tools supported by its real content.
6. Existing videos, gallery images, logic, nodes, scripts, and summaries remain
   reachable.
7. The fullscreen opening transitions into the lab without layout overflow or
   mismatched media and text.
8. Video pauses when inactive and gracefully handles blocked autoplay.
9. Desktop mouse, keyboard, mobile touch, fullscreen focus behavior, and
   reduced-motion behavior are manually checked.
10. The holographic project cards and the independent Rendering Code Lab remain
    functionally unchanged.
11. After deployment, the public URL loads without sign-in, primary media
    assets respond, and the mobile layout remains usable.
