"use client";

import { useEffect } from "react";

/**
 * Magnetic pull for opted-in targets: while the cursor is over one, the element
 * leans toward it. Mouse only, and nothing at all under reduced motion.
 *
 * The cursor's own feedback is drawn inside the hero shader (see HeroBackdrop),
 * not by a DOM ring floating above the page — a ring that the nebula cannot
 * react to reads as a sticker on top of the scene.
 */
export function PointerFx() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let magnet: HTMLElement | null = null;
    let magnetRect: DOMRect | null = null;
    let hovered: Element | null = null;
    let animationFrame = 0;

    const release = () => {
      if (!magnet) return;
      magnet.style.setProperty("--magnet-x", "0px");
      magnet.style.setProperty("--magnet-y", "0px");
      magnet = null;
      magnetRect = null;
    };

    const pull = (pointerX: number, pointerY: number) => {
      if (!magnet || !magnetRect) return;
      const dx = pointerX - (magnetRect.left + magnetRect.width / 2);
      const dy = pointerY - (magnetRect.top + magnetRect.height / 2);
      // Capped so a wide target does not slide across the layout when the
      // cursor sits out near its edge.
      const limit = 16;
      magnet.style.setProperty("--magnet-x", `${Math.max(-limit, Math.min(limit, dx * 0.22))}px`);
      magnet.style.setProperty("--magnet-y", `${Math.max(-limit, Math.min(limit, dy * 0.28))}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      // Layout reads happen only when the hovered element changes: pointermove
      // fires far too often to afford getBoundingClientRect on every one.
      const target = (event.target as Element | null)?.closest?.("[data-magnetic]") ?? null;
      if (target !== hovered) {
        hovered = target;
        release();
        if (target instanceof HTMLElement) {
          magnet = target;
          magnetRect = target.getBoundingClientRect();
        }
      }

      if (!magnet || animationFrame) return;
      const { clientX, clientY } = event;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        pull(clientX, clientY);
      });
    };

    const onLayoutChange = () => {
      if (magnet) magnetRect = magnet.getBoundingClientRect();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onLayoutChange, { passive: true });
    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("blur", release);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onLayoutChange);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("blur", release);
      release();
    };
  }, []);

  return null;
}
