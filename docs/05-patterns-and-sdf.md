# 第 05 课：简单图案与 SDF

前四课已掌握 varying、uniform 与纹理采样。本课不再依赖图片，而是在 **片元着色器** 里用 **UV 坐标** 与 **有符号距离场（Signed Distance Field，SDF）** 直接「画」出圆、矩形等几何形状，并用 `smoothstep` 得到抗锯齿边缘。

## 1. 为什么在片元着色器里画图案？

全屏四边形每个片元都会执行一次 `main()`，且经插值得到唯一的 **`vUv`**（通常在 `[0, 1]`）。因此可以在片元里：

1. 把 UV 变换到以屏幕中心为原点的坐标系；
2. 计算当前像素到形状边界的 **距离**；
3. 用 `step` 或 `smoothstep` 把「在内 / 在外」变成颜色。

```
vUv → 中心化坐标 p → SDF 距离 d → mask → mix 前景与背景色
```

这比为每个圆单独建网格更灵活，也是后续噪声、后处理、UI 遮罩等技巧的基础。

## 2. 中心化 UV

默认 `vUv` 左下为 `(0, 0)`、右上为 `(1, 1)`。画居中图形时，常映射到 **以屏幕中心为原点** 的坐标：

```glsl
vec2 p = vUv * 2.0 - 1.0;
// 左下 (-1,-1)，右上 (1,1)，中心 (0,0)
```

宽屏时 `p.x` 与 `p.y` 的物理比例不同，圆会变成椭圆。Demo 中可用 **`uResolution`** 修正：

```glsl
p.x *= uResolution.x / uResolution.y;
```

本课示例见 [`lessons/05-patterns-and-sdf/`](../lessons/05-patterns-and-sdf/)。

## 3. 圆：距离即 SDF

到原点的欧氏距离减去半径，即 **圆的 SDF**：

```glsl
float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}
```

| `d` 的符号 | 含义 |
|-----------|------|
| **`d < 0`** | 在圆 **内部**（到边界的距离为负） |
| **`d = 0`** | 在圆周上 |
| **`d > 0`** | 在圆 **外部** |

这种「内部为负、外部为正」的约定，便于用 `min` / `max` 组合多个形状（见第 6 节）。

### 3.1 硬边：`step`

```glsl
float mask = 1.0 - step(0.0, d);  // d < 0 时为 1
```

`step` 在边界处 **突变** 0↔1，像素网格下边缘会出现 **锯齿（aliasing）**。

### 3.2 软边：`smoothstep`（抗锯齿）

在边界附近用窄带过渡：

```glsl
float edgeWidth = 0.015;
float mask = 1.0 - smoothstep(0.0, edgeWidth, d);
```

`smoothstep(0.0, edgeWidth, d)` 在 `d ∈ [0, edgeWidth]` 从 0 平滑升到 1；再用 `1.0 - …` 得到 **内部为 1、外部为 0** 的软遮罩。`edgeWidth` 约 1～2 个像素宽时，圆边在屏幕上更干净。

## 4. 轴对齐矩形 SDF（Inigo Quilez 简化式）

矩形以原点为中心、半宽半高为 `halfSize` 时，常用：

```glsl
float sdBox(vec2 p, vec2 halfSize) {
  vec2 q = abs(p) - halfSize;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}
```

直观理解（不必死记公式）：

1. **`abs(p)`**：利用对称性，只考虑第一象限。
2. **`q = abs(p) - halfSize`**：把点「推」到矩形外框；在框内的分量可能为负。
3. **`length(max(q, 0.0))`**：若点在框 **外**，取正的部分算到边的距离；在框内则为 0。
4. **`min(max(q.x, q.y), 0.0)`**：若点在框 **内**，用负的分量表示「深入内部多远」。

内外部同样满足：**内部 `d < 0`，边界 `d = 0`，外部 `d > 0`**。软边仍用上一节的 `smoothstep` 遮罩。

## 5. 组合形状（选读）

多个 SDF 可像集合运算一样组合（距离场近似）：

