"use client";

import { useEffect, useRef } from "react";

/**
 * The title gradient runs across the whole word, but a per-letter entrance
 * needs one element per letter — and each of those would otherwise restart the
 * gradient at its own left edge. So every letter paints the full-width gradient
 * and shifts it back by its own offset, which stitches the slices into one
 * continuous ramp again.
 */
export function HeroTitle({ text }: { text: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const align = () => {
      const width = title.getBoundingClientRect().width;
      title.style.setProperty("--title-width", `${width}px`);
      for (const letter of title.querySelectorAll<HTMLElement>("[data-letter]")) {
        letter.style.setProperty("--letter-offset", `${letter.offsetLeft}px`);
      }
    };

    align();
    // Font swap and viewport changes both move the letters.
    const observer = new ResizeObserver(align);
    observer.observe(title);
    document.fonts?.ready.then(align).catch(() => {});

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
