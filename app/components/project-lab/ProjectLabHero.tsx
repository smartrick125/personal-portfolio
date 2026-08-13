"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ProjectLab.module.css";
import { getHeroMedia, type ProjectLabProject } from "./projectLabModel";

type ProjectLabHeroProps = {
  project: ProjectLabProject;
  compact: boolean;
};

export function ProjectLabHero({ project, compact }: ProjectLabHeroProps) {
  const heroRootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playRejected, setPlayRejected] = useState(false);
  const hero = getHeroMedia(project);

  const onPlayRejected = useCallback(() => {
    setPlayRejected(true);
  }, []);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(onPlayRejected);
  }, [onPlayRejected]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    void video.play().then(() => setPlayRejected(false)).catch(onPlayRejected);
    return () => video.pause();
  }, [hero?.src, onPlayRejected, project.id]);

  useEffect(() => {
    const root = heroRootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry?.isIntersecting) {
          void video.play().catch(onPlayRejected);
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [hero?.src, onPlayRejected, project.id]);

  return (
    <article
      ref={heroRootRef}
      className={styles.heroMedia}
      data-hero-mode={compact ? "compact" : "hero"}
    >
      {hero?.kind === "video" && (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={project.gallery[0]?.src}
            onPlay={() => setPlayRejected(false)}
          >
            <source src={hero.src} type="video/mp4" />
          </video>
          {playRejected && (
            <button className={styles.playButton} type="button" onClick={playVideo}>
              Play project video
            </button>
          )}
        </>
      )}

      {hero?.kind === "image" && (
        // This is a local catalog asset rendered by the Vite runtime, not a Next image route.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero.src} alt={project.title} />
      )}

      {!hero && (
        <div className={styles.emptyHero}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <ul className={styles.heroTags}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </div>
      )}
    </article>
  );
}
