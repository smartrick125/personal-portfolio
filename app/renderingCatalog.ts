type LocalizedText = {
  en: string;
  zh: string;
};

const repoRoot = "https://github.com/smartrick125/Unity-Shader";
const sourceRoot = `${repoRoot}/blob/main/Assets/Shader/UnityShaderBook`;

export type CodeStudy = {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  description: LocalizedText;
  mediaNote: LocalizedText;
  tags: string[];
  flow: LocalizedText[];
  snippet: string;
  files: Array<{
    name: string;
    url: string;
    kind: string;
  }>;
};

export const renderingRepo = repoRoot;

export const codeStudies: CodeStudy[] = [
  {
    id: "gaussian-blur",
    title: { en: "Gaussian Blur Pipeline", zh: "高斯模糊渲染管线" },
    category: { en: "URP / RenderGraph", zh: "URP / RenderGraph" },
    description: {
      en: "A two-pass HLSL blur injected by a Renderer Feature. RenderGraph manages the intermediate texture, while a Volume component exposes iterations, radius, and downsampling.",
      zh: "通过 Renderer Feature 注入的双 Pass HLSL 高斯模糊。RenderGraph 管理中间纹理，Volume 组件控制迭代次数、模糊半径与降采样。",
    },
    mediaNote: {
      en: "Reserved for before / after frames or a live parameter demo.",
      zh: "预留：效果前后对比图，或参数实时调节录屏。",
    },
    tags: ["ShaderLab", "HLSL", "RenderGraph", "RendererFeature", "Volume"],
    flow: [
      { en: "Read overrides from the Volume stack.", zh: "从 Volume Stack 读取覆盖参数。" },
      { en: "Inject the custom pass through Renderer Feature.", zh: "通过 Renderer Feature 注入自定义 Pass。" },
      { en: "Create and reuse an intermediate RenderGraph texture.", zh: "由 RenderGraph 创建并复用中间纹理。" },
      { en: "Run vertical and horizontal blur passes, then composite.", zh: "依次执行纵向、横向模糊并回写画面。" },
    ],
    snippet: `TextureHandle source = resourceData.activeColorTexture;
TextureHandle temp = renderGraph.CreateTexture(
    new TextureDesc(width, height) { name = "_GaussianBlurTemp" }
);

renderGraph.AddBlitPass(source, temp, material, 0);
renderGraph.AddBlitPass(temp, source, material, 1);`,
    files: [
      { name: "GaussianBlur.shader", kind: "HLSL", url: `${sourceRoot}/Chapter12/GaussianBlur/GaussianBlur.shader` },
      { name: "GaussianBlur_RenderPass.cs", kind: "C#", url: `${sourceRoot}/Chapter12/GaussianBlur/GaussianBlur_RenderPass.cs` },
      { name: "GaussianBlur_RendererFeature.cs", kind: "C#", url: `${sourceRoot}/Chapter12/GaussianBlur/GaussianBlur_RendererFeature.cs` },
      { name: "GaussianBlur_CustomValumeComponent.cs", kind: "C#", url: `${sourceRoot}/Chapter12/GaussianBlur/GaussianBlur_CustomValumeComponent.cs` },
    ],
  },
  {
    id: "realtime-cubemap",
    title: { en: "Realtime Cubemap Reflection", zh: "实时 Cubemap 反射" },
    category: { en: "Environment / Runtime Capture", zh: "环境 / 运行时捕获" },
    description: {
      en: "A runtime reflection study that captures the environment into a cubemap from C#, updates one face per frame, and feeds the result to a reflective Shader through a MaterialPropertyBlock.",
      zh: "在运行时由 C# 捕获环境 Cubemap，每帧更新一个面，再通过 MaterialPropertyBlock 把结果传递给反射 Shader。",
    },
    mediaNote: {
      en: "Reserved for the reflective object, capture point, and cubemap faces.",
      zh: "预留：反射物体效果、捕获点与 Cubemap 六面展示。",
    },
    tags: ["ShaderLab", "Cubemap", "C#", "Runtime Camera", "MaterialPropertyBlock"],
    flow: [
      { en: "Place a capture point near the reflective object.", zh: "在反射物体附近设置捕获点。" },
      { en: "Render the environment camera into a cube render texture.", zh: "将环境相机渲染到 Cube Render Texture。" },
      { en: "Update one cubemap face each frame to spread the cost.", zh: "每帧只更新一个面，分摊捕获开销。" },
      { en: "Sample the cubemap with the reflected view direction.", zh: "用反射后的视线方向采样 Cubemap。" },
    ],
    snippet: `int faceMask = 1 << currentFace;
captureCamera.RenderToCubemap(cubemap, faceMask);
currentFace = (currentFace + 1) % 6;

renderer.GetPropertyBlock(properties);
properties.SetTexture("_Cubemap", cubemap);
renderer.SetPropertyBlock(properties);`,
    files: [
      { name: "RealtimeCubemapCapture.shader", kind: "HLSL", url: `${sourceRoot}/Chapter10/Reflection/RealtimeCubemapCapture.shader` },
      { name: "RealtimeCubemapCapturePoint.cs", kind: "C#", url: `${sourceRoot}/Chapter10/Reflection/RealtimeCubemapCapturePoint.cs` },
      { name: "Reflection.shader", kind: "HLSL", url: `${sourceRoot}/Chapter10/Reflection/Reflection.shader` },
    ],
  },
  {
    id: "cascade-shadow",
    title: { en: "Cascade Shadow Study", zh: "级联阴影学习案例" },
    category: { en: "Lighting / Shadows", zh: "光照 / 阴影" },
    description: {
      en: "A handwritten URP lighting study that builds world-space inputs, requests the main light with cascade shadow coordinates, loops additional lights, and combines diffuse and Blinn–Phong specular terms.",
      zh: "手写 URP 光照案例：构建世界空间数据，通过级联阴影坐标获取主光源，遍历附加光源，并组合漫反射与 Blinn–Phong 高光。",
    },
    mediaNote: {
      en: "Reserved for cascade boundaries, lit result, and shadow comparison.",
      zh: "预留：级联范围、受光结果与阴影对比截图。",
    },
    tags: ["URP Lighting", "HLSL", "Cascade Shadow", "Blinn–Phong"],
    flow: [
      { en: "Transform position and normal into world space.", zh: "把顶点位置与法线转换到世界空间。" },
      { en: "Build cascade-aware shadow coordinates.", zh: "计算支持级联阴影的 Shadow Coord。" },
      { en: "Evaluate the main light and its shadow attenuation.", zh: "计算主光源及其阴影衰减。" },
      { en: "Accumulate additional lights and specular response.", zh: "累加附加光源与高光响应。" },
    ],
    snippet: `float4 shadowCoord = TransformWorldToShadowCoord(positionWS);
Light mainLight = GetMainLight(shadowCoord);

float diffuse = saturate(dot(normalWS, mainLight.direction));
float shadow = mainLight.shadowAttenuation;
color += albedo * mainLight.color * diffuse * shadow;`,
    files: [
      { name: "AcceptShadow_cascade.shader", kind: "HLSL", url: `${sourceRoot}/Chapter9/AcceptShadow_cascade.shader` },
      { name: "ForwardRendering.shader", kind: "HLSL", url: `${sourceRoot}/Chapter9/ForwardRendering.shader` },
      { name: "shadow-display.png", kind: "Image", url: `${sourceRoot}/Chapter9/Images/shadow-display.png` },
    ],
  },
  {
    id: "edge-detection",
    title: { en: "Edge Detection Post Effect", zh: "边缘检测后处理" },
    category: { en: "Post Processing / URP", zh: "后处理 / URP" },
    description: {
      en: "A complete URP post-processing path: Volume settings control the effect, Renderer Feature schedules the pass, and an HLSL image kernel extracts edges before compositing the final frame.",
      zh: "完整的 URP 后处理链路：Volume 控制效果参数，Renderer Feature 调度 Render Pass，HLSL 图像卷积提取边缘并合成最终画面。",
    },
    mediaNote: {
      en: "Reserved for source, edge-only, and final composite frames.",
      zh: "预留：原图、纯边缘结果与最终合成效果。",
    },
    tags: ["Post Process", "HLSL", "RendererFeature", "RenderPass", "Volume"],
    flow: [
      { en: "Expose edge color and intensity through Volume.", zh: "通过 Volume 暴露边缘颜色与强度。" },
      { en: "Schedule the render pass at the selected URP event.", zh: "在指定 URP 事件插入 Render Pass。" },
      { en: "Sample neighboring pixels with an edge kernel.", zh: "使用边缘卷积核采样周围像素。" },
      { en: "Blend the detected contour with the source image.", zh: "将检测轮廓与源图像混合。" },
    ],
    snippet: `half edgeX = sampleTL + 2 * sampleL + sampleBL
           - sampleTR - 2 * sampleR - sampleBR;
half edgeY = sampleBL + 2 * sampleB + sampleBR
           - sampleTL - 2 * sampleT - sampleTR;
half edge = saturate(abs(edgeX) + abs(edgeY));`,
    files: [
      { name: "EdgeDetection.shader", kind: "HLSL", url: `${sourceRoot}/Chapter12/EdgeDetection/EdgeDetection.shader` },
      { name: "EdgeDetection_RenderPass.cs", kind: "C#", url: `${sourceRoot}/Chapter12/EdgeDetection/EdgeDetection_RenderPass.cs` },
      { name: "EdgeDetection_RendererFuture.cs", kind: "C#", url: `${sourceRoot}/Chapter12/EdgeDetection/EdgeDetection_RendererFuture.cs` },
      { name: "EdgeDetection_CustomVolumeComponent.cs", kind: "C#", url: `${sourceRoot}/Chapter12/EdgeDetection/EdgeDetection_CustomVolumeComponent.cs` },
    ],
  },
];

