# 第 11 课：三维坐标与 MVP

第 07 课在 2D 全屏四边形上用了 `mat3` 模型矩阵。本课进入 **真实 3D**：用 `mat4` 完成 Model–View–Projection 管线，在 WebGL2 中绘制 **旋转的彩色立方体**。这是 **阶段三（真实 3D 图形）的第一课**。

## 1. 坐标空间流水线

顶点从 **模型空间（局部）** 出发，依次经过：

```
局部坐标 → [Model] → 世界坐标 → [View] → 观察坐标 → [Projection] → 裁剪坐标
```

GPU 随后自动：

1. **透视除法**：`(x, y, z, w) → (x/w, y/w, z/w)` 得到 NDC（归一化设备坐标，约 `[-1, 1]`）
2. **视口变换**：NDC 映射到屏幕像素

```glsl
gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
```

`gl_Position` 必须是 **裁剪空间** 的 `vec4`；`w` 在透视投影下通常 ≠ 1。

## 2. 列主序与 `uniformMatrix4fv`

GLSL `mat4` 按 **列主序** 存储。JavaScript 侧 `WebGL2Math.mat4Multiply`、`mat4Perspective` 返回的 16 个 float 已是列主序：

```javascript
gl.uniformMatrix4fv(uProjection, false, projection);
```

第二个参数 `false`：**不转置**。若用行主序数组，需传 `true` 或自行重排。

## 3. 三个矩阵各做什么？

| 矩阵 | 含义 | 本课 JS 函数 |
|------|------|--------------|
| **uModel** | 物体在世界中的位置/朝向/缩放 | `mat4RotateY` × `mat4RotateX` |
| **uView** | 世界 → 相机（相机在哪、看向哪） | `mat4LookAt(eye, center, up)` |
| **uProjection** | 相机 → 裁剪空间（透视或正交） | `mat4Perspective(fovy, aspect, near, far)` |

矩阵乘法顺序：**先应用的变换写在右边**（与列向量约定一致）：`P * V * M * v`。

## 4. 程序化立方体网格

本课不加载 `.obj` 等外部模型。`WebGL2Math.createCubeMesh(gl)` 在 JS 生成：

- 每面 4 顶点，带 **位置、法线、面色**
- 索引绘制 `gl.drawElements`

属性布局：`aPosition`(0)、`aNormal`(1)、`aColor`(2)，交错存储。

## 5. 深度测试（预告）

本课已启用 `DEPTH_TEST`，避免后面绘制的面错误盖住前面。第 13 课将深入讲解。

## 6. 本课示例

完整文件见 [`lessons/11-mvp-and-clip-space/`](../lessons/11-mvp-and-clip-space/)。

运行后应看到：轨道相机环绕、六面色立方体自转。

共享工具：[`lessons/_shared/webgl2-math.js`](../lessons/_shared/webgl2-math.js)。

## 7. 自测题

请先独立思考，再查看 [`lessons/11-mvp-and-clip-space/ANSWERS.md`](../lessons/11-mvp-and-clip-space/ANSWERS.md)。

1. `gl_Position` 的 `w` 分量在透视投影后通常不等于 1，透视除法做了什么？为什么重要？
2. `gl.uniformMatrix4fv(uProjection, false, array)` 第二个参数为何是 `false`？JS 数组如何排列？
3. Model、View、Projection 各自把顶点从哪个空间变到哪个空间？

## 下一课预告

**透视投影与视锥体**：FOV、near/far、视锥六个平面，以及用线框可视化视锥。
