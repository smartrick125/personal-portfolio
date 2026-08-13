"use client";

import {
  type CSSProperties,
  type MouseEventHandler,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type AccentName = "skill" | "shield" | "beam" | "fire";

type HolographicTiltCardProps = {
  href: string;
  accent: string;
  accentName: AccentName;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type CardProperties = CSSProperties & {
  "--tilt-x": string;
  "--tilt-y": string;
  "--shine-x": string;
  "--shine-y": string;
  "--parallax-x": string;
  "--parallax-y": string;
  "--card-accent": string;
};

const neutralProperties = {
  tiltX: "0deg",
  tiltY: "0deg",
  shineX: "50%",
  shineY: "50%",
  parallaxX: "0px",
  parallaxY: "0px",
};

export function HolographicTiltCard({
  href,
  accent,
  accentName,
  children,
  className = "",
  onClick,
}: HolographicTiltCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef({ x: 0, y: 0 });

  const setVariables = (values: typeof neutralProperties) => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--tilt-x", values.tiltX);
    card.style.setProperty("--tilt-y", values.tiltY);
    card.style.setProperty("--shine-x", values.shineX);
    card.style.setProperty("--shine-y", values.shineY);
    card.style.setProperty("--parallax-x", values.parallaxX);
    card.style.setProperty("--parallax-y", values.parallaxY);
  };

  const resetCard = () => setVariables(neutralProperties);

  const onPointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    pendingRef.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
    };

    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      const { x, y } = pendingRef.current;
      setVariables({
        tiltX: `${(-y * 10).toFixed(2)}deg`,
        tiltY: `${(x * 10).toFixed(2)}deg`,
        shineX: `${((x + 1) * 50).toFixed(2)}%`,
        shineY: `${((y + 1) * 50).toFixed(2)}%`,
        parallaxX: `${(-x * 8).toFixed(2)}px`,
        parallaxY: `${(-y * 8).toFixed(2)}px`,
      });
      frameRef.current = null;
    });
  };

  const onPointerLeave = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    resetCard();
  };

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const style: CardProperties = {
    "--tilt-x": neutralProperties.tiltX,
    "--tilt-y": neutralProperties.tiltY,
    "--shine-x": neutralProperties.shineX,
    "--shine-y": neutralProperties.shineY,
    "--parallax-x": neutralProperties.parallaxX,
    "--parallax-y": neutralProperties.parallaxY,
    "--card-accent": accent,
  };

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
      onPointerCancel={onPointerLeave}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
