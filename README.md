# 个人主页

一个面向国内与海外招聘的英文 Technical Artist 个人作品集。

## 当前内容

- 英文单语言界面
- TA 求职定位与天津求职状态
- Unity、Shader、C#、AI × TA 能力方向
- 四个真实 Unity Shader/VFX 实践项目的完整资料归档
- 按原始 `Video_Preview`、`Gallery`、`Shader_Logic`、`Script`、`Technical_Summary` 文件夹分类展示
- 双轨作品结构：`Shader Graph / Visual VFX` 与 `Rendering Code Lab`
- 四个手写 Shader / URP 精选代码案例，包含流程、代码片段、GitHub 源文件与媒体展示
- 已填入个人照片，以及高斯模糊、反射、级联阴影、边缘检测的真实实践截图
- 个人照片按原始比例完整展示，不进行裁切
- 联系区包含标注为个人生活内容的抖音入口占位
- 按 Shader 基础、光照环境、URP 管线分组的完整学习归档
- 蓝紫天空与实时渲染视觉氛围
- 鼠标视差、滚动揭示和响应式动效
- 桌面端、平板和手机端响应式布局

## 后续替换

在 `app/page.tsx` 中继续补充简历与抖音主页链接；完整项目目录位于
`public/projects/catalog/`，项目文件清单位于 `app/projectCatalog.ts`，全局视觉样式位于
`app/globals.css`。渲染代码案例与 GitHub 归档位于 `app/renderingCatalog.ts`，渲染案例图片位于
`public/rendering-code/`，个人照片位于 `public/profile/`；后续也可继续补充 GIF、MP4 或真正的
WebGL 3D 场景。

## 验收

- 页面可完成生产构建
- 键盘可访问主要导航与链接
- 支持减少动态效果的系统偏好
- 适配常见桌面和移动端宽度
