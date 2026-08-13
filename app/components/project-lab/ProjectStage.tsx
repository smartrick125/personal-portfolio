"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectLab.module.css";
import { ProjectLabHero } from "./ProjectLabHero";
import type { ProjectLabMedia, ProjectLabProject, ProjectLabView } from "./projectLabModel";

type ProjectStageProps = {
  project: ProjectLabProject;
  activeView: ProjectLabView;
  mediaIndex: number;
  failedMedia?: ReadonlySet<string>;
  compact?: boolean;
  onMediaError: (src: string) => void;
  onExpand: (kind: "node" | "code", trigger: HTMLButtonElement) => void;
  onCodeSourceChange: (source: ProjectCodeSource) => void;
};

export type ProjectCodeSource = {
  src: string;
  status: "loading" | "ready" | "error";
  content: string;
};

type ProjectCodeViewerProps = {
  src: string;
  name: string;
  onExpand: ProjectStageProps["onExpand"];
  onCodeSourceChange: ProjectStageProps["onCodeSourceChange"];
};

function ProjectCodeViewer({ src, name, onExpand, onCodeSourceChange }: ProjectCodeViewerProps) {
  const [loadedCode, setLoadedCode] = useState<{
    src: string;
    status: "ready" | "error";
    content: string;
  }>({ src: "", status: "ready", content: "" });

  useEffect(() => {
    let active = true;
    onCodeSourceChange({ src, status: "loading", content: "" });
    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load source: ${response.status}`);
        return response.text();
      })
      .then((content) => {
        if (active) {
          const source = { src, status: "ready" as const, content };
          setLoadedCode(source);
          onCodeSourceChange(source);
        }
      })
      .catch(() => {
        if (active) {
          const source = { src, status: "error" as const, content: "" };
          setLoadedCode(source);
          onCodeSourceChange(source);
        }
      });
    return () => {
      active = false;
    };
  }, [onCodeSourceChange, src]);

  const status = loadedCode.src === src ? loadedCode.status : "loading";

  return (
    <section className={styles.codeViewer} aria-label={name}>
      <header className={styles.codeViewerHeader}>
        <p>{name}</p>
        <button type="button" onClick={(event) => onExpand("code", event.currentTarget)}>
          Expand
        </button>
      </header>
      {status === "error" ? (
        <p className={styles.mediaUnavailable} role="status">This source file is currently unavailable.</p>
      ) : (
        <pre aria-label={name} aria-busy={status === "loading"} tabIndex={0}>
          <code>{status === "ready" ? loadedCode.content : ""}</code>
        </pre>
      )}
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
  onCodeSourceChange,
}: ProjectStageProps) {
  const galleryItem = project.gallery[mediaIndex] ?? project.gallery[0];
  const nodeItem = project.nodes[mediaIndex] ?? project.nodes[0];
  const resultVideo = project.videos[mediaIndex] ?? project.videos[0];
  const resultVideoUnavailable = resultVideo ? (failedMedia?.has(resultVideo.src) ?? false) : false;
  const resultImage = project.gallery.find((item) => !(failedMedia?.has(item.src) ?? false));
  const resultMedia: ProjectLabMedia | null = resultVideo && !resultVideoUnavailable
    ? { ...resultVideo, kind: "video" }
    : resultImage
      ? { ...resultImage, kind: "image" }
      : null;
  const imageItem = activeView === "gallery" ? galleryItem : activeView === "nodes" ? nodeItem : undefined;
  const imageUnavailable = imageItem ? (failedMedia?.has(imageItem.src) ?? false) : false;

  return (
    <section
      id="lab-panel-active"
      className={styles.stage}
      data-project-stage="true"
      role="tabpanel"
      aria-labelledby={`lab-tab-${activeView}`}
    >
      <div className={styles.stageContent}>
        {(activeView === "result" || activeView === "logic") && (
          <div className={styles.resultMedia}>
            <ProjectLabHero
              project={project}
              compact={compact}
              media={resultMedia}
              onMediaError={onMediaError}
            />
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
              <button type="button" onClick={(event) => onExpand("node", event.currentTarget)}>Expand</button>
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
          <ProjectCodeViewer
            src={project.script.src}
            name={project.script.name}
            onExpand={onExpand}
            onCodeSourceChange={onCodeSourceChange}
          />
        )}
      </div>
    </section>
  );
}
