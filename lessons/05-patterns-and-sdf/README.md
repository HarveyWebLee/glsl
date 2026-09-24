# 第 05 课：简单图案与 SDF

本目录包含第 05 课的顶点/片元着色器对，对应正文 [`docs/05-patterns-and-sdf.md`](../../docs/05-patterns-and-sdf.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：UV 中心化、圆/矩形 SDF、抗锯齿与简单动画 |
| `vertex.glsl` | 顶点着色器：读 **属性** `aPosition` 与 `aUv`，输出 `vUv` |
| `fragment.glsl` | 片元着色器：`sdCircle` / `sdBox` + `smoothstep` 软边，无纹理 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **顶点属性**：`aPosition`（location 0）与 **`aUv`（location 1）** 来自 `createFullscreenQuadWithUv`；`vUv` 插值到片元。
2. **坐标**：`p = vUv * 2.0 - 1.0` 中心化；`uResolution` 修正宽高比，圆保持正圆。
3. **形状**：左侧 **脉动圆**（`sin(uTime)` 调制半径）；右侧 **旋转矩形**（`rot2d(uTime)`）。
4. **抗锯齿**：`aaFill` 用 `smoothstep` 在 SDF 边界附近做软遮罩，避免硬 `step` 锯齿。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/05-patterns-and-sdf/`（端口以实际为准）。

3. 应看到深色背景上：左侧蓝色圆半径呼吸式变化，右侧橙色矩形缓慢旋转，边缘平滑无锯齿。编译或链接失败时页面会显示错误信息。

也可阅读对照文档 [`docs/05-patterns-and-sdf.md`](../../docs/05-patterns-and-sdf.md) 中的 SDF 与组合形状说明。

## 顶点数据提示

全屏四边形使用 **交错 VBO**（`x, y, z, u, v`），由共用工具 `createFullscreenQuadWithUv` 创建：

- `aPosition` → attribute location **0**（`vec3`）  
- `aUv` → attribute location **1**（`vec2`）  
- 四角 UV：左下 `(0,0)`、右下 `(1,0)`、左上 `(0,1)`、右上 `(1,1)`

本课 **不需要纹理**；图案完全在片元着色器内由距离场生成。
