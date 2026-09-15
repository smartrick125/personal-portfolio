"use client";

import { useEffect, useRef, useState } from "react";
import { HolographicTiltCard } from "./components/HolographicTiltCard";
import { ProjectLab } from "./components/project-lab/ProjectLab";
import { projectCatalog } from "./projectCatalog";
import { archiveTracks, codeStudies, renderingRepo } from "./renderingCatalog";

const copy = {
  en: {
    nav: ["Profile", "Work", "Approach", "Contact"],
    available: "Open to internships · campus · full-time roles",
    role: "Technical Artist",
    intro:
      "Exploring how AI, art, and code can shape expressive real-time experiences.",
    introNote: "Currently building a foundation in Unity, shaders, C#, and real-time rendering.",
    viewWork: "Explore selected work",
    focusLabel: "Current focus",
    focus: ["Unity", "Shaders", "C# Tooling", "AI × TA"],
    profileEyebrow: "01 / Profile",
    profileTitle: "Building the bridge between visual ideas and real-time systems.",
    profileBody:
      "I’m Smartrick, an emerging Technical Artist building practical knowledge across shader development, Unity tools, and real-time rendering—while exploring where AI can make creative pipelines faster and more expressive.",
    statusTitle: "Opportunity status",
    statusBody: "Available for internships, campus recruitment, and full-time opportunities.",
    learn: "Learning",
    practice: "Practising",
    explore: "Exploring",
    workEyebrow: "02 / Selected practice",
    workTitle: "See the result first. Then explore how it works.",
    workBody:
      "Selected Unity studies presented as clear visual stories: final result, implementation logic, node structure, and code where it exists.",
    workTracks: ["Node-based VFX", "Rendering Code Lab"],
    visualTrack: "Shader Graph / Visual VFX",
    visualTrackBody: "Four complete visual case studies, organized by their original Unity folders.",
    codeEyebrow: "Handwritten Shaders / URP Pipeline",
    codeTitle: "Rendering Code Lab",
    codeBody:
      "Selected studies from my public Unity-Shader learning archive. These cases show how I connect ShaderLab and HLSL with C#, Renderer Features, RenderGraph, and runtime rendering systems.",
    codeLearningNote: "Learning archive · implementations and adaptations",
    mediaPlaceholder: "IMAGE / VIDEO PLACEHOLDER",
    flowLabel: "Implementation flow",
    snippetLabel: "Core logic",
    viewRepo: "View full GitHub repository",
    archiveEyebrow: "Full learning archive",
    archiveTitle: "Beyond the four featured cases.",
    archiveBody:
      "The repository also records the wider learning path from lighting fundamentals to URP custom rendering. Expand a track to browse every chapter.",
    openChapter: "Open chapter",
    placeholder: "Unity practice · Complete",
    videoLabel: "Result footage",
    galleryLabel: "Visual details",
    logicLabel: "Implementation logic",
    nodesLabel: "Node modules",
    scriptLabel: "C# source",
    summaryLabel: "Technical summary",
    scrollHint: "Scroll through case study",
    projects: [
      {
        title: "Full Skill Effect",
        subtitle: "Charge · Beam · Hit · Explosion",
        description:
          "A complete sci-fi skill sequence driven by C#, coordinating charge-up, beam fade-in, impact pulse, explosion radius, dissolve, and emission timing.",
        tags: ["Unity 6", "Shader Graph", "C# Sequence"],
        logic: [
          "Split the skill into charge, beam, hit, and explosion materials so every stage can be tuned independently.",
          "Use a C# timeline to trigger each phase and write radius, dissolve, emission, and opacity values into the materials.",
          "Keep the visual hand-off continuous: the charge releases into the beam, the hit pulse marks contact, and the explosion resolves the sequence.",
        ],
        nodes: [
          ["Charge shader", "Builds the pre-fire energy with an animated emissive mask."],
          ["Hit shader", "Creates a short contact pulse at the target point."],
          ["Explosion shader", "Combines expanding radius, dissolve, and emission for the final beat."],
        ],
      },
      {
        title: "Interactive Energy Shield",
        subtitle: "Fresnel shell and click-driven ripples",
        description:
          "An energy shield combining Fresnel edges, layered patterns, core veins, noise distortion, and two alternating impact slots controlled by raycast input.",
        tags: ["Shader Graph", "C#", "Raycast"],
        logic: [
          "Construct the shield surface from a Fresnel shell, panel pattern, core veins, and controlled distortion.",
          "Raycast from the pointer into the shield and pass the local hit position plus start time to the material.",
          "Alternate between two impact slots so a second ripple can begin before the previous one has fully faded.",
        ],
        nodes: [
          ["Graph overview", "The complete shield graph and its layered material flow."],
          ["Fresnel shell", "Separates the bright outer rim from the softer inner core."],
          ["Ripple distortion", "Breaks up the circular impact wave with animated noise."],
        ],
      },
      {
        title: "Energy Beam",
        subtitle: "Flow, distortion, clipping, and glow",
        description:
          "A real-time beam effect built from animated UV flow, distortion, core and glow layers, start/end clipping, and hit-point highlighting.",
        tags: ["Shader Graph", "UV Flow", "VFX"],
        logic: [
          "Scroll and distort the beam UVs to create directional energy instead of a static texture.",
          "Separate the concentrated core from the wider glow so brightness and softness can be authored independently.",
          "Clip the beam at both ends, then add start and hit highlights to visually anchor it in the scene.",
        ],
        nodes: [
          ["Graph overview", "Shows the complete data flow from animated UVs to final alpha and emission."],
          ["Flow and distortion", "Combines panning UVs and noise to generate directional motion."],
          ["Clipping and falloff", "Controls beam length and softens its vertical silhouette."],
        ],
      },
      {
        title: "Stylized Dissolve Fire",
        subtitle: "Procedural edge emission",
        description:
          "A stylized fire and dissolve study using UV-based masks, animated breakup, layered base color, and emissive edge treatment.",
        tags: ["Dissolve", "Emission", "Material"],
        logic: [
          "Build a stable UV-space mask, then introduce animated breakup so the dissolve edge feels organic.",
          "Use the dissolve threshold to separate visible surface, transition band, and removed pixels.",
          "Layer base color with a narrow emissive edge so the material reads as burning rather than simply disappearing.",
        ],
        nodes: [
          ["Graph overview", "The complete dissolve graph from UV preparation to surface output."],
          ["UV module", "Prepares the coordinates used by the animated breakup masks."],
          ["Emission edge", "Extracts the transition band and turns it into the bright fire rim."],
        ],
      },
    ],
    approachEyebrow: "03 / Approach",
    approachTitle: "Art sets the intent. Code makes it real. AI expands the search space.",
    approachBody:
      "I’m early in the journey, so the portfolio focuses on process: what I tried, what broke, what I learned, and how I would improve the result.",
    pillars: [
      ["ART", "Observe form, color, motion, and visual hierarchy."],
      ["CODE", "Turn an idea into a repeatable real-time system."],
      ["AI", "Use new tools to explore faster—without hiding the craft."],
    ],
    contactEyebrow: "04 / Contact",
    contactTitle: "Let’s build the next frame.",
    contactBody:
      "Open to opportunities in Technical Art and real-time graphics.",
    github: "github.com/smartrick125",
    resume: "Résumé · coming soon",
    contact: "ke4773613@gmail.com",
    footer: "Designed as a portfolio in progress",
    stage: "Phase 02 — Case studies",
  },
} as const;

