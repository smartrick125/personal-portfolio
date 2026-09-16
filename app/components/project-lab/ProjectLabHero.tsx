"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { copy, type Lang } from "../../copy";
import styles from "./ProjectLab.module.css";
import { getHeroMedia, type ProjectLabMedia, type ProjectLabProject } from "./projectLabModel";

type ProjectLabHeroProps = {
  lang: Lang;
  project: ProjectLabProject;
  compact: boolean;
  media?: ProjectLabMedia | null;
  onMediaError?: (src: string) => void;
};

export function ProjectLabHero({ lang, project, compact, media, onMediaError }: ProjectLabHeroProps) {
  const labels = copy[lang].lab;
  const heroRootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [playRejected, setPlayRejected] = useState(false);
  // autoPlay makes the browser fetch and decode the clip the moment the element
  // has a src, even though the lab sits a long way below the fold — 641KB of a
  // 1.2MB first load, decoded on loop, for something nobody can see yet. The
  // src is withheld until the stage is near the viewport.
  // Derived rather than stored: when the hero source changes this goes false on
  // its own. Holding it in state meant an effect had to reset it on every
  // project switch, which cost an extra render pass each time.
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [imageParallaxEnabled, setImageParallaxEnabled] = useState(
    () => typeof window !== "undefined"
      && !window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches,
  );
  const hero = media === undefined ? getHeroMedia(project) : media;
  const heroSrc = hero?.src;
  const videoReady = readySrc !== null && readySrc === heroSrc;
  const markVideoReady = useCallback(() => {
    if (heroSrc) setReadySrc(heroSrc);
  }, [heroSrc]);

  const onPlayRejected = useCallback(() => {
    setPlayRejected(true);
  }, []);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(onPlayRejected);
  }, [onPlayRejected]);

  const resetImageParallax = useCallback((event?: PointerEvent<HTMLImageElement>) => {
    const image = event?.currentTarget ?? imageRef.current;
    image?.style.setProperty("--image-parallax-x", "0px");
    image?.style.setProperty("--image-parallax-y", "0px");
  }, []);

  const onImagePointerMove = useCallback((event: PointerEvent<HTMLImageElement>) => {
    if (!imageParallaxEnabled) return;

    const image = event.currentTarget;
    const bounds = image.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    image.style.setProperty("--image-parallax-x", `${offsetX.toFixed(2)}px`);
    image.style.setProperty("--image-parallax-y", `${offsetY.toFixed(2)}px`);
  }, [imageParallaxEnabled]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady) return;

    void video.play().then(() => setPlayRejected(false)).catch(onPlayRejected);
    return () => video.pause();
  }, [heroSrc, onPlayRejected, project.id, videoReady]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");
    const sync = () => setImageParallaxEnabled(!query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!imageParallaxEnabled) resetImageParallax();
  }, [heroSrc, imageParallaxEnabled, resetImageParallax]);

  useEffect(() => {
    const root = heroRootRef.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) {
      // No observer means no way to tell when the stage arrives, so fall back
      // to the old behaviour rather than a clip that never loads. This runs at
      // most once, in a browser that cannot reach this page in a usable state
      // anyway (the reveal animations in page.tsx require the same API), so the
      // cascading render the rule guards against is not a concern here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      markVideoReady();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // First crossing hands the element its src; the effect above starts
          // playback once React has actually set it.
          markVideoReady();
          const video = videoRef.current;
          if (video?.currentSrc) void video.play().catch(onPlayRejected);
        } else {
          videoRef.current?.pause();
        }
      },
      // Start fetching a little before it scrolls in, so it is not blank on
      // arrival.
      { threshold: 0.2, rootMargin: "300px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [heroSrc, markVideoReady, onPlayRejected, project.id]);

  return (
    <article
      ref={heroRootRef}
      className={styles.heroMedia}
      onPointerDown={markVideoReady}
      data-hero-mode={compact ? "compact" : "hero"}
    >
      {hero?.kind === "video" && (
        <>
          <video
            key={hero.src}
            ref={videoRef}
            src={videoReady ? hero.src : undefined}
            autoPlay
            muted
            loop
            playsInline
            preload={videoReady ? "metadata" : "none"}
            poster={project.gallery[0]?.previewSrc ?? project.gallery[0]?.src}
            onPlay={() => setPlayRejected(false)}
            onError={() => onMediaError?.(hero.src)}
          />
          {playRejected && (
            <button className={styles.playButton} type="button" onClick={playVideo}>
              {labels.playVideo}
            </button>
          )}
        </>
      )}

      {hero?.kind === "image" && (
        // This is a local catalog asset rendered by the Vite runtime, not a Next image route.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imageRef}
          className={styles.heroParallaxImage}
          data-parallax={imageParallaxEnabled ? "active" : "disabled"}
          src={hero.src}
          srcSet={hero.srcSet}
          sizes="(max-width: 760px) 100vw, 62vw"
          alt={project.title}
          onPointerMove={onImagePointerMove}
          onPointerLeave={resetImageParallax}
          onPointerCancel={resetImageParallax}
          onError={() => onMediaError?.(hero.src)}
        />
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
