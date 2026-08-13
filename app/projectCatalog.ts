export type MediaItem = {
  name: string;
  src: string;
};

export type TechnicalSummary = {
  name: string;
  src: string;
  paragraphs: string[];
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
      paragraphs: [
        "This project focuses on creating a complete sci-fi energy beam skill in Unity using Shader Graph and simple scripting. The effect includes four main phases: charge, beam emission, hit feedback, and explosion. Instead of building isolated effects, the goal was to design a cohesive VFX sequence with proper timing and visual continuity.",
        "The beam was constructed using layered UV-based effects, including core and glow components, combined with scrolling noise to simulate energy flow. UV manipulation was used extensively to control directional movement, start/end clipping, and vertical falloff.",
        "For the hit and explosion stages, radial masks based on distance from the UV center were used to create expanding shapes. Noise was applied to break up the edges and avoid uniform silhouettes. The explosion behavior was driven by time-based parameters to simulate expansion and fading.",
        "Alpha blending was controlled so all emission outputs are multiplied by the final alpha mask, preventing residual geometry. Overlay blending was implemented without branch nodes by combining step and lerp operations.",
        "A C# script controls timing across all phases and uses custom interpolation such as power and smoothstep functions to strengthen the feeling of energy buildup and release. Lighting and Bloom support the final presentation.",
      ],
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
      paragraphs: [
        "A stylized energy shield built in Unity Shader Graph, featuring layered Fresnel glow, procedural noise animation, and interactive impact ripples.",
        "The shader combines an outer shell, core veins, and panel structure. Fresnel lighting defines the silhouette while noise and Voronoi patterns create surface energy flow.",
        "Click interaction is implemented with raycasting. World-space hit position and time are passed from C# to the material so the shader can expand and fade impact ripples in real time.",
        "Two impact slots support overlapping interactions. Shader.PropertyToID is used for efficient property access, connecting gameplay input and real-time visual feedback.",
      ],
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
      paragraphs: [
        "This project creates a stylized sci-fi energy beam in Unity Shader Graph with an emphasis on modular control and visual layering.",
        "The beam combines a high-intensity core, outer glow, and noise-driven distortion. UV masks control start/end clipping and vertical falloff, while flowing UVs create continuous directional motion.",
        "Origin and impact highlights improve readability. Carefully designed alpha masks create soft transitions, and emission with Bloom reinforces the final energy response.",
        "The project developed practical understanding of procedural VFX design, parameterized shader control, and real-time rendering workflows in Unity.",
      ],
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
      paragraphs: [
        "This shader implements a height-based dissolve effect combined with layered burn and emission. It is designed to simulate a stylized combustion volume inside a containment unit.",
        "Key features include height-based dissolve control, layered burn with an early-burn offset, separate core emission and outer glow, gradient color control, noise-driven edge distortion, and subtle emission flicker.",
        "The graph uses smoothstep masking, mask subtraction for edge bands, gradient sampling, noise distortion, and layered emission blending.",
      ],
    },
  },
];