export const archiveTracks = [
  {
    title: { en: "Shader Fundamentals", zh: "Shader 基础" },
    subtitle: { en: "Chapters 06–08 · 16 shaders", zh: "第 06–08 章 · 16 个 Shader" },
    chapters: [
      {
        name: "Chapter 06 · Lighting Models",
        topics: { en: "Diffuse, Half-Lambert, Phong, Blinn–Phong", zh: "漫反射、Half-Lambert、Phong、Blinn–Phong" },
        url: `${repoRoot}/tree/main/Assets/Shader/UnityShaderBook/Chapter6`,
      },
      {
        name: "Chapter 07 · Textures & Normals",
        topics: { en: "Normal maps, ramp textures, mask textures", zh: "法线贴图、渐变纹理、遮罩纹理" },
        url: `${repoRoot}/tree/main/Assets/Shader/UnityShaderBook/Chapter7`,
      },
      {
        name: "Chapter 08 · Transparency",
        topics: { en: "Alpha test, alpha blend, depth writing", zh: "透明度测试、透明混合、深度写入" },
        url: `${repoRoot}/tree/main/Assets/Shader/UnityShaderBook/Chapter8`,
      },
    ],
  },
  {
    title: { en: "Lighting & Environment", zh: "光照与环境效果" },
    subtitle: { en: "Chapters 09–11 · 22 code files", zh: "第 09–11 章 · 22 个代码文件" },
    chapters: [
      {
        name: "Chapter 09 · Shadows",
        topics: { en: "Casting, receiving, screen-space and cascade shadows", zh: "阴影投射、接收、屏幕空间与级联阴影" },
        url: `${repoRoot}/tree/main/Assets/Shader/UnityShaderBook/Chapter9`,
      },
      {
        name: "Chapter 10 · Environment",
        topics: { en: "Reflection, refraction, glass, mirrors, Fresnel", zh: "反射、折射、玻璃、镜面、菲涅尔" },
        url: `${repoRoot}/tree/main/Assets/Shader/UnityShaderBook/Chapter10`,
      },
      {
        name: "Chapter 11 · Animated Surfaces",
        topics: { en: "Billboards, scrolling, sequences, water", zh: "广告牌、滚动背景、序列帧、水面" },
        url: `${repoRoot}/tree/main/Assets/Shader/UnityShaderBook/Chapter11`,
      },
    ],
  },
  {
    title: { en: "URP Rendering Pipeline", zh: "URP 渲染管线" },
    subtitle: { en: "Chapter 12 · 20 shader and C# files", zh: "第 12 章 · 20 个 Shader 与 C# 文件" },
    chapters: [
      {
        name: "Chapter 12 · Custom Rendering",
        topics: {
          en: "Blur, Gaussian blur, edge detection, color adjustment, Renderer Features, Render Passes, Volume",
          zh: "模糊、高斯模糊、边缘检测、颜色调整、Renderer Feature、Render Pass、Volume",
        },
        url: `${repoRoot}/tree/main/Assets/Shader/UnityShaderBook/Chapter12`,
      },
    ],
  },
];
