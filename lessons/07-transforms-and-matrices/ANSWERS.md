# 第 07 课自测题答案

> 建议先自己做题，再展开本页。

## 1. GLSL 中 `mat3` 按列主序存储时，`uModel * vec3(x, y, 1.0)` 中第三分量 `1.0` 起什么作用？

它是 **齐次坐标** 的 `w` 分量。2D 仿射变换（平移、旋转、缩放）可写成 3×3 矩阵乘 `(x, y, 1)`，**平移项** 在矩阵第三列 `(tx, ty, 1)`，通过乘法加到结果上。若用 `(x, y, 0)`，平移列无法正确作用，物体只能绕原点旋转/缩放而不能平移。

## 2. `gl.uniformMatrix3fv(loc, false, array)` 第二个参数 `false` 表示什么？JS 数组应如何排列？

`false` 表示 **不再转置**——即传入的 9 个 float 已是 **列主序**（column-major），与 GLSL 一致。

对 `mat3` 三列 `c0, c1, c2`，数组为：

`[c0.x, c0.y, c0.z, c1.x, c1.y, c1.z, c2.x, c2.y, c2.z]`

本课 `mat3FromTRS` 即按此顺序构造。

## 3. MVP 中 Model、View、Projection 各管什么？本课 demo 相当于哪一层？

| 矩阵 | 作用 |
|------|------|
| **Model** | 物体局部 → 世界空间（本课 `uModel` 即 2D 模型变换） |
| **View** | 世界 → 相机空间（相机位置与朝向） |
| **Projection** | 相机 → 裁剪空间（透视/正交，最终 `gl_Position`） |

本课在 **裁剪空间** 直接画（顶点输出已是 `[-1,1]` 范围），相当于 **只有 Model、无 View/Projection** 的极简 2D 情形。完整 3D 管线为 `gl_Position = projection * view * model * vec4(aPosition, 1.0)`。
