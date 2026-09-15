"use client";

import { useEffect, useState } from "react";
import { copy, type Lang } from "../copy";

/**
 * Bottom tab bar for phones and small tablets.
 *
 * Below 960px the top bar hides its section links, which left a 14000px page
 * with no way to jump between sections. This bar restores that, and highlights
 * whichever section is crossing the middle of the viewport so the reader can
 * see where they are.
 */

const SECTIONS = ["profile", "work", "approach", "contact"] as const;

const icons: Record<(typeof SECTIONS)[number], string> = {
  // Person
  profile: "M12 11.5a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2 M4.8 20a7.2 7.2 0 0114.4 0",
  // 2x2 grid
  work: "M4 4.5h6v6H4z M14 4.5h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  // Compass
  approach: "M12 21a9 9 0 100-18 9 9 0 000 18Z M15.6 8.4l-2.2 5-5 2.2 2.2-5z",
  // Envelope
  contact: "M3.5 6.5h17v11h-17z M3.5 7.2l8.5 6.2 8.5-6.2",
};

export function MobileNav({ lang }: { lang: Lang }) {
  const text = copy[lang];
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const targets = SECTIONS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (targets.length === 0) return;

    // A thin band across the middle of the viewport: whatever crosses it wins,
    // so the highlight tracks reading position rather than section edges.
    // Two sections can straddle the band at a boundary, and a callback only
    // carries the entries that changed, so keep the full picture and always
    // resolve ties the same way — the first section in document order.
    const crossing = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => crossing.set(entry.target.id, entry.isIntersecting));
        const current = SECTIONS.find((id) => crossing.get(id));
        if (current) setActiveSection(current);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="mobile-nav" aria-label={text.mobileNavAria}>
      {SECTIONS.map((id, index) => (
        <a
          href={`#${id}`}
          key={id}
          aria-current={activeSection === id ? "true" : undefined}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d={icons[id]} />
          </svg>
          <span>{text.nav[index]}</span>
        </a>
      ))}
    </nav>
  );
}
