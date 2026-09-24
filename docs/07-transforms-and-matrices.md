# 第 07 课：变换矩阵

第 06 课在片元里用 UV 生成噪声。本课把变换搬到 **顶点着色器**：用 **`mat3` 模型矩阵** 对顶点做 2D 平移、旋转、缩放，并由 JavaScript 每帧上传 uniform。

## 1. 为什么需要矩阵？

要把物体放到不同位置、旋转、缩放，若手写公式：

```glsl
// 先缩放，再旋转，再平移 — 顺序与组合很快变复杂
vec2 p = aPosition.xy * scale;
p = rot2d(angle) * p;
p += translation;
```

用 **一个矩阵** 表示整套变换，顶点侧只需一次乘法：`worldPos = uModel * vec3(aPosition.xy, 1.0)`。

## 2. `mat2` / `mat3` / `mat4` 简介

| 类型 | 常见用途 |
|------|----------|
| **`mat2`** | 2D 旋转/缩放（第 05 课 `rot2d` 即 `mat2`） |
| **`mat3`** | 2D 仿射：平移 + 旋转 + 缩放（本课） |
| **`mat4`** | 3D 变换 + 透视（完整 MVP 管线） |

GLSL 矩阵按 **列主序** 存储：构造函数 `mat3(c0, c1, c2)` 的三列即矩阵的三列。

## 3. 2D 仿射变换与齐次坐标

2D 点 `(x, y)` 写成 `(x, y, 1)`，3×3 矩阵：

```
| sx·cos  -sy·sin  tx |
| sx·sin   sy·cos  ty |
| 0        0       1  |
```

```glsl
uniform mat3 uModel;
vec3 worldPos = uModel * vec3(aPosition.xy, 1.0);
gl_Position = vec4(worldPos.xy, 0.0, 1.0);
```

第三分量 `1.0` 使 **平移** 能写入矩阵第三列。本课输出已在裁剪空间 `[-1,1]`，无透视。

## 4. JavaScript 侧：列主序上传

```javascript
var model = WebGL2Bootstrap.mat3FromTRS(tx, ty, rot, sx, sy);
gl.uniformMatrix3fv(uModelLoc, false, model);
```

`false` 表示数组 **已是列主序**，不再转置。`mat3FromTRS` 返回 9 个 float，顺序与 GLSL 一致。

本课 demo 每帧改变 `tx, ty, rot, scale`，可看到四边形在平移、旋转、缩放。

## 5. MVP 概念（不展开实现）

完整 3D 管线：

```glsl
gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
```

| 矩阵 | 含义 |
|------|------|
| **Model** | 局部 → 世界（本课 `uModel`） |
| **View** | 世界 → 相机 |
| **Projection** | 相机 → 裁剪空间 |

本课相当于 **仅 Model 的 2D 正交情形**；第 08 课起在片元侧模拟光照，仍可用全屏四边形。

## 6. 本课示例

完整文件见 [`lessons/07-transforms-and-matrices/`](../lessons/07-transforms-and-matrices/)。

- **顶点**：`createUnitQuadWithUv` 提供局部 `[-0.5,0.5]` 四边形，`uModel` 变换后绘制。
- **片元**：圆 SDF + 网格线画在 **局部 UV** 上，四边形转动时图案一起变形，便于观察顶点变换效果。

## 7. 自测题

请先独立思考，再查看 [`lessons/07-transforms-and-matrices/ANSWERS.md`](../lessons/07-transforms-and-matrices/ANSWERS.md)。

1. GLSL 中 `mat3` 按列主序存储时，`uModel * vec3(x, y, 1.0)` 中第三分量 `1.0` 起什么作用？
2. `gl.uniformMatrix3fv(loc, false, array)` 第二个参数 `false` 表示什么？JS 数组应如何排列？
3. MVP 中 Model、View、Projection 各管什么？本课 demo 相当于哪一层？

## 下一课预告

**基础光照**：法线、Lambert 漫反射、Blinn-Phong 高光、环境光；用全屏四边形 + UV 伪球面法线实现简易光照——**阶段一收官**。