const statusLabels = {
  en: ["Learning", "Practising", "Exploring"],
} as const;

const projectHighlights = [
  {
    promise: "One timeline. Four visual beats.",
    metric: "04",
    metricLabel: "VFX stages",
  },
  {
    promise: "A shield that remembers every hit.",
    metric: "02",
    metricLabel: "Ripple slots",
  },
  {
    promise: "Flow, distortion, and glow in one beam.",
    metric: "10",
    metricLabel: "Node studies",
  },
  {
    promise: "A dissolve edge that reads as fire.",
    metric: "04",
    metricLabel: "Core modules",
  },
] as const;

const projectHighlightAccents = [
  { name: "skill", color: "#7c6cff" },
  { name: "shield", color: "#63e6ff" },
  { name: "beam", color: "#4ca6ff" },
  { name: "fire", color: "#ff7b9d" },
] as const;

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  hue: number;
};

function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let running = false;
    let onScreen = true;
    let pageVisible = !document.hidden;

    const seedStars = () => {
      const count = Math.max(90, Math.min(260, Math.round((width * height) / 6200)));
      stars = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        radius: index % 17 === 0 ? 1.8 + Math.random() * 1.2 : 0.45 + Math.random() * 1.15,
        alpha: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.74 ? 275 : 198 + Math.random() * 24,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
      if (!running) draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      if (pointer.active) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 260);
        glow.addColorStop(0, "rgba(105, 214, 255, 0.12)");
        glow.addColorStop(0.45, "rgba(112, 90, 255, 0.055)");
        glow.addColorStop(1, "rgba(10, 12, 34, 0)");
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);
      }

      for (const star of stars) {
        if (!reduceMotion) {
          star.x += star.vx;
          star.y += star.vy;

          if (pointer.active) {
            const dx = star.x - pointer.x;
            const dy = star.y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 1 && distance < 230) {
              const force = (1 - distance / 230) * 0.7;
              star.x += (dx / distance) * force;
              star.y += (dy / distance) * force;
              star.x += (-dy / distance) * force * 0.34;
              star.y += (dx / distance) * force * 0.34;
            }
          }

          if (star.x < -8) star.x = width + 8;
          if (star.x > width + 8) star.x = -8;
          if (star.y < -8) star.y = height + 8;
          if (star.y > height + 8) star.y = -8;
        }

        const twinkle = 0.62 + Math.sin(frame * 0.018 + star.phase) * 0.38;
        const distance = pointer.active ? Math.hypot(star.x - pointer.x, star.y - pointer.y) : 999;
        const proximity = Math.max(0, 1 - distance / 210);
        const radius = star.radius + proximity * 1.3;
        const alpha = Math.min(1, star.alpha * twinkle + proximity * 0.45);

        if (proximity > 0.33) {
          context.beginPath();
          context.moveTo(star.x, star.y);
          context.lineTo(pointer.x, pointer.y);
          context.strokeStyle = `hsla(${star.hue}, 92%, 76%, ${proximity * 0.13})`;
          context.lineWidth = 0.45;
          context.stroke();
        }

        context.beginPath();
        context.arc(star.x, star.y, radius, 0, Math.PI * 2);
        context.fillStyle = `hsla(${star.hue}, 96%, 82%, ${alpha})`;
        context.shadowColor = `hsla(${star.hue}, 100%, 72%, ${0.72 + proximity * 0.28})`;
        context.shadowBlur = radius > 1.5 ? 12 + proximity * 18 : 4 + proximity * 10;
        context.fill();
      }

      context.shadowBlur = 0;
      if (running) {
        frame += 1;
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    // The hero canvas is one screen tall on a very long page: stop burning frames
    // once it scrolls away or the tab goes to the background.
    const sync = () => {
      const shouldRun = !reduceMotion && onScreen && pageVisible;
      if (shouldRun === running) return;
      running = shouldRun;
      if (shouldRun) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      sync();
    };

    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    resize();
    visibility.observe(canvas);
    sync();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      visibility.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />;
}

