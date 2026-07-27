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
    placeholder: "Case study in preparation",
    soon: "Details coming soon",
    projects: [
      {
        title: "Shader & Material Study",
        subtitle: "Surface language and lighting experiments",
        description: "A home for material studies, stylized shading, and small rendering experiments.",
        tags: ["ShaderLab", "HLSL", "URP"],
      },
      {
        title: "Procedural Sky Study",
        subtitle: "Atmosphere, depth, and motion",
        description: "A visual study of procedural skies, gradients, clouds, and real-time atmosphere.",
        tags: ["Real-time", "Atmosphere", "VFX"],
      },
      {
        title: "C# Art Tool",
        subtitle: "Turning repeated steps into tools",
        description: "A future case study for editor tooling and small pipeline improvements in Unity.",
        tags: ["C#", "Unity Editor", "Workflow"],
      },
      {
        title: "AI × TA Workflow",
        subtitle: "Experiments in assisted creation",
        description: "Exploring responsible ways AI can support iteration, prototyping, and technical art.",
        tags: ["AI", "Pipeline", "Prototype"],
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
    github: "GitHub profile · URL pending",
    resume: "Résumé · coming soon",
    contact: "Contact details · coming soon",
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
    placeholder: "案例整理中",
    soon: "详情即将补充",
    projects: [
      {
        title: "Shader 与材质练习",
        subtitle: "表面表现与光照实验",
        description: "用于沉淀材质研究、风格化着色与小型渲染实验。",
        tags: ["ShaderLab", "HLSL", "URP"],
      },
      {
        title: "程序化天空练习",
        subtitle: "氛围、纵深与运动",
        description: "围绕程序化天空、渐变、云层和实时氛围进行视觉练习。",
        tags: ["实时渲染", "大气", "VFX"],
      },
      {
        title: "C# 美术工具",
        subtitle: "把重复步骤变成工具",
        description: "未来用于展示 Unity 编辑器工具与小型流程优化实践。",
        tags: ["C#", "Unity Editor", "工作流"],
      },
      {
        title: "AI × TA 工作流",
        subtitle: "辅助创作流程实验",
        description: "探索 AI 如何合理支持迭代、原型制作与技术美术工作。",
        tags: ["AI", "流程", "原型"],
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
    github: "GitHub 主页 · 链接待补充",
    resume: "个人简历 · 即将补充",
    contact: "联系方式 · 即将补充",
    footer: "一个持续成长中的作品集",
    stage: "阶段 01 — 首页",
  },
} as const;

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
            {text.projects.map((project, index) => (
              <article className="project-card" key={project.title} data-reveal>
                <div className={`project-visual visual-${index + 1}`}>
                  <div className="visual-grid" />
                  <div className="visual-object">
                    <i />
                    <i />
                    <i />
                  </div>
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
            ))}
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
            <span>{text.github}<b>↗</b></span>
            <span>{text.resume}<b>↗</b></span>
            <span>{text.contact}<b>↗</b></span>
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
