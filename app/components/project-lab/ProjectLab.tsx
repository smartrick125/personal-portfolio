"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./ProjectLab.module.css";
import { getAvailableViews, type ProjectLabProject, type ProjectLabView } from "./projectLabModel";
import { ProjectInspector } from "./ProjectInspector";
import { ProjectStage } from "./ProjectStage";
import { ProjectToolDock } from "./ProjectToolDock";

type ProjectLabProps = {
  projects: ProjectLabProject[];
  activeProjectIndex: number;
  onProjectChange: (index: number) => void;
};

export function ProjectLab({ projects, activeProjectIndex, onProjectChange }: ProjectLabProps) {
  const [displayedProjectIndex, setDisplayedProjectIndex] = useState(activeProjectIndex);
  const [compact, setCompact] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [activeView, setActiveView] = useState<ProjectLabView>("result");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [failedMedia, setFailedMedia] = useState<Set<string>>(() => new Set());
  const [reduceMotion, setReduceMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);
  const switchTimeoutRef = useRef<number | null>(null);
  const exitFrameRef = useRef<number | null>(null);
  const transitionFrameRef = useRef<number | null>(null);
  const displayedProject = projects[displayedProjectIndex] ?? projects[0];
  const availableViews = displayedProject ? getAvailableViews(displayedProject) : [];
  const displayedActiveView = availableViews.includes(activeView) ? activeView : "result";

  const clearScheduledSwitch = useCallback(() => {
    if (switchTimeoutRef.current !== null) {
      window.clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
    if (exitFrameRef.current !== null) {
      window.cancelAnimationFrame(exitFrameRef.current);
      exitFrameRef.current = null;
    }
    if (transitionFrameRef.current !== null) {
      window.cancelAnimationFrame(transitionFrameRef.current);
      transitionFrameRef.current = null;
    }
  }, []);

  const finishProjectSwitch = useCallback(() => {
    setCompact(false);
    setTransitioning(false);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    clearScheduledSwitch();

    if (activeProjectIndex === displayedProjectIndex) {
      transitionFrameRef.current = window.requestAnimationFrame(() => {
        transitionFrameRef.current = null;
        finishProjectSwitch();
      });
      return clearScheduledSwitch;
    }
    if (reduceMotion) {
      transitionFrameRef.current = window.requestAnimationFrame(() => {
        transitionFrameRef.current = null;
        setDisplayedProjectIndex(activeProjectIndex);
        finishProjectSwitch();
      });
      return clearScheduledSwitch;
    }

    exitFrameRef.current = window.requestAnimationFrame(() => {
      exitFrameRef.current = null;
      setTransitioning(true);
    });
    switchTimeoutRef.current = window.setTimeout(() => {
      switchTimeoutRef.current = null;
      setDisplayedProjectIndex(activeProjectIndex);
      setCompact(false);
      transitionFrameRef.current = window.requestAnimationFrame(() => {
        transitionFrameRef.current = null;
        setTransitioning(false);
      });
    }, 160);

    return clearScheduledSwitch;
  }, [activeProjectIndex, clearScheduledSwitch, displayedProjectIndex, finishProjectSwitch, reduceMotion]);

  useEffect(() => () => clearScheduledSwitch(), [clearScheduledSwitch]);

  useEffect(() => {
    // This effect is the project-boundary reset required for all coordinated lab controls.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveView("result");
    setActiveMediaIndex(0);
    setFailedMedia(new Set());
  }, [displayedProjectIndex]);

  useEffect(() => {
    if (displayedProject && !getAvailableViews(displayedProject).includes(activeView)) {
      // Catalog data can remove a view while it is active, so recover to the guaranteed Result tab.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveView("result");
      setActiveMediaIndex(0);
    }
  }, [activeView, displayedProject]);

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

  const handleViewChange = (view: ProjectLabView) => {
    setActiveView(view);
    setActiveMediaIndex(0);
  };

  const handleMediaError = (src: string) => {
    setFailedMedia((current) => {
      const next = new Set(current);
      next.add(src);
      return next;
    });
  };

  const handleExpand = (src: string) => {
    window.open(src, "_blank", "noopener,noreferrer");
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
              <ProjectStage
                project={displayedProject}
                activeView={displayedActiveView}
                mediaIndex={activeMediaIndex}
                failedMedia={failedMedia}
                compact={compact}
                onMediaError={handleMediaError}
                onExpand={handleExpand}
              />
              <ProjectToolDock
                views={availableViews}
                activeView={displayedActiveView}
                onViewChange={handleViewChange}
              />
            </div>
            <ProjectInspector
              key={displayedProject.id}
              project={displayedProject}
              activeView={displayedActiveView}
              mediaIndex={activeMediaIndex}
              compact={compact}
              onMediaChange={setActiveMediaIndex}
              onExpand={handleExpand}
            />
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
