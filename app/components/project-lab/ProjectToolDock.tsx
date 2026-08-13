"use client";

import { useRef, type KeyboardEvent } from "react";
import styles from "./ProjectLab.module.css";
import type { ProjectLabView } from "./projectLabModel";

type ProjectToolDockProps = {
  views: ProjectLabView[];
  activeView: ProjectLabView;
  onViewChange: (view: ProjectLabView) => void;
};

const viewLabels: Record<ProjectLabView, string> = {
  result: "Result",
  gallery: "Gallery",
  logic: "Logic",
  nodes: "Nodes",
  code: "Code",
};

export function ProjectToolDock({ views, activeView, onViewChange }: ProjectToolDockProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowLeft") nextIndex = (index - 1 + views.length) % views.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % views.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = views.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextView = views[nextIndex];
    if (!nextView) return;

    onViewChange(nextView);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.toolDock} role="tablist" aria-label="Project lab tools">
      {views.map((view, index) => (
        <button
          id={`lab-tab-${view}`}
          role="tab"
          type="button"
          aria-selected={view === activeView}
          aria-controls="lab-panel-active"
          tabIndex={view === activeView ? 0 : -1}
          onClick={() => onViewChange(view)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          ref={(node) => {
            tabRefs.current[index] = node;
          }}
          key={view}
        >
          {viewLabels[view]}
        </button>
      ))}
    </div>
  );
}
