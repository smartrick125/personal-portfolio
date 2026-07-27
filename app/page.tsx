"use client";

import { useEffect, useRef, useState } from "react";
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
    workTitle: "Four projects. One continuous walkthrough.",
    workBody:
      "A complete archive of the four Unity practice folders. Every video, gallery image, Shader Graph capture, available script, and technical summary is grouped by its original folder.",
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
    sourceLabel: "Source files",
    snippetLabel: "Core logic",
    viewRepo: "View full GitHub repository",
    archiveEyebrow: "Full learning archive",
    archiveTitle: "Beyond the four featured cases.",
    archiveBody:
      "The repository also records the wider learning path from lighting fundamentals to URP custom rendering. Expand a track to browse every chapter.",
    openChapter: "Open chapter",
    placeholder: "Unity practice · Complete",
    folderLabel: "Source folder",
    videoLabel: "Result footage",
    galleryLabel: "Visual details",
    logicLabel: "Implementation logic",
    nodesLabel: "Node modules",
    scriptLabel: "C# source",
    summaryLabel: "Technical summary",
    originalFile: "Open original file",
    noScript: "No separate Script folder in this project.",
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
      "Based in Tianjin and open to opportunities in Technical Art and real-time graphics.",
    github: "github.com/smartrick125",
    resume: "Résumé · coming soon",
    contact: "ke4773613@gmail.com",
    footer: "Designed as a portfolio in progress",
    stage: "Phase 02 — Case studies",
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
    workTitle: "四个项目，一次连续的案例浏览。",
    workBody:
      "完整展示四个 Unity 实践文件夹：所有视频、Gallery 截图、Shader Graph 节点图，以及已有的 Script 与 Technical_Summary 内容都按原文件夹分类呈现。",
    workTracks: ["节点式视觉特效", "渲染代码实验室"],
    visualTrack: "Shader Graph / 视觉特效",
    visualTrackBody: "四个完整视觉案例，按原始 Unity 文件夹分类展示。",
    codeEyebrow: "手写 Shader / URP 渲染管线",
    codeTitle: "渲染代码实验室",
    codeBody:
      "从公开 Unity-Shader 学习仓库中选出的代表案例，展示我如何把 ShaderLab、HLSL 与 C#、Renderer Feature、RenderGraph 和运行时渲染系统连接起来。",
    codeLearningNote: "学习归档 · 实现与改编练习",
    mediaPlaceholder: "图片 / 视频展示位",
    flowLabel: "实现流程",
    sourceLabel: "源码文件",
    snippetLabel: "核心逻辑",
    viewRepo: "查看完整 GitHub 仓库",
    archiveEyebrow: "完整学习归档",
    archiveTitle: "四个精选案例之外。",
    archiveBody:
      "仓库还记录了从基础光照到 URP 自定义渲染的完整学习路径。展开分类即可浏览每个章节。",
    openChapter: "打开章节",
    placeholder: "Unity 实践 · 已完成",
    folderLabel: "源文件夹",
    videoLabel: "效果录屏",
    galleryLabel: "效果细节",
    logicLabel: "实现逻辑",
    nodesLabel: "节点模块",
    scriptLabel: "C# 源码",
    summaryLabel: "技术总结",
    originalFile: "打开原始文件",
    noScript: "该项目没有单独的 Script 文件夹。",
    scrollHint: "继续滚动查看案例",
    projects: [
      {
        title: "完整技能特效",
        subtitle: "蓄力 · 光束 · 命中 · 爆炸",
        description:
          "通过 C# 统一编排科幻技能序列，控制蓄力、光束渐入、命中脉冲、爆炸半径、溶解与自发光时间。",
        tags: ["Unity 6", "Shader Graph", "C# 时序"],
        logic: [
          "把技能拆分为蓄力、光束、命中和爆炸四套材质，让每个阶段都能独立调节。",
          "使用 C# 时间序列触发各阶段，并持续写入半径、溶解、自发光和透明度参数。",
          "保证视觉衔接连续：蓄力释放为光束，命中脉冲标记接触点，最后由爆炸完成收束。",
        ],
        nodes: [
          ["蓄力 Shader", "通过动态自发光遮罩构建发射前的能量积累。"],
          ["命中 Shader", "在目标点生成短促清晰的接触脉冲。"],
          ["爆炸 Shader", "组合扩张半径、溶解与自发光，形成技能的最终节拍。"],
        ],
      },
      {
        title: "交互式能量护盾",
        subtitle: "Fresnel 外壳与点击涟漪",
        description:
          "结合 Fresnel、分层图案、核心脉络与噪声扭曲，并通过射线点击交替驱动两组护盾冲击涟漪。",
        tags: ["Shader Graph", "C#", "Raycast"],
        logic: [
          "使用 Fresnel 外壳、面板图案、核心脉络和噪声扭曲共同构建护盾表面。",
          "从指针位置向护盾发射射线，把局部命中坐标与开始时间传入材质。",
          "交替使用两组冲击槽，让第二次涟漪可以在上一轮完全消失前继续触发。",
        ],
        nodes: [
          ["完整节点图", "展示护盾各层材质模块的整体数据流。"],
          ["Fresnel 外壳", "分离明亮外轮廓和更柔和的内部核心。"],
          ["涟漪扭曲", "使用动态噪声打散规则圆形冲击波。"],
        ],
      },
      {
        title: "能量光束",
        subtitle: "流动、扭曲、裁切与辉光",
        description:
          "使用 UV 流动、噪声扭曲、核心辉光、起止位置裁切和命中点高亮构建实时光束效果。",
        tags: ["Shader Graph", "UV 流动", "VFX"],
        logic: [
          "让光束 UV 定向滚动并叠加扭曲，避免能量纹理看起来静止。",
          "把高亮核心与外层辉光分开计算，使亮度和柔和范围可以独立控制。",
          "在两端裁切光束，并添加起点与命中点高亮，让它在场景中具有明确连接关系。",
        ],
        nodes: [
          ["完整节点图", "展示从动态 UV 到最终透明度与自发光的完整数据流。"],
          ["流动与扭曲", "组合平移 UV 与噪声，形成具有方向性的能量运动。"],
          ["裁切与衰减", "控制光束长度，并柔化垂直方向的轮廓。"],
        ],
      },
      {
        title: "风格化溶解火焰",
        subtitle: "程序化边缘自发光",
        description:
          "基于 UV 遮罩、动态破碎、分层基础色与边缘自发光制作风格化火焰溶解效果。",
        tags: ["溶解", "自发光", "材质"],
        logic: [
          "先建立稳定的 UV 空间遮罩，再加入动态破碎，让溶解边缘更自然。",
          "使用溶解阈值划分保留表面、过渡边缘和被裁切区域。",
          "将基础色与窄范围自发光边缘叠加，使材质更像燃烧，而不是简单消失。",
        ],
        nodes: [
          ["完整节点图", "展示从 UV 准备到材质表面输出的完整溶解流程。"],
          ["UV 模块", "准备动态破碎遮罩所使用的坐标。"],
          ["自发光边缘", "提取溶解过渡带并形成明亮的火焰边缘。"],
        ],
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
    stage: "阶段 02 — 项目案例",
  },
} as const;

