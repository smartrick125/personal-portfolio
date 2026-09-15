/**
 * Arrow glyphs as SVG rather than text.
 *
 * iOS gives U+2197 "↗" and U+2198 "↘" emoji presentation by default, so the
 * hero CTA and every "open link" affordance rendered as a blue-tinted emoji
 * tile on iPhone instead of a hairline arrow. `font-variant-emoji: text` is
 * not supported in Safari, and the U+FE0E selector is unreliable, so the
 * arrows are drawn instead. Sized in `em`, stroked in `currentColor`: every
 * existing `font-size` / `color` rule on the wrapper keeps working.
 */
export type ArrowDirection = "down-right" | "up-right" | "up";

const paths: Record<ArrowDirection, string> = {
  "down-right": "M7 7 L17 17 M17 9.5 L17 17 L9.5 17",
  "up-right": "M7 17 L17 7 M9.5 7 L17 7 L17 14.5",
  up: "M12 19 L12 5 M6 11 L12 5 L18 11",
};

export function Arrow({ direction = "down-right" }: { direction?: ArrowDirection }) {
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[direction]} />
    </svg>
  );
}
