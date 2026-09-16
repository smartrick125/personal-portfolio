# 人物 3D 模型交付规格

给 Blender 侧（人工或 Codex）的交付要求。目标是替换 `#profile` 区当前的静态人像
`public/profile/smartrick-portrait.jpg`，在网页里实时渲染。

整份文件可以直接作为 prompt 投给 Codex。

---

## 0. 先说清楚：Codex 在这条链路里能做什么

**做得了**：Blender Python 脚本——批量减面、UV 展开、烘焙贴图、材质转换成
PBR、导出参数设置、glb 后处理（Draco / KTX2）、以及把这些串成一个可重复跑的脚本。

**做不了**：从一张 2D 照片"生成"出有你长相的模型。这不是写脚本能解决的问题。

那一步要么用图生 3D 的工具（Meshy、Tripo、Rodin、Hunyuan3D 这类），要么手工雕。
拿到粗模之后，**清理、减面、烘焙、导出这一整套交给 Codex 是合适的**。

所以实际分工建议：

1. 你用图生 3D 工具出一个粗模（通常是高面数、贴图乱、无 UV）
2. 把粗模 + 这份规格一起给 Codex，让它写 Blender 脚本做清理和导出
3. 我拿到 `.glb` 接进网页

---

## 1. 硬性交付物

| 项 | 要求 |
|---|---|
| 文件格式 | **`.glb`**（glTF 2.0 二进制，单文件内嵌贴图） |
| 文件体积 | **≤ 1.5 MB**，理想 **≤ 800 KB**（Draco + KTX2 压缩后） |
| 文件名 | `smartrick-bust.glb` |

体积是硬约束：现在整个首屏传输是 **736 KB**，一个没优化的角色模型轻松 10 MB+，
会让首屏直接慢一个数量级。

---

## 2. 构图：半身像，不是全身

网页里这个位置是**竖向的**，桌面端约 **346 × 615 px**，手机端约 **335 px 宽**。

- 做**胸像 / 半身**（头 + 肩 + 胸，到胸口或腰以上截断）
- **不要 T-pose 全身**——在这个框里全身人物的头会小到看不清
- 正面朝 **+Z**，头顶朝 **+Y**
- 模型原点放在**胸口中心**（不是脚下），方便网页端绕原点轻微旋转
- 整体高度控制在 **0.6 ~ 0.8 Blender 单位**（= 米）

---

## 3. 几何

- 三角面 **≤ 40,000**（这个显示尺寸下再多也看不出来，25k 更好）
- **全部三角化**，不留 n-gon
- 所有修改器**已应用**（尤其 Subdivision Surface —— 不应用的话要么丢细节要么面数爆炸）
- 所有变换**已应用**（Ctrl+A → All Transforms），scale 必须是 1,1,1
- 尽量合并成 **1 个 mesh 对象**，最多不超过 3 个
- 有干净的 **UV 展开**，单套 UV（`UVMap`），不要重叠（除非是刻意的镜像）
- 不要导出摄像机和灯光——网页端自己打光

---

## 4. 材质与贴图

**关键：Blender 的程序化材质（Noise / Voronoi / 各种节点）导不出 glTF。**
所有效果必须**烘焙成贴图**，材质最终只能是标准的 Principled BSDF。

- 贴图尺寸 **1024 × 1024**（最大 2048，不要更大）
- 需要的贴图：
  - `baseColor`（必需）
  - `normal`（建议，把高模细节烘进来）
  - `roughness` + `metallic`（建议，可以打包进同一张的 G/B 通道，glTF 标准做法）
- **不要**烘 AO 阴影进 baseColor——网页端会自己打光，烘死的阴影会和实时光冲突
- 材质数量 **≤ 2**（比如身体一个、头发一个）

### 配合网站配色

页面是深色的，模型主要靠**边缘光**打出轮廓。深色底上不要用纯黑的衣服/头发，
不然会糊成一团。站点主色供参考：

```
--night   #050713   背景
--violet  #795cff   主强调
--cyan    #77f3ff   次强调
--sky     #91c9ff
```

roughness 给到 **0.4 ~ 0.7** 之间，太亮会反光刺眼，太哑会没体积感。

---

## 5. 动画（可选，但建议有）

如果要让它"活着"：

- 一段 **idle 循环**即可，**3 ~ 6 秒**，首尾帧完全一致（无缝循环）
- 幅度要**小**：轻微呼吸起伏、头部极小幅度转动。这是作品集的头像，不是游戏角色
- 骨骼数 **≤ 30**
- 动画名 **`idle`**
- 不要根运动（root motion），模型原地不动

没有动画也行——网页端可以做鼠标跟随的轻微转头，不需要骨骼。

---

## 6. 导出设置（Blender glTF 2.0 导出器）

```
Format:              glTF Binary (.glb)
Include:             Selected Objects ✓ / Cameras ✗ / Punctual Lights ✗
Transform:           +Y Up ✓
Data → Mesh:         Apply Modifiers ✓ / UVs ✓ / Normals ✓ / Tangents ✓
Data → Material:     Export（Placement: Automatic）
Data → Shape Keys:   ✗（除非确实用到）
Animation:           仅在有 idle 时勾选，Sampling Rate 建议 2
Compression (Draco): ✓   Compression level 6
```

导出后**再跑一遍 `gltf-transform`** 做 KTX2 贴图压缩，体积通常还能降一半：

```bash
npx @gltf-transform/cli optimize smartrick-bust.glb smartrick-bust.opt.glb \
  --texture-compress ktx2 --texture-size 1024
```

---

## 7. 自检清单（交付前逐条确认）

- [ ] 在 https://gltf-viewer.donmccurdy.com/ 里能正常打开，材质和贴图都在
- [ ] 文件 ≤ 1.5 MB
- [ ] 三角面 ≤ 40k
- [ ] 深灰背景（#050713）下看得清轮廓，不糊成一团
- [ ] 没有摄像机、没有灯光
- [ ] scale 是 1,1,1，模型原点在胸口
- [ ] 有 idle 的话，循环无跳帧

---

## 8. 交给我之后

把 `.glb` 放进 `public/profile/`，告诉我一声。网页端我会：

- 按实际体量决定用 `<model-viewer>` 还是 three.js（只是想让人像动起来的话，
  多半不需要引整个 three.js）
- 懒加载 + 保留现在的 jpg 作为占位和降级（WebGL 不可用、或用户开了
  `prefers-reduced-motion` 时回落到静态图）
- 打光对齐站点的紫/青配色