const statusLabels = {
  en: ["Learning", "Practising", "Exploring"],
  zh: ["学习中", "实践中", "探索中"],
} as const;

function CodeViewer({ src, name }: { src: string; name: string }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    let active = true;
    fetch(src)
      .then((response) => response.text())
      .then((content) => {
        if (active) setCode(content);
      });
    return () => {
      active = false;
    };
  }, [src]);

  return (
    <details className="source-panel">
      <summary>
        <span>{name}</span>
        <b aria-hidden="true">＋</b>
      </summary>
      <pre><code>{code}</code></pre>
    </details>
  );
}

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
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 260);
      glow.addColorStop(0, pointer.active ? "rgba(105, 214, 255, 0.12)" : "rgba(105, 214, 255, 0)");
      glow.addColorStop(0.45, pointer.active ? "rgba(112, 90, 255, 0.055)" : "rgba(112, 90, 255, 0)");
      glow.addColorStop(1, "rgba(10, 12, 34, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

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
      if (!reduceMotion) {
        frame += 1;
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

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
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />;
}

export default function Home() {
  const text = copy.en;

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

  return (
    <main className="site">
      <nav className="topbar" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Smartrick homepage">
          <span className="wordmark-glyph">S</span>
          <span>SMARTRICK</span>
        </a>
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
          <span>ABOUT</span>
        </div>
        <div className="profile-grid">
          <figure className="profile-portrait portrait-photo" data-reveal>
            <img
              src="/profile/smartrick-portrait.jpg"
              alt="Portrait of Smartrick"
            />
            <figcaption>
              <span>SMARTRICK / 2026</span>
              <small>{text.location}</small>
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
          <nav className="project-index" aria-label="Project quick navigation">
            {text.projects.map((project, index) => (
              <a href={`#${projectCatalog[index].id}`} key={project.title}>
                <span>0{index + 1}</span>
                <strong>{projectCatalog[index].folderName}</strong>
              </a>
            ))}
          </nav>
          <div className="case-study-list">
            {text.projects.map((project, index) => {
              const assets = projectCatalog[index];
              return (
                <article className="case-study" id={assets.id} key={project.title}>
                  <header className="case-header" data-reveal>
                    <div className="case-number">0{index + 1}</div>
                    <div>
                      <p>{project.subtitle}</p>
                      <h3>{project.title}</h3>
                    </div>
                    <div className="case-summary">
                      <p>{project.description}</p>
                      <div className="project-tags">
                        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                  </header>

                  <div className="folder-banner" data-reveal>
                    <small>{text.folderLabel}</small>
                    <code>{assets.folderName}</code>
                    <span>{assets.videos.length + assets.gallery.length + assets.nodes.length + (assets.script ? 1 : 0) + 1} FILES</span>
                  </div>

                  <section className="case-block case-video" aria-labelledby={`${assets.id}-video`} data-reveal>
                    <div className="case-label">
                      <span id={`${assets.id}-video`}><b>Video_Preview</b> / {text.videoLabel}</span>
                      <small>{assets.videos.length.toString().padStart(2, "0")} FILES · {text.scrollHint}</small>
                    </div>
                    <div className="media-scroll video-scroll">
                      {assets.videos.map((video, videoIndex) => (
                        <figure className="case-video-frame" key={video.src}>
                          <video controls loop muted playsInline preload="metadata" poster={assets.gallery[0]?.src}>
                            <source src={video.src} type="video/mp4" />
                          </video>
                          <figcaption>{video.name}</figcaption>
                          <span className="media-corner">VIDEO / {String(videoIndex + 1).padStart(2, "0")}</span>
                        </figure>
                      ))}
                    </div>
                  </section>

                  <section className="case-block" aria-labelledby={`${assets.id}-gallery`} data-reveal>
                    <div className="case-label">
                      <span id={`${assets.id}-gallery`}><b>Gallery</b> / {text.galleryLabel}</span>
                      <small>{assets.gallery.length.toString().padStart(2, "0")} FILES</small>
                    </div>
                    <div className="media-scroll gallery-scroll">
                      {assets.gallery.map((item, mediaIndex) => (
                        <figure key={item.src}>
                          <img
                            src={item.src}
                            alt={`${project.title} result frame ${mediaIndex + 1}`}
                            loading="lazy"
                          />
                          <figcaption>{item.name}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>

                  <section className="case-block" aria-labelledby={`${assets.id}-logic`} data-reveal>
                    <div className="case-label">
                      <span id={`${assets.id}-logic`}>{text.logicLabel}</span>
                      <small>BREAKDOWN</small>
                    </div>
                    <ol className="logic-grid">
                      {project.logic.map((item, logicIndex) => (
                        <li key={item}>
                          <span>{String(logicIndex + 1).padStart(2, "0")}</span>
                          <p>{item}</p>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="case-block case-nodes" aria-labelledby={`${assets.id}-nodes`} data-reveal>
                    <div className="case-label">
                      <span id={`${assets.id}-nodes`}><b>Shader_Logic</b> / {text.nodesLabel}</span>
                      <small>{assets.nodes.length.toString().padStart(2, "0")} FILES</small>
                    </div>
                    <div className="media-scroll node-scroll">
                      {assets.nodes.map((item, nodeIndex) => (
                        <figure key={item.src}>
                          <div className="node-image">
                            <img
                              src={item.src}
                              alt={`${project.title} ${item.name}`}
                              loading="lazy"
                            />
                          </div>
                          <figcaption>
                            <span>{String(nodeIndex + 1).padStart(2, "0")}</span>
                            <div>
                              <strong>{item.name}</strong>
                              <p>Shader Graph / {assets.folderName}</p>
                            </div>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>

                  <section className="case-block" aria-labelledby={`${assets.id}-script`} data-reveal>
                    <div className="case-label">
                      <span id={`${assets.id}-script`}><b>Script</b> / {text.scriptLabel}</span>
                      <small>{assets.script ? "01 FILE" : "00 FILES"}</small>
                    </div>
                    {assets.script ? (
                      <CodeViewer src={assets.script.src} name={assets.script.name} />
                    ) : (
                      <div className="empty-folder">{text.noScript}</div>
                    )}
                  </section>

                  <section className="case-block" aria-labelledby={`${assets.id}-summary`} data-reveal>
                    <div className="case-label">
                      <span id={`${assets.id}-summary`}><b>Technical_Summary</b> / {text.summaryLabel}</span>
                      <small>01 FILE</small>
                    </div>
                    <div className="technical-summary">
                      <div className="summary-file">
                        <span>{assets.technicalSummary.name}</span>
                        <a href={assets.technicalSummary.src}>{text.originalFile} ↗</a>
                      </div>
                      <div className="summary-copy">
                        {assets.technicalSummary.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </section>
                </article>
              );
            })}
          </div>

          <section className="rendering-lab" id="rendering-code">
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
                <article className="code-study" id={study.id} key={study.id}>
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
                        <img src={study.comparison.before.src} alt={study.comparison.before.alt.en} loading="lazy" />
                        <span>{study.comparison.before.label.en}</span>
                      </div>
                      <div className="comparison-frame">
                        <img src={study.comparison.after.src} alt={study.comparison.after.alt.en} loading="lazy" />
                        <span>{study.comparison.after.label.en}</span>
                      </div>
                      <figcaption>
                        <strong>{study.media.source.en}</strong>
                        <p>{study.mediaNote.en}</p>
                      </figcaption>
                    </figure>
                  ) : (
                    <figure className="code-media" data-reveal>
                      <img src={study.media.src} alt={study.media.alt.en} loading="lazy" />
                      <figcaption>
                        <strong>{study.media.source.en}</strong>
                        <p>{study.mediaNote.en}</p>
                      </figcaption>
                    </figure>
                  )}

                  <div className="code-study-details">
                    <section className="code-flow" data-reveal>
                      <div className="code-block-label">
                        <span>{text.flowLabel}</span>
                        <small>PIPELINE</small>
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
                        <small>CODE EXCERPT</small>
                      </div>
                      <pre><code>{study.snippet}</code></pre>
                    </section>

                    <section className="code-sources" data-reveal>
                      <div className="code-block-label">
                        <span>{text.sourceLabel}</span>
                        <small>{String(study.files.length).padStart(2, "0")} FILES</small>
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

            <section className="learning-archive" id="learning-archive" data-reveal>
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
            <a href="https://github.com/smartrick125" target="_blank" rel="noreferrer">
              {text.github}<b>↗</b>
            </a>
            <span>{text.resume}<b>↗</b></span>
            <span className="social-placeholder">
              <span>
                <strong>Douyin / China TikTok</strong>
                <small>Personal life account · @ww2024260424</small>
              </span>
              <b>↗</b>
            </span>
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
