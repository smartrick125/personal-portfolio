# Holographic Project Cards Design

## Goal

Strengthen the Technical Artist identity of the portfolio by adding a bold,
stylized interaction to the four cards in the `Selected visual systems`
section. The interaction must make the project index feel more expressive
without reducing the readability of the long case studies below it.

## Approved Direction

- Apply the effect only to the four top-level project highlight cards.
- Use strong magnetic depth with a maximum pointer-driven tilt of roughly
  8–10 degrees.
- Use a holographic spectrum treatment: cyan, violet, and pink iridescent
  light with a glass-like sweep.
- Keep a shared cyan-violet spectrum across all cards, then add one project
  accent color per card.
- Keep the current cold-white outer page and blue-violet starfield content
  modules unchanged.
- Implement the behavior with native React event handling and CSS custom
  properties. Do not add Motion, GSAP, OGL, Three.js, or a React Bits runtime
  dependency.

## Interaction Design

### Desktop pointer behavior

1. Pointer entry lifts the card by approximately 8 px and strengthens its
   shadow.
2. Pointer movement is normalized around the card center and converted into
   `rotateX` and `rotateY`, capped at approximately 8–10 degrees.
3. The image layer moves slightly against the card rotation to produce clear
   foreground/background separation.
4. A holographic highlight follows the pointer using CSS custom properties for
   its origin.
5. Pointer exit smoothly returns rotation, translation, and highlight position
   to their neutral state.
6. Clicking the card continues to navigate to the existing in-page project
   anchor.

### Color behavior

Every card shares the same cyan-violet-pink spectrum layer. A small per-project
accent differentiates the cards without breaking the site palette:

- Full Skill Effect: violet-blue.
- Interactive Energy Shield: cyan.
- Energy Beam: electric blue.
- Stylized Dissolve Fire: orange-pink.

The accent affects edge glow and a restrained secondary gradient. It does not
recolor the project image.

### Keyboard, touch, and reduced motion

- Keyboard focus shows a static holographic border and clear focus ring. It
  does not simulate pointer tilt.
- Touch and coarse-pointer devices disable pointer-following rotation. Cards
  retain the spectrum border, project accent, subtle scale/press feedback, and
  their existing link behavior.
- `prefers-reduced-motion: reduce` disables tilt, lift, sweep, and image
  parallax. The card remains a static, readable project link.
- If client-side JavaScript does not run, the original anchor layout remains
  usable.

## Component Architecture

Create one focused client component, `HolographicTiltCard`, responsible only
for interaction state and presentation variables.

### Responsibilities

- Render or wrap the existing project highlight anchor content.
- Read pointer position relative to its own bounds.
- Coalesce pointer updates through `requestAnimationFrame`.
- Set CSS custom properties for rotation, highlight origin, parallax, and
  project accent.
- Reset state on pointer leave and clean up any scheduled animation frame on
  unmount.

### Non-responsibilities

- It does not own project data.
- It does not change project ordering, labels, descriptions, proof counts, or
  target anchors.
- It does not affect long case-study articles, Rendering Code Lab cards,
  navigation, the hero starfield, or archive folds.

Project content continues to come from the existing catalog and copy objects.
The four highlight entries supply only an accent identifier or color to the
component.

## Styling Structure

The existing highlight-card styling remains the baseline and gains isolated
layers:

1. Card transform layer for perspective, lift, and shadow.
2. Project image layer for counter-parallax and a restrained scale increase.
3. Holographic spectrum pseudo-element for pointer-following sheen.
4. Accent edge layer for the per-project color.
5. Existing shade and text layers above the effects to preserve contrast.

CSS custom properties provide the interface between React and CSS, including
rotation, highlight coordinates, parallax offsets, and accent color. The
effect must not introduce layout shifts or horizontal overflow.

## Performance Boundaries

- Only four cards receive pointer listeners.
- Pointer updates are batched through one animation frame per card.
- Animate transforms and opacity rather than layout properties.
- Avoid per-card canvas, WebGL contexts, large blur radii, and continuous idle
  animation.
- The holographic sweep is reactive while interacting, not an always-running
  animation.
- Coarse-pointer and reduced-motion modes skip the expensive interaction path.

## Error and Fallback Behavior

- Missing pointer capability produces the static/touch presentation.
- A cancelled or pending animation frame is cleared when the component
  unmounts.
- Missing accent data falls back to the shared violet accent.
- The anchor content and destination remain present regardless of animation
  state.

## Verification

The implementation is complete when all of the following pass:

1. Production build succeeds.
2. Existing rendered-HTML test succeeds.
3. ESLint succeeds for the changed files or project.
4. Desktop testing confirms entry, strong pointer following, image
   counter-parallax, sheen tracking, smooth reset, and correct anchor
   navigation.
5. Mobile-width testing confirms no pointer tilt, no horizontal overflow, and
   usable tap targets.
6. Keyboard testing confirms visible focus and working activation.
7. Reduced-motion testing confirms a static card without lift, tilt, sweep, or
   image parallax.
8. The four long case studies, Rendering Code Lab, hero animation, and all
   project content remain unchanged.

## Out of Scope

- WebGL or shader-based card surfaces.
- Adding animation to every image or case-study module.
- Page transitions, cursor trails, background replacement, or audio.
- Changing project copy, assets, ordering, or navigation targets.
- Publishing the implementation before local verification is complete.
