"use client";

import { useEffect } from "react";

const INTERACTIVE = "a, button, [data-magnetic]";

/**
 * A trailing cursor ring plus a magnetic pull on opted-in targets. Mouse only:
 * a ring chasing a finger is noise on touch, and the whole thing is motion, so
 * reduced-motion users get nothing at all. The native cursor stays visible —
 * replacing it costs more in usability than the effect is worth.
 */
export function PointerFx() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const ring = document.createElement("div");
    ring.className = "pointer-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.append(ring);

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let scale = 1;
    let targetScale = 1;
    let animationFrame = 0;
    let magnet: HTMLElement | null = null;

    const clearMagnet = () => {
      if (!magnet) return;
      magnet.style.setProperty("--magnet-x", "0px");
      magnet.style.setProperty("--magnet-y", "0px");
      magnet = null;
    };

    const pullMagnet = () => {
      if (!magnet) return;
      const rect = magnet.getBoundingClientRect();
      const dx = pointerX - (rect.left + rect.width / 2);
      const dy = pointerY - (rect.top + rect.height / 2);
      // Pull is a fraction of the offset and capped, so a wide target does not
      // fly across the layout when the cursor sits near its edge.
      const limit = 16;
      magnet.style.setProperty("--magnet-x", `${Math.max(-limit, Math.min(limit, dx * 0.22))}px`);
      magnet.style.setProperty("--magnet-y", `${Math.max(-limit, Math.min(limit, dy * 0.28))}px`);
    };

    const draw = () => {
      ringX += (pointerX - ringX) * 0.18;
      ringY += (pointerY - ringY) * 0.18;
      scale += (targetScale - scale) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      pullMagnet();

      const settled =
        Math.abs(pointerX - ringX) < 0.2 &&
        Math.abs(pointerY - ringY) < 0.2 &&
        Math.abs(targetScale - scale) < 0.002;
      animationFrame = settled ? 0 : window.requestAnimationFrame(draw);
    };

    const wake = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      ring.dataset.visible = "true";

      const target = (event.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (target !== magnet) {
        clearMagnet();
        if (target?.matches("[data-magnetic]")) magnet = target;
      }

      targetScale = target ? 2.1 : 1;
      const accent = target ? getComputedStyle(target).getPropertyValue("--card-accent").trim() : "";
      ring.style.setProperty("--ring-accent", accent || "var(--cyan)");
      wake();
    };

    const onPointerLeave = () => {
      ring.dataset.visible = "false";
      targetScale = 1;
      clearMagnet();
      wake();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      clearMagnet();
      ring.remove();
    };
  }, []);

  return null;
}