export default function Home() {
  const text = copy.en;
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const labProjects = text.projects.map((project, index) => ({
    ...projectCatalog[index],
    title: project.title,
    description: project.description,
    tags: project.tags,
    logic: project.logic,
    promise: projectHighlights[index].promise,
    metric: projectHighlights[index].metric,
    metricLabel: projectHighlights[index].metricLabel,
    accentName: projectHighlightAccents[index].name,
    accentColor: projectHighlightAccents[index].color,
  }));

  const activateProject = (index: number) => {
    setActiveProjectIndex(index);
    requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("project-lab")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    const onPointerMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      root.style.setProperty("--mx", `${(event.clientX / window.innerWidth - 0.5) * 2}`);
      root.style.setProperty("--my", `${(event.clientY / window.innerHeight - 0.5) * 2}`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal], [data-section-reveal]").forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(element);
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <main className="site">
      <nav className="topbar" aria-label="Primary navigation">
        <div className="nav-center">
          <a href="#profile">Profile</a>
          <a href="#work">Work</a>
          <details className="archive-menu">
            <summary>Archive <span aria-hidden="true">⌄</span></summary>
            <div className="archive-mega">
              <div className="archive-mega-intro">
                <small>2026 — ONGOING</small>
                <strong>A growing technical-art archive.</strong>
                <p>One expandable home for the work, notes, and experiments I will keep building over the next year.</p>
                <a href="#learning-archive">See the current archive</a>
              </div>
              <div className="archive-mega-column">
                <small>ACTIVE TRACKS</small>
                <a href="#visual-vfx"><span>01</span><strong>Shader Graph / VFX</strong><b>4 cases</b></a>
                <a href="#rendering-code"><span>02</span><strong>Rendering Code Lab</strong><b>4 studies</b></a>
                <a href="#learning-archive"><span>03</span><strong>Learning Archive</strong><b>3 tracks</b></a>
              </div>
              <div className="archive-mega-column archive-mega-future">
                <small>NEXT TO GROW</small>
                <div><span>04</span><strong>Tools & Pipeline</strong><b>Planned</b></div>
                <div><span>05</span><strong>AI × TA Experiments</strong><b>Planned</b></div>
                <div><span>06</span><strong>Breakdown Notes</strong><b>Planned</b></div>
              </div>
            </div>
          </details>
          <a href="#approach">Approach</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="sky-scene" aria-hidden="true">
          <div className="sky-aurora sky-aurora-one" />
          <div className="sky-aurora sky-aurora-two" />
          <div className="star-field" />
          <StarfieldCanvas />
          <div className="stellar-cloud stellar-cloud-one" />
          <div className="stellar-cloud stellar-cloud-two" />
          <div className="horizon-grid" />
        </div>

        <div className="hero-content shell">
          <div className="availability">
            <span className="pulse" />
            {text.available}
          </div>

          <div className="hero-title-wrap">
            <p className="hero-index">PORTFOLIO / 2026</p>
            <h1>SMARTRICK</h1>
            <div className="hero-role-row">
              <span>{text.role}</span>
              <span className="role-line" />
              <span>REAL-TIME GRAPHICS</span>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-copy">
              <p>{text.intro}</p>
              <small>{text.introNote}</small>
            </div>
            <a className="primary-cta" href="#work">
              <span>{text.viewWork}</span>
              <b aria-hidden="true">↘</b>
            </a>
          </div>
        </div>

      </section>

      <section className="focus-strip" aria-label={text.focusLabel}>
        <div className="focus-track">
          <span className="focus-label">{text.focusLabel}</span>
          {text.focus.map((item, index) => (
            <div className="focus-item" key={item}>
              <b>0{index + 1}</b>
              <span>{item}</span>
              <i>✦</i>
            </div>
          ))}
        </div>
      </section>

      <section className="profile section shell" id="profile">
        <div className="section-heading" data-reveal>
          <p>{text.profileEyebrow}</p>
          <span>ABOUT</span>
        </div>
        <div className="profile-grid">
          <figure className="profile-portrait portrait-photo" data-reveal>
            <img
              src="/profile/smartrick-portrait.jpg"
              alt="Portrait of Smartrick"
              width={800}
              height={1422}
              decoding="async"
              fetchPriority="low"
              loading="lazy"
            />
            <figcaption>
              <span>SMARTRICK / 2026</span>
              <small>TECHNICAL ART</small>
            </figcaption>
          </figure>
          <div className="profile-copy" data-reveal>
            <h2>{text.profileTitle}</h2>
            <p>{text.profileBody}</p>
            <div className="profile-status">
              <div>
                <small>{text.statusTitle}</small>
                <p>{text.statusBody}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="skill-matrix" data-reveal>
          {text.focus.map((item, index) => (
            <div className="skill-row" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
              <div className="skill-line"><i style={{ width: `${42 + index * 11}%` }} /></div>
              <small>{statusLabels.en[index % 3]}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell">
          <div className="section-heading section-heading-light" data-reveal>
            <p>{text.workEyebrow}</p>
            <span>WORK</span>
          </div>
          <div className="work-intro" data-reveal>
            <h2>{text.workTitle}</h2>
            <p>{text.workBody}</p>
          </div>
          <section className="project-highlights" aria-labelledby="project-highlights-title" data-reveal>
            <header className="highlights-heading">
              <div>
                <p>GET THE HIGHLIGHTS</p>
                <h3 id="project-highlights-title">Selected visual systems.</h3>
              </div>
              <span>Choose a case to explore the full breakdown.</span>
            </header>
            <div className="highlight-scroll">
              {text.projects.map((project, index) => {
                const assets = projectCatalog[index];
                const highlight = projectHighlights[index];
                const accent = projectHighlightAccents[index];
                return (
                  <HolographicTiltCard
                    href="#project-lab"
                    accent={accent.color}
                    accentName={accent.name}
                    key={project.title}
                    onClick={(event) => {
                      event.preventDefault();
                      activateProject(index);
                    }}
                  >
                    <img
                      src={assets.gallery[0]?.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="highlight-shade" aria-hidden="true" />
                    <div className="highlight-topline">
                      <span>0{index + 1}</span>
                      <span>{project.tags[0]}</span>
                    </div>
                    <div className="highlight-copy">
                      <p>{project.title}</p>
                      <h4>{highlight.promise}</h4>
                    </div>
                    <div className="highlight-proof">
                      <strong>{highlight.metric}</strong>
                      <span>{highlight.metricLabel}</span>
                    </div>
                    <b aria-hidden="true">↘</b>
                  </HolographicTiltCard>
                );
              })}
            </div>
          </section>
          <nav className="work-track-nav" aria-label="Work type navigation" data-reveal>
            <a href="#visual-vfx">
              <span>01</span>
              <strong>{text.workTracks[0]}</strong>
              <small>SHADER GRAPH</small>
            </a>
            <a href="#rendering-code">
              <span>02</span>
              <strong>{text.workTracks[1]}</strong>
              <small>HLSL + C# + URP</small>
            </a>
          </nav>
          <div className="track-heading" id="visual-vfx" data-reveal>
            <p>TRACK 01 / NODE-BASED VFX</p>
            <div>
              <h3>{text.visualTrack}</h3>
              <span>{text.visualTrackBody}</span>
            </div>
          </div>
          <ProjectLab
            projects={labProjects}
            activeProjectIndex={activeProjectIndex}
            onProjectChange={setActiveProjectIndex}
          />

          <section className="rendering-lab" id="rendering-code" data-section-reveal>
            <div className="section-divider" aria-hidden="true" />
            <header className="rendering-lab-header" data-reveal>
              <div>
                <p>TRACK 02 / {text.codeEyebrow}</p>
                <h2>{text.codeTitle}</h2>
              </div>
              <div>
                <p>{text.codeBody}</p>
                <span>{text.codeLearningNote}</span>
                <a href={renderingRepo} target="_blank" rel="noreferrer">
                  {text.viewRepo} ↗
                </a>
              </div>
            </header>

            <div className="code-study-list">
              {codeStudies.map((study, index) => (
                <article className="code-study" id={study.id} key={study.id} data-section-reveal>
                  <div className="section-divider" aria-hidden="true" />
                  <header className="code-study-header" data-reveal>
                    <span>0{index + 1}</span>
                    <div>
                      <p>{study.category.en}</p>
                      <h3>{study.title.en}</h3>
                    </div>
                    <p>{study.description.en}</p>
                  </header>

                  {study.comparison ? (
                    <figure className="code-comparison" data-reveal>
                      <div className="comparison-frame">
                        <img src={study.comparison.before.src} alt={study.comparison.before.alt.en} loading="lazy" decoding="async" />
                        <span>{study.comparison.before.label.en}</span>
                      </div>
                      <div className="comparison-frame">
                        <img src={study.comparison.after.src} alt={study.comparison.after.alt.en} loading="lazy" decoding="async" />
                        <span>{study.comparison.after.label.en}</span>
                      </div>
                      <figcaption>
                        <p>{study.mediaNote.en}</p>
                      </figcaption>
                    </figure>
                  ) : (
                    <figure className="code-media" data-reveal>
                      <img src={study.media.src} alt={study.media.alt.en} loading="lazy" decoding="async" />
                      <figcaption>
                        <p>{study.mediaNote.en}</p>
                      </figcaption>
                    </figure>
                  )}

                  <div className="code-study-details">
                    <section className="code-flow" data-reveal>
                      <div className="code-block-label">
                        <span>{text.flowLabel}</span>
                      </div>
                      <ol>
                        {study.flow.map((step, stepIndex) => (
                          <li key={step.en}>
                            <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                            <p>{step.en}</p>
                          </li>
                        ))}
                      </ol>
                    </section>

                    <section className="code-snippet" data-reveal>
                      <div className="code-block-label">
                        <span>{text.snippetLabel}</span>
                      </div>
                      <pre><code>{study.snippet}</code></pre>
                    </section>

                    <section className="code-sources" data-reveal>
                      <div className="code-block-label">
                        <span>View code</span>
                      </div>
                      <div className="source-links">
                        {study.files.map((file) => (
                          <a href={file.url} target="_blank" rel="noreferrer" key={file.url}>
                            <span>{file.kind}</span>
                            <strong>{file.name}</strong>
                            <b>↗</b>
                          </a>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="project-tags code-tags" data-reveal>
                    {study.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>

            <section className="learning-archive" id="learning-archive" data-reveal data-section-reveal>
              <div className="section-divider" aria-hidden="true" />
              <header>
                <p>{text.archiveEyebrow}</p>
                <h3>{text.archiveTitle}</h3>
                <span>{text.archiveBody}</span>
              </header>
              <div className="archive-tracks">
                {archiveTracks.map((track, index) => (
                  <details key={track.title.en} open={index === 0}>
                    <summary>
                      <span>0{index + 1}</span>
                      <div>
                        <strong>{track.title.en}</strong>
                        <small>{track.subtitle.en}</small>
                      </div>
                      <b aria-hidden="true">+</b>
                    </summary>
                    <div className="archive-chapters">
                      {track.chapters.map((chapter) => (
                        <a href={chapter.url} target="_blank" rel="noreferrer" key={chapter.name}>
                          <div>
                            <strong>{chapter.name}</strong>
                            <p>{chapter.topics.en}</p>
                          </div>
                          <span>{text.openChapter} ↗</span>
                        </a>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </section>
        </div>
      </section>

      <section className="approach section shell" id="approach">
        <div className="section-heading" data-reveal>
          <p>{text.approachEyebrow}</p>
          <span>PROCESS</span>
        </div>
        <div className="approach-intro" data-reveal>
          <h2>{text.approachTitle}</h2>
          <p>{text.approachBody}</p>
        </div>
        <div className="pillar-grid">
          {text.pillars.map(([title, body], index) => (
            <article className="pillar" key={title} data-reveal>
              <span>0{index + 1}</span>
              <div className="pillar-symbol" aria-hidden="true">{["◯", "△", "✦"][index]}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="shell">
          <div className="section-heading section-heading-light" data-reveal>
            <p>{text.contactEyebrow}</p>
            <span>CONTACT</span>
          </div>
          <div className="contact-content" data-reveal>
            <p>{text.contactBody}</p>
            <h2>{text.contactTitle}</h2>
          </div>
          <div className="contact-links" data-reveal>
            <a href="mailto:ke4773613@gmail.com">
              <small>DIRECT CONTACT</small>
              <strong>Email</strong>
              <span>ke4773613@gmail.com</span>
              <b>↗</b>
            </a>
            <a href="https://github.com/smartrick125" target="_blank" rel="noreferrer">
              <small>TECHNICAL PROFILE</small>
              <strong>GitHub</strong>
              <span>@smartrick125</span>
              <b>↗</b>
            </a>
            <span className="social-placeholder">
              <small>PERSONAL LIFE ACCOUNT</small>
              <strong>Douyin</strong>
              <span>@ww2024260424</span>
              <b>—</b>
            </span>
            <span>
              <small>CAREER DOCUMENT</small>
              <strong>Résumé</strong>
              <span>Coming soon</span>
              <b>—</b>
            </span>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <span>© 2026 SMARTRICK</span>
        <span>{text.footer}</span>
        <span>{text.stage}</span>
        <a href="#top">TOP ↑</a>
      </footer>
    </main>
  );
}
