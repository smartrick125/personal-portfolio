"use client";

import { useEffect, useRef } from "react";

/** The stops of the title gradient this replaces, kept to the letter. */
const RAMP: Array<[number, [number, number, number]]> = [
  [0.12, [255, 255, 255]],
  [0.56, [214, 229, 255]],
  [1, [145, 170, 255]],
];

function rampColor(position: number): [number, number, number] {
  if (position <= RAMP[0][0]) return RAMP[0][1];
  for (let i = 1; i < RAMP.length; i += 1) {
    const [stop, color] = RAMP[i];
    const [previousStop, previousColor] = RAMP[i - 1];
    if (position > stop) continue;
    const t = (position - previousStop) / (stop - previousStop);
    return [
      Math.round(previousColor[0] + (color[0] - previousColor[0]) * t),
      Math.round(previousColor[1] + (color[1] - previousColor[1]) * t),
      Math.round(previousColor[2] + (color[2] - previousColor[2]) * t),
    ];
  }
  return RAMP[RAMP.length - 1][1];
}

/**
 * A per-letter entrance needs one element per letter, which rules out painting
 * the title as one clipped gradient: the clip target becomes nine atomic boxes
 * rather than glyphs, and Chromium drops text clipping inside a filtered
 * element anyway (the h1 carries a drop-shadow). That combination rendered the
 * first letter as a solid white rectangle.
 *
 * So each letter is an ordinary coloured glyph, sampled from the same ramp at
 * its own position across the word. Nine samples of a shallow ramp read as the
 * gradient they replace, with no clipping anywhere in the animated path.
 */
export function HeroTitle({ text }: { text: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const paint = () => {
      const width = title.getBoundingClientRect().width;
      if (!width) return;
      for (const letter of title.querySelectorAll<HTMLElement>("[data-letter]")) {
        const center = letter.offsetLeft + letter.offsetWidth / 2;
        const [r, g, b] = rampColor(center / width);
        letter.style.color = `rgb(${r}, ${g}, ${b})`;
      }
    };

    paint();
    // Font swap and viewport changes both move the letters.
    const observer = new ResizeObserver(paint);
    observer.observe(title);
    document.fonts?.ready.then(paint).catch(() => {});

    return () => observer.disconnect();
  }, [text]);

  return (
    // Every letter is aria-hidden so the word is not spelled out one span at a
    // time; the name comes from aria-label instead.
    <h1 ref={titleRef} className="hero-title" aria-label={text}>
      {Array.from(text).map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          data-letter
          aria-hidden="true"
          style={{ "--letter-index": index } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
}
