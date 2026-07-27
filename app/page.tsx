"use client";

import { useEffect, useState } from "react";

type Locale = "en" | "zh";

const copy = {
  en: {
    nav: ["Profile", "Work", "Approach", "Contact"],
    available: "Open to internships · campus · full-time roles",
    role: "Technical Artist",
    intro:
      "Exploring how AI, art, and code can shape expressive real-time experiences.",
    introNote: "Currently building a foundation in Unity, shaders, C#, and real-time rendering.",
    viewWork: "Explore selected work",
    location: "Tianjin, China",
    focusLabel: "Current focus",
    focus: ["Unity", "Shaders", "C# Tooling", "AI × TA"],
    profileEyebrow: "01 / Profile",
    profileTitle: "Building the bridge between visual ideas and real-time systems.",
    profileBody:
      "I’m Smartrick, an emerging Technical Artist based in Tianjin. I’m building practical knowledge across shader development, Unity tools, and real-time rendering—while exploring where AI can make creative pipelines faster and more expressive.",
    statusTitle: "Opportunity status",
    statusBody: "Available for internships, campus recruitment, and full-time opportunities.",
    learn: "Learning",
    practice: "Practising",
    explore: "Exploring",
    workEyebrow: "02 / Selected practice",
    workTitle: "Small projects. Clear thinking.",
    workBody:
      "Four case-study templates are ready. Real footage, technical breakdowns, and repositories will be added as each project is prepared.",
    placeholder: "Unity practice · Complete",
    soon: "Full case study · next phase",
    projects: [
      {
        title: "Full Skill Effect",
        subtitle: "Charge · Beam · Hit · Explosion",
        description:
          "A complete sci-fi skill sequence driven by C#, coordinating charge-up, beam fade-in, impact pulse, explosion radius, dissolve, and emission timing.",
        tags: ["Unity 6", "Shader Graph", "C# Sequence"],
      },
      {
        title: "Interactive Energy Shield",
        subtitle: "Fresnel shell and click-driven ripples",
        description:
          "An energy shield combining Fresnel edges, layered patterns, core veins, noise distortion, and two alternating impact slots controlled by raycast input.",
        tags: ["Shader Graph", "C#", "Raycast"],
      },
      {
        title: "Energy Beam",
        subtitle: "Flow, distortion, clipping, and glow",
        description:
          "A real-time beam effect built from animated UV flow, distortion, core and glow layers, start/end clipping, and hit-point highlighting.",
        tags: ["Shader Graph", "UV Flow", "VFX"],
      },
      {
        title: "Stylized Dissolve Fire",
        subtitle: "Procedural edge emission",
        description:
          "A stylized fire and dissolve study using UV-based masks, animated breakup, layered base color, and emissive edge treatment.",
        tags: ["Dissolve", "Emission", "Material"],
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
      "Based in Tianjin and open to opportunities in Technical Art and real-time graphics.",
    github: "github.com/smartrick125",
    resume: "Résumé · coming soon",
    contact: "ke4773613@gmail.com",
    footer: "Designed as a portfolio in progress",
    stage: "Phase 01 — Homepage",
  },
  zh: {
    nav: ["简介", "作品", "方法", "联系"],
    available: "接受实习 · 校招 · 社招机会",
    role: "技术美术 / TA",
    intro: "探索 AI、艺术与代码如何共同塑造更有表现力的实时体验。",
    introNote: "目前正在积累 Unity、Shader、C# 与实时渲染的实践经验。",
    viewWork: "查看实践项目",
    location: "中国 · 天津",
    focusLabel: "当前方向",
    focus: ["Unity", "Shader", "C# 工具", "AI × TA"],
    profileEyebrow: "01 / 个人简介",
    profileTitle: "连接视觉想法与实时系统。",
    profileBody:
      "我是 Smartrick，一名位于天津、正在成长中的技术美术学习者。我正在积累 Shader 开发、Unity 工具和实时渲染的实践经验，同时探索 AI 如何让创作流程更高效、更具表现力。",
    statusTitle: "求职状态",
    statusBody: "接受实习、校招和社招机会。",
    learn: "学习中",
    practice: "实践中",
    explore: "探索中",
    workEyebrow: "02 / 实践项目",
    workTitle: "项目可以小，思考要清楚。",
    workBody:
      "已经为四个案例准备好展示模板。后续会逐步加入真实录屏、技术拆解与代码仓库。",
    placeholder: "Unity 实践 · 已完成",
    soon: "完整案例 · 下一阶段",
    projects: [
      {
        title: "完整技能特效",
        subtitle: "蓄力 · 光束 · 命中 · 爆炸",
        description:
          "通过 C# 统一编排科幻技能序列，控制蓄力、光束渐入、命中脉冲、爆炸半径、溶解与自发光时间。",
        tags: ["Unity 6", "Shader Graph", "C# 时序"],
      },
      {
        title: "交互式能量护盾",
        subtitle: "Fresnel 外壳与点击涟漪",
        description:
          "结合 Fresnel、分层图案、核心脉络与噪声扭曲，并通过射线点击交替驱动两组护盾冲击涟漪。",
        tags: ["Shader Graph", "C#", "Raycast"],
      },
      {
        title: "能量光束",
        subtitle: "流动、扭曲、裁切与辉光",
        description:
          "使用 UV 流动、噪声扭曲、核心辉光、起止位置裁切和命中点高亮构建实时光束效果。",
        tags: ["Shader Graph", "UV 流动", "VFX"],
      },
      {
        title: "风格化溶解火焰",
        subtitle: "程序化边缘自发光",
        description:
          "基于 UV 遮罩、动态破碎、分层基础色与边缘自发光制作风格化火焰溶解效果。",
        tags: ["溶解", "自发光", "材质"],
      },
    ],
    approachEyebrow: "03 / 方法",
    approachTitle: "艺术确定意图，代码让它发生，AI 扩展探索空间。",
    approachBody:
      "我仍处于技术积累阶段，因此作品集会诚实呈现过程：尝试了什么、哪里失败了、学到了什么，以及下一次如何做得更好。",
    pillars: [
      ["ART", "观察形态、色彩、运动与视觉层级。"],
      ["CODE", "把想法转化为可重复的实时系统。"],
      ["AI", "借助新工具加速探索，但不隐藏基本功。"],
    ],
    contactEyebrow: "04 / 联系",
    contactTitle: "一起构建下一帧。",
    contactBody: "目前位于天津，期待技术美术与实时图形相关机会。",
    github: "github.com/smartrick125",
    resume: "个人简历 · 即将补充",
    contact: "ke4773613@gmail.com",
    footer: "一个持续成长中的作品集",
    stage: "阶段 01 — 首页",
  },
} as const;

const projectMedia = [
  {
    type: "video",
    src: "/projects/full-skill-effect.mp4",
    poster: "/projects/full-skill-effect.png",
  },
  { type: "image", src: "/projects/energy-shield.png" },
  { type: "image", src: "/projects/energy-beam.png" },
  { type: "image", src: "/projects/dissolve-fire.png" },
] as const;

const statusLabels = {
  en: ["Learning", "Practising", "Exploring"],
  zh: ["学习中", "实践中", "探索中"],
} as const;

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const text = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

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

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer.observe(element));
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const toggleLocale = () => setLocale((current) => (current === "en" ? "zh" : "en"));

  return (
    <main className="site">
      <nav className="topbar" aria-label={locale === "en" ? "Primary navigation" : "主导航"}>
        <a className="wordmark" href="#top" aria-label="Smartrick homepage">
          <span className="wordmark-glyph">S</span>
          <span>SMARTRICK</span>
        </a>
        <div className="nav-center">
          {text.nav.map((item, index) => (
            <a key={item} href={["#profile", "#work", "#approach", "#contact"][index]}>
              {item}
            </a>
          ))}
        </div>
        <button className="language-toggle" type="button" onClick={toggleLocale} aria-label="Switch language">
          <span className={locale === "en" ? "active" : ""}>EN</span>
          <i />
          <span className={locale === "zh" ? "active" : ""}>中</span>
        </button>
      </nav>

      <section className="hero" id="top">
        <div className="sky-scene" aria-hidden="true">
          <div className="sky-aurora sky-aurora-one" />
          <div className="sky-aurora sky-aurora-two" />
          <div className="star-field" />
          <div className="render-stage">
            <div className="render-ring ring-one" />
            <div className="render-ring ring-two" />
            <div className="shader-core">
              <div className="shader-glow" />
              <div className="shader-grid" />
            </div>
            <span className="render-label">WEBGL SCENE / PHASE 03</span>
          </div>
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
              <span>{text.location}</span>
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

        <div className="scroll-cue" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <i />
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
          <span>ABOUT / 关于</span>
        </div>
        <div className="profile-grid">
          <div className="profile-portrait placeholder-portrait" data-reveal>
            <div className="portrait-orbit" />
            <span>PORTRAIT</span>
            <small>{locale === "en" ? "Placeholder" : "头像占位"}</small>
          </div>
          <div className="profile-copy" data-reveal>
            <h2>{text.profileTitle}</h2>
            <p>{text.profileBody}</p>
            <div className="profile-status">
              <div>
                <small>{text.statusTitle}</small>
                <p>{text.statusBody}</p>
              </div>
              <span>{text.location}</span>
            </div>
          </div>
        </div>
        <div className="skill-matrix" data-reveal>
          {text.focus.map((item, index) => (
            <div className="skill-row" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
              <div className="skill-line"><i style={{ width: `${42 + index * 11}%` }} /></div>
              <small>{statusLabels[locale][index % 3]}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell">
          <div className="section-heading section-heading-light" data-reveal>
            <p>{text.workEyebrow}</p>
            <span>WORK / 作品</span>
          </div>
          <div className="work-intro" data-reveal>
            <h2>{text.workTitle}</h2>
            <p>{text.workBody}</p>
          </div>
          <div className="project-grid">
            {text.projects.map((project, index) => {
              const media = projectMedia[index];
              return (
              <article className={`project-card ${index === 0 ? "featured" : ""}`} key={project.title} data-reveal>
                <div className={`project-visual visual-${index + 1}`}>
                  {media.type === "video" ? (
                    <video
                      className="project-media"
                      controls
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={media.poster}
                    >
                      <source src={media.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      className="project-media"
                      src={media.src}
                      alt={`${project.title} Unity preview`}
                      loading="lazy"
                    />
                  )}
                  <div className="visual-grid" />
                  <span className="project-number">0{index + 1}</span>
                  <small>{text.placeholder}</small>
                </div>
                <div className="project-info">
                  <p>{project.subtitle}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="project-soon">
                    <span>{text.soon}</span>
                    <b aria-hidden="true">↗</b>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="approach section shell" id="approach">
        <div className="section-heading" data-reveal>
          <p>{text.approachEyebrow}</p>
          <span>PROCESS / 方法</span>
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
            <span>CONTACT / 联系</span>
          </div>
          <div className="contact-content" data-reveal>
            <p>{text.contactBody}</p>
            <h2>{text.contactTitle}</h2>
          </div>
          <div className="contact-links" data-reveal>
            <a href="https://github.com/smartrick125" target="_blank" rel="noreferrer">
              {text.github}<b>↗</b>
            </a>
            <span>{text.resume}<b>↗</b></span>
            <a href="mailto:ke4773613@gmail.com">
              {text.contact}<b>↗</b>
            </a>
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