| 意图 | 运算 | 说明 |
|------|------|------|
| **并集**（A 或 B） | `min(dA, dB)` | 取更近的边界 |
| **交集**（A 且 B） | `max(dA, dB)` | 取更远的边界 |

本课 demo 左右各画一形，未做布尔组合；可在练习中尝试 `min(sdCircle(...), sdBox(...))` 得到「圆角块与圆重叠」的效果。

## 6. 简单动画

### 6.1 脉动半径

```glsl
float radius = 0.28 + sin(uTime * 2.0) * 0.06;
float d = sdCircle(p, radius);
```

### 6.2 二维旋转（2×2 矩阵）

绕原点旋转坐标 `p`，可用 **`mat2`**（本课只引入 2D 旋转，完整 MVP 矩阵留到后续课次）：

```glsl
mat2 rot2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

vec2 pRot = rot2d(uTime * 0.5) * p;
float d = sdBox(pRot, vec2(0.22, 0.16));
```

`mat2(c, -s, s, c)` 按列构造：第一列 `(c, s)`，第二列 `(-s, c)`，作用于列向量 `p`。

## 7. 本课示例

完整文件见 [`lessons/05-patterns-and-sdf/`](../lessons/05-patterns-and-sdf/)。

**顶点着色器** `vertex.glsl`：与第 04 课相同，`aPosition` + `aUv` → `vUv`。

```glsl
#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUv;
out vec2 vUv;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUv = aUv;
}
```

**片元着色器** `fragment.glsl`：左侧 **脉动抗锯齿圆**，右侧 **缓慢旋转的抗锯齿矩形**，深色背景。

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

float sdBox(vec2 p, vec2 halfSize) {
  vec2 q = abs(p) - halfSize;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}

float aaFill(float d, float edgeWidth) {
  return 1.0 - smoothstep(0.0, edgeWidth, d);
}

mat2 rot2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  vec3 bg = vec3(0.08, 0.08, 0.1);
  vec3 color = bg;

  vec2 circleCenter = vec2(-0.45, 0.0);
  float radius = 0.28 + sin(uTime * 2.0) * 0.06;
  float dCircle = sdCircle(p - circleCenter, radius);
  float circleMask = aaFill(dCircle, 0.015);
  vec3 circleColor = vec3(0.32, 0.72, 0.95);
  color = mix(color, circleColor, circleMask);

  vec2 boxCenter = vec2(0.45, 0.0);
  vec2 boxP = rot2d(uTime * 0.5) * (p - boxCenter);
  float dBox = sdBox(boxP, vec2(0.22, 0.16));
  float boxMask = aaFill(dBox, 0.012);
  vec3 boxColor = vec3(0.95, 0.55, 0.28);
  color = mix(color, boxColor, boxMask);

  fragColor = vec4(color, 1.0);
}
```

要点：

- **`vUv`** 经中心化与宽高比修正得到 **`p`**，便于在「逻辑坐标」里摆形状。
- **`sdCircle` / `sdBox`** 返回有符号距离；**`aaFill`** 统一做软边遮罩。
- **`uTime`** 驱动圆半径脉动与矩形旋转；**`uResolution`** 保持圆为正圆。

## 8. 自测题

请先独立思考，再查看 [`lessons/05-patterns-and-sdf/ANSWERS.md`](../lessons/05-patterns-and-sdf/ANSWERS.md)。

1. `float d = length(p) - radius` 中，`d < 0` 表示像素在圆的哪一侧？若改用 `step(0.0, d)` 硬切，边缘可能出现什么问题？
2. 矩形 SDF 里 `vec2 q = abs(p) - halfSize` 这一步在几何上做了什么？为什么内部点的 `d` 会是负数？
3. 两个形状的距离 `dA`、`dB` 若要画「同时属于两者」的交集区域，应对 `dA` 与 `dB` 用 `min` 还是 `max`？为什么？

## 下一课预告

噪声函数与更丰富的程序化动画，或引入 2D/3D 变换矩阵把顶点与 UV 统一变换。
