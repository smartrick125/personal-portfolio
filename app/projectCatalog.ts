export type MediaItem = {
  name: string;
  src: string;
};

export type LocalizedParagraphs = {
  en: string[];
  zh: string[];
};

export type TechnicalSummary = {
  name: string;
  src: string;
  paragraphs: LocalizedParagraphs;
};

export type ProjectCatalogItem = {
  id: string;
  folderName: string;
  videos: MediaItem[];
  gallery: MediaItem[];
  nodes: MediaItem[];
  script?: MediaItem;
  technicalSummary: TechnicalSummary;
};

const media = (folder: string, category: string, name: string, file: string): MediaItem => {
  const webFile = file.endsWith(".png") ? file.replace(/\.png$/, ".webp") : file;
  return {
    name,
    src: `/projects/catalog/${folder}/${category}/${webFile}`,
  };
};

export const projectCatalog: ProjectCatalogItem[] = [
  {
    id: "full-skill-effect",
    folderName: "Full_Skill_Effect",
    videos: [
      media("Full_Skill_Effect", "Video_Preview", "Full_View.mp4", "full-view.mp4"),
    ],
    gallery: [
      media("Full_Skill_Effect", "Gallery", "Detailed.png", "detailed.png"),
      media("Full_Skill_Effect", "Gallery", "Full_View.png", "full-view.png"),
    ],
    nodes: [
      media("Full_Skill_Effect", "Shader_Logic", "Energy_Charge_Shader.png", "energy-charge-shader.png"),
      media("Full_Skill_Effect", "Shader_Logic", "Energy_Explosion_Blend_Shader.png", "energy-explosion-blend-shader.png"),
      media("Full_Skill_Effect", "Shader_Logic", "Energy_Explosion_Shader.png", "energy-explosion-shader.png"),
      media("Full_Skill_Effect", "Shader_Logic", "Energy_Hit_Shader.png", "energy-hit-shader.png"),
    ],
    script: media("Full_Skill_Effect", "Script", "Full_Skill_Effect_Script.txt", "full-skill-effect-script.txt"),
    technicalSummary: {
      name: "Full_Skill_Effect_Shader.docx",
      src: "/projects/catalog/Full_Skill_Effect/Technical_Summary/full-skill-effect-shader.docx",
      paragraphs: {
        en: [
          "This project focuses on creating a complete sci-fi energy beam skill in Unity using Shader Graph and simple scripting. The effect includes four main phases: charge, beam emission, hit feedback, and explosion. Instead of building isolated effects, the goal was to design a cohesive VFX sequence with proper timing and visual continuity.",
          "The beam was constructed using layered UV-based effects, including core and glow components, combined with scrolling noise to simulate energy flow. UV manipulation was used extensively to control directional movement, start/end clipping, and vertical falloff.",
          "For the hit and explosion stages, radial masks based on distance from the UV center were used to create expanding shapes. Noise was applied to break up the edges and avoid uniform silhouettes. The explosion behavior was driven by time-based parameters to simulate expansion and fading.",
          "Alpha blending was controlled so all emission outputs are multiplied by the final alpha mask, preventing residual geometry. Overlay blending was implemented without branch nodes by combining step and lerp operations.",
          "A C# script controls timing across all phases and uses custom interpolation such as power and smoothstep functions to strengthen the feeling of energy buildup and release. Lighting and Bloom support the final presentation.",
        ],
        zh: [
          "这个项目用 Shader Graph 加少量脚本，在 Unity 里做一整套科幻能量技能，分蓄力、发射光束、命中反馈、爆炸四个阶段。重点不是把单个效果做出来，而是让这四段在时间和视觉上接得住。",
          "光束是分层搭的：核心加外层辉光，再叠一层滚动噪声当能量流。UV 这边做得比较多，方向性流动、两端裁切、纵向衰减都靠它控制。",
          "命中和爆炸用的是以 UV 中心为原点的径向遮罩，做出向外扩张的形状，边缘再叠噪声打散，避免出现太规整的圆形轮廓。爆炸的扩张和消退由时间参数驱动。",
          "Alpha 这块特意控制过：所有自发光输出都乘上最终的 alpha 遮罩，防止留下残影几何。叠加混合没有用分支节点，而是用 step 和 lerp 组合出来的。",
          "一个 C# 脚本统管四个阶段的时序，中间用了 power、smoothstep 这类自定义插值，让蓄力和释放的力度感更明显。最后靠光照和 Bloom 收尾。",
        ],
      },
    },
  },
  {
    id: "energy-shield",
    folderName: "Engergy_Shield",
    videos: [
      media("Engergy_Shield", "Video_Preview", "Closw_Up_Look.mp4", "closw-up-look.mp4"),
      media("Engergy_Shield", "Video_Preview", "Full_View.mp4", "full-view.mp4"),
      media("Engergy_Shield", "Video_Preview", "Material_Full.mp4", "material-full.mp4"),
    ],
    gallery: [
      media("Engergy_Shield", "Gallery", "Close_Up.png", "close-up.png"),
      media("Engergy_Shield", "Gallery", "Detailed_Shot.png", "detailed-shot.png"),
      media("Engergy_Shield", "Gallery", "Full_View.png", "full-view.png"),
      media("Engergy_Shield", "Gallery", "Material.png", "material.png"),
    ],
    nodes: [
      media("Engergy_Shield", "Shader_Logic", "Fresnel(Core+OuterShell).png", "fresnel-core-plus-outershell.png"),
      media("Engergy_Shield", "Shader_Logic", "Pattern+CoreVeins+PanelLayer.png", "pattern-plus-coreveins-plus-panellayer.png"),
      media("Engergy_Shield", "Shader_Logic", "RippleA.png", "ripplea.png"),
      media("Engergy_Shield", "Shader_Logic", "RippleB.png", "rippleb.png"),
      media("Engergy_Shield", "Shader_Logic", "Ripple_Electrical_Boost.png", "ripple-electrical-boost.png"),
      media("Engergy_Shield", "Shader_Logic", "Ripple_Fade.png", "ripple-fade.png"),
      media("Engergy_Shield", "Shader_Logic", "Ripple_Noise_Disetortion.png", "ripple-noise-disetortion.png"),
      media("Engergy_Shield", "Shader_Logic", "Shader_Graph_Layout.png", "shader-graph-layout.png"),
    ],
    script: media("Engergy_Shield", "Script", "Energy_Shied_Script.txt", "energy-shied-script.txt"),
    technicalSummary: {
      name: "Engergy_Shield_Shader.docx",
      src: "/projects/catalog/Engergy_Shield/Technical_Summary/engergy-shield-shader.docx",
      paragraphs: {
        en: [
          "A stylized energy shield built in Unity Shader Graph, featuring layered Fresnel glow, procedural noise animation, and interactive impact ripples.",
          "The shader combines an outer shell, core veins, and panel structure. Fresnel lighting defines the silhouette while noise and Voronoi patterns create surface energy flow.",
          "Click interaction is implemented with raycasting. World-space hit position and time are passed from C# to the material so the shader can expand and fade impact ripples in real time.",
          "Two impact slots support overlapping interactions. Shader.PropertyToID is used for efficient property access, connecting gameplay input and real-time visual feedback.",
        ],
        zh: [
          "在 Unity Shader Graph 里做的风格化能量护盾，包含分层 Fresnel 辉光、程序化噪声动画，以及可交互的冲击涟漪。",
          "Shader 由外壳、核心脉络和面板结构三层组成。Fresnel 负责勾出轮廓，噪声和 Voronoi 负责表面的能量流动。",
          "点击交互用射线实现：C# 把世界空间的命中位置和触发时间传给材质，Shader 据此实时扩张并淡出冲击涟漪。",
          "两组冲击槽支持涟漪重叠触发。属性访问用 Shader.PropertyToID 做了缓存，把玩法输入和实时视觉反馈接在一起。",
        ],
      },
    },
  },
  {
    id: "energy-beam",
    folderName: "Energy_Beam",
    videos: [
      media("Energy_Beam", "Video_Preview", "Close_UP_Look.mp4", "close-up-look.mp4"),
      media("Energy_Beam", "Video_Preview", "Full_View.mp4", "full-view.mp4"),
      media("Energy_Beam", "Video_Preview", "Material_Full.mp4", "material-full.mp4"),
    ],
    gallery: [
      media("Energy_Beam", "Gallery", "Close_Up.png", "close-up.png"),
      media("Energy_Beam", "Gallery", "Close_Up_New.png", "close-up-new.png"),
      media("Energy_Beam", "Gallery", "Detailed_Shot.png", "detailed-shot.png"),
      media("Energy_Beam", "Gallery", "Detailed_Shot_New.png", "detailed-shot-new.png"),
      media("Energy_Beam", "Gallery", "Full_View.png", "full-view.png"),
      media("Energy_Beam", "Gallery", "Full_View_New.png", "full-view-new.png"),
      media("Energy_Beam", "Gallery", "Material00.png", "material00.png"),
      media("Energy_Beam", "Gallery", "Material01.png", "material01.png"),
    ],
    nodes: [
      media("Energy_Beam", "Shader_Logic", "Alpha_Blending.png", "alpha-blending.png"),
      media("Energy_Beam", "Shader_Logic", "Beam_Core_And_Glow.png", "beam-core-and-glow.png"),
      media("Energy_Beam", "Shader_Logic", "Core_Concentration.png", "core-concentration.png"),
      media("Energy_Beam", "Shader_Logic", "Fature_Overview.png", "fature-overview.png"),
      media("Energy_Beam", "Shader_Logic", "Flow_UV_And_Distortion.png", "flow-uv-and-distortion.png"),
      media("Energy_Beam", "Shader_Logic", "Glow_Concentration.png", "glow-concentration.png"),
      media("Energy_Beam", "Shader_Logic", "Hit_Point_Highlighting.png", "hit-point-highlighting.png"),
      media("Energy_Beam", "Shader_Logic", "Shader_Graph_Layout.png", "shader-graph-layout.png"),
      media("Energy_Beam", "Shader_Logic", "Start-End_Clipping_And_Vertical_Falloff.png", "start-end-clipping-and-vertical-falloff.png"),
      media("Energy_Beam", "Shader_Logic", "Start_Point_Highlighting.png", "start-point-highlighting.png"),
    ],
    technicalSummary: {
      name: "Energy_Besm-Shader.docx",
      src: "/projects/catalog/Energy_Beam/Technical_Summary/energy-besm-shader.docx",
      paragraphs: {
        en: [
          "This project creates a stylized sci-fi energy beam in Unity Shader Graph with an emphasis on modular control and visual layering.",
          "The beam combines a high-intensity core, outer glow, and noise-driven distortion. UV masks control start/end clipping and vertical falloff, while flowing UVs create continuous directional motion.",
          "Origin and impact highlights improve readability. Carefully designed alpha masks create soft transitions, and emission with Bloom reinforces the final energy response.",
          "The project developed practical understanding of procedural VFX design, parameterized shader control, and real-time rendering workflows in Unity.",
        ],
        zh: [
          "在 Unity Shader Graph 里做的风格化科幻能量光束，重点放在模块化控制和视觉分层上。",
          "光束由高亮核心、外层辉光和噪声扭曲组合而成。UV 遮罩负责两端裁切和纵向衰减，流动的 UV 提供持续的方向性运动。",
          "起点和命中点都加了高亮，整体读起来更清楚。Alpha 遮罩专门调过，过渡更柔和；自发光配合 Bloom 强化最终的能量反馈。",
          "这个项目让我对程序化 VFX 的设计思路、Shader 的参数化控制，以及 Unity 里的实时渲染工作流有了更实际的理解。",
        ],
      },
    },
  },
  {
    id: "dissolve-fire",
    folderName: "Stylized_Dissolve_Fire",
    videos: [
      media("Stylized_Dissolve_Fire", "Video_Preview", "Full_View.mp4", "full-view.mp4"),
      media("Stylized_Dissolve_Fire", "Video_Preview", "Material_Full_View.mp4", "material-full-view.mp4"),
    ],
    gallery: [
      media("Stylized_Dissolve_Fire", "Gallery", "Close_Up.png", "close-up.png"),
      media("Stylized_Dissolve_Fire", "Gallery", "Detailed_Shot.png", "detailed-shot.png"),
      media("Stylized_Dissolve_Fire", "Gallery", "Dissolve_Amount_50%.png", "dissolve-amount-50-percent.png"),
      media("Stylized_Dissolve_Fire", "Gallery", "Dissolve_Amount_80%.png", "dissolve-amount-80-percent.png"),
      media("Stylized_Dissolve_Fire", "Gallery", "Full_View.png", "full-view.png"),
      media("Stylized_Dissolve_Fire", "Gallery", "Material.png", "material.png"),
    ],
    nodes: [
      media("Stylized_Dissolve_Fire", "Shader_Logic", "Base_Color.png", "base-color.png"),
      media("Stylized_Dissolve_Fire", "Shader_Logic", "Emission.png", "emission.png"),
      media("Stylized_Dissolve_Fire", "Shader_Logic", "Shader_Graph Layout.png", "shader-graph-layout.png"),
      media("Stylized_Dissolve_Fire", "Shader_Logic", "UV.png", "uv.png"),
    ],
    technicalSummary: {
      name: "Stylized_Dissolve_Fire_Shader.doc",
      src: "/projects/catalog/Stylized_Dissolve_Fire/Technical_Summary/stylized-dissolve-fire-shader.doc",
      paragraphs: {
        en: [
          "This shader implements a height-based dissolve effect combined with layered burn and emission. It is designed to simulate a stylized combustion volume inside a containment unit.",
          "Key features include height-based dissolve control, layered burn with an early-burn offset, separate core emission and outer glow, gradient color control, noise-driven edge distortion, and subtle emission flicker.",
          "The graph uses smoothstep masking, mask subtraction for edge bands, gradient sampling, noise distortion, and layered emission blending.",
        ],
        zh: [
          "这个 Shader 实现的是基于高度的溶解，配合分层燃烧和自发光，模拟容器内部一团风格化的燃烧体。",
          "主要包含这几块：基于高度的溶解控制、带提前燃烧偏移的分层燃烧、分开的核心自发光与外层辉光、渐变颜色控制、噪声驱动的边缘扭曲，以及轻微的自发光闪烁。",
          "节点图里用到 smoothstep 遮罩、遮罩相减取边缘带、渐变采样、噪声扭曲，以及分层自发光混合。",
        ],
      },
    },
  },
];
