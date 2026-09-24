# 第 11 课自测题答案

> 建议先自己做题，再展开本页。

## 1. `gl_Position` 的 `w` 分量在透视投影后通常不等于 1，透视除法做了什么？为什么重要？

透视除法将裁剪空间坐标 `(x, y, z, w)` 变为 NDC：`(x/w, y/w, z/w)`。当 `w` 随深度变化时，**远处物体在屏幕上更小**，形成近大远小的透视效果。若跳过除法，3D 场景无法正确投影到 2D 屏幕。

## 2. `gl.uniformMatrix4fv(uProjection, false, array)` 第二个参数为何是 `false`？JS 数组如何排列？

`false` 表示 **不做转置**，WebGL 期望 **列主序** 16 个 float：第 0–3 个是第一列，4–7 是第二列，依此类推。`WebGL2Math.mat4Multiply` 与 `mat4Perspective` 返回的数组已按此排列，与 GLSL `mat4` 列向量乘法一致。

## 3. Model、View、Projection 各自把顶点从哪个空间变到哪个空间？

| 矩阵 | 变换 |
|------|------|
| **Model** | 局部（模型）空间 → 世界空间 |
| **View** | 世界空间 → 相机（观察）空间 |
| **Projection** | 观察空间 → 裁剪空间 |

顶点着色器一次乘法完成：`clip = P * V * M * localPos`。本课 demo 在 JS 用 `mat4LookAt` 建 View、`mat4Perspective` 建 Projection、`mat4Rotate` 建 Model。
