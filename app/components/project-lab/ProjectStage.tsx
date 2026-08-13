"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectLab.module.css";
import { ProjectLabHero } from "./ProjectLabHero";
import { getHeroMedia, type ProjectLabProject, type ProjectLabView } from "./projectLabModel";

type ProjectStageProps = {
  project: ProjectLabProject;
  activeView: ProjectLabView;
  mediaIndex: number;
  failedMedia?: ReadonlySet<string>;
  compact?: boolean;
  onMediaError: (src: string) => void;
  onExpand: (src: string) => void;
};

function ProjectCodeViewer({ src, name }: { src: string; name: string }) {
  const [loadedCode, setLoadedCode] = useState({ src: "", content: "" });

  useEffect(() => {
    let active = true;
    fetch(src)
      .then((response) => response.text())
      .then((content) => {
        if (active) setLoadedCode({ src, content });
      });
    return () => {
      active = false;
    };
  }, [src]);

  return (
    <section className={styles.codeViewer} aria-label={name}>
      <p>{name}</p>
      <pre aria-label={name} tabIndex={0}><code>{loadedCode.src === src ? loadedCode.content : ""}</code></pre>
    </section>
  );
}

export function ProjectStage({
  project,
  activeView,
  mediaIndex,
  failedMedia,
  compact = false,
  onMediaError,
  onExpand,
}: ProjectStageProps) {
  const galleryItem = project.gallery[mediaIndex] ?? project.gallery[0];
  const nodeItem = project.nodes[mediaIndex] ?? project.nodes[0];
  const resultMedia = getHeroMedia(project);
  const imageItem = activeView === "gallery" ? galleryItem : activeView === "nodes" ? nodeItem : undefined;
  const imageUnavailable = imageItem ? (failedMedia?.has(imageItem.src) ?? false) : false;
  const resultImageUnavailable = resultMedia?.kind === "image" && (failedMedia?.has(resultMedia.src) ?? false);

  return (
    <section
      id={`lab-panel-${activeView}`}
      className={styles.stage}
      data-project-stage="true"
      role="tabpanel"
      aria-labelledby={`lab-tab-${activeView}`}
    >
      <div className={styles.stageContent}>
        {(activeView === "result" || activeView === "logic") && !resultImageUnavailable && (
          <div
            className={styles.resultMedia}
            onErrorCapture={() => {
              if (resultMedia?.kind === "image") onMediaError(resultMedia.src);
            }}
          >
            <ProjectLabHero project={project} compact={compact} />
          </div>
        )}

        {(activeView === "result" || activeView === "logic") && resultImageUnavailable && (
          <div className={styles.mediaUnavailable} role="status">
            <p>This media is currently unavailable.</p>
          </div>
        )}

        {(activeView === "gallery" || activeView === "nodes") && imageItem && !imageUnavailable && (
          <figure className={activeView === "nodes" ? styles.nodeMedia : styles.galleryMedia}>
            {/* Catalog images are static assets served directly by the Vite runtime. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageItem.src}
              alt={imageItem.name}
              onError={() => onMediaError(imageItem.src)}
            />
            <figcaption>{imageItem.name}</figcaption>
            {activeView === "nodes" && (
              <button type="button" onClick={() => onExpand(imageItem.src)}>Expand</button>
            )}
          </figure>
        )}

        {(activeView === "gallery" || activeView === "nodes") && imageItem && imageUnavailable && (
          <div className={styles.mediaUnavailable} role="status">
            <p>This media is currently unavailable.</p>
          </div>
        )}

        {(activeView === "gallery" || activeView === "nodes") && !imageItem && (
          <div className={styles.mediaUnavailable} role="status">
            <p>This media is currently unavailable.</p>
          </div>
        )}

        {activeView === "code" && project.script && (
          <ProjectCodeViewer src={project.script.src} name={project.script.name} />
        )}
      </div>
    </section>
  );
}
