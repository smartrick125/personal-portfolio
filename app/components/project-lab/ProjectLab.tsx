"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./ProjectLab.module.css";
import type { ProjectLabProject } from "./projectLabModel";
import { ProjectLabHero } from "./ProjectLabHero";

type ProjectLabProps = {
  projects: ProjectLabProject[];
  activeProjectIndex: number;
  onProjectChange: (index: number) => void;
};

export function ProjectLab({ projects, activeProjectIndex, onProjectChange }: ProjectLabProps) {
  const [displayedProjectIndex, setDisplayedProjectIndex] = useState(activeProjectIndex);
  const [compact, setCompact] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);
  const displayedProject = projects[displayedProjectIndex] ?? projects[0];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (activeProjectIndex === displayedProjectIndex) return;
    if (reduceMotion) {
      const frame = requestAnimationFrame(() => {
        setDisplayedProjectIndex(activeProjectIndex);
        setCompact(false);
      });
      return () => cancelAnimationFrame(frame);
    }

    const exitFrame = requestAnimationFrame(() => setTransitioning(true));
    const timeout = window.setTimeout(() => {
      setDisplayedProjectIndex(activeProjectIndex);
      setCompact(false);
      requestAnimationFrame(() => setTransitioning(false));
    }, 160);

    return () => {
      cancelAnimationFrame(exitFrame);
      window.clearTimeout(timeout);
    };
  }, [activeProjectIndex, displayedProjectIndex, reduceMotion]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCompact((entry?.boundingClientRect.top ?? Number.POSITIVE_INFINITY) <= window.innerHeight * 0.35);
      },
      { rootMargin: "0px 0px -65% 0px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (!displayedProject) return null;

  const handleProjectChange = (index: number) => {
    if (index === activeProjectIndex) return;
    if (!reduceMotion) setTransitioning(true);
    onProjectChange(index);
  };

  return (
    <section
      id="project-lab"
      className={styles.lab}
      data-project-lab="true"
      data-lab-phase={compact ? "compact" : "hero"}
      style={{ "--lab-accent": displayedProject.accentColor } as CSSProperties}
    >
      <div className={styles.transitionTrack}>
        <div className={styles.experience}>
          <div className={`${styles.projectContent}${transitioning ? ` ${styles.projectContentTransitioning}` : ""}`}>
            <header className={styles.header}>
              <p>PROJECT LAB / ACTIVE SYSTEM</p>
              <nav aria-label="Select project">
                {projects.map((project, index) => (
                  <button
                    type="button"
                    data-project-switch="true"
                    aria-pressed={index === activeProjectIndex}
                    onClick={() => handleProjectChange(index)}
                    key={project.id}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{project.title}</strong>
                  </button>
                ))}
              </nav>
            </header>
            <div className={styles.stageFrame}>
              <ProjectLabHero project={displayedProject} compact={compact} />
            </div>
            <div className={styles.shell}>
              <h2>{displayedProject.title}</h2>
              <p>{displayedProject.description}</p>
            </div>
          </div>
        </div>
        <div ref={sentinelRef} className={styles.phaseSentinel} aria-hidden="true" />
      </div>
      <noscript>
        <div className={styles.noScriptFallback}>
          {projects.map((project) => (
            <article key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              {[...project.videos, ...project.gallery, ...project.nodes].map((item) => (
                <a href={item.src} key={item.src}>{item.name}</a>
              ))}
              {project.script && <a href={project.script.src}>{project.script.name}</a>}
            </article>
          ))}
        </div>
      </noscript>
    </section>
  );
}
