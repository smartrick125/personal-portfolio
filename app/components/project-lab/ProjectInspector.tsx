"use client";

import { useState } from "react";
import styles from "./ProjectLab.module.css";
import type { ProjectLabProject, ProjectLabView } from "./projectLabModel";

type ProjectInspectorProps = {
  project: ProjectLabProject;
  activeView: ProjectLabView;
  mediaIndex: number;
  onMediaChange: (index: number) => void;
  onExpand: (src: string) => void;
};

function getAdjacentIndex(index: number, length: number, direction: -1 | 1) {
  if (length <= 1) return index;
  return (index + direction + length) % length;
}

export function ProjectInspector({
  project,
  activeView,
  mediaIndex,
  onMediaChange,
  onExpand,
}: ProjectInspectorProps) {
  const [activeLogicIndex, setActiveLogicIndex] = useState(0);
  const galleryItem = project.gallery[mediaIndex] ?? project.gallery[0];
  const nodeItem = project.nodes[mediaIndex] ?? project.nodes[0];

  const renderPager = (length: number) => (
    <div className={styles.mediaPager}>
      <button
        type="button"
        disabled={length <= 1}
        onClick={() => onMediaChange(getAdjacentIndex(mediaIndex, length, -1))}
      >
        Previous
      </button>
      <button
        type="button"
        disabled={length <= 1}
        onClick={() => onMediaChange(getAdjacentIndex(mediaIndex, length, 1))}
      >
        Next
      </button>
    </div>
  );

  return (
    <aside className={styles.inspector} data-project-inspector="true" aria-label="Project inspector">
      {activeView === "result" && (
        <div className={styles.inspectorSection}>
          <p>{project.description}</p>
          <ul className={styles.inspectorTags}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <p>{project.promise}</p>
          <p className={styles.projectMetric}>
            <strong>{project.metric}</strong>
            <span>{project.metricLabel}</span>
          </p>
          <details className={styles.technicalNotes}>
            <summary>Read technical notes</summary>
            {project.technicalSummary.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </details>
        </div>
      )}

      {activeView === "gallery" && galleryItem && (
        <div className={styles.inspectorSection}>
          <h3>{galleryItem.name}</h3>
          <p>{mediaIndex + 1} / {project.gallery.length}</p>
          {renderPager(project.gallery.length)}
          <div className={styles.thumbnailGrid} aria-label="Gallery images">
            {project.gallery.map((item, index) => (
              <button
                type="button"
                aria-label={`Show ${item.name}`}
                aria-current={index === mediaIndex ? "true" : undefined}
                onClick={() => onMediaChange(index)}
                key={item.src}
              >
                {/* Catalog images are static assets served directly by the Vite runtime. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeView === "logic" && (
        <div className={styles.inspectorSection}>
          <h3>Implementation logic</h3>
          <ol className={styles.logicSteps}>
            {project.logic.map((step, index) => (
              <li key={step}>
                <button
                  type="button"
                  aria-pressed={index === activeLogicIndex}
                  onClick={() => setActiveLogicIndex(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {activeView === "nodes" && nodeItem && (
        <div className={styles.inspectorSection}>
          <h3>{nodeItem.name}</h3>
          <p>{mediaIndex + 1} / {project.nodes.length}</p>
          {renderPager(project.nodes.length)}
          <button className={styles.expandButton} type="button" onClick={() => onExpand(nodeItem.src)}>
            Expand node graph
          </button>
        </div>
      )}

      {activeView === "code" && project.script && (
        <div className={styles.inspectorSection}>
          <h3>{project.script.name}</h3>
          <a href={project.script.src} target="_blank" rel="noreferrer">Open source file</a>
          <p>This code controls the active project&apos;s runtime behavior.</p>
        </div>
      )}
    </aside>
  );
}
