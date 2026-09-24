# 第 12 课：透视投影与视锥体

第 11 课用了 `mat4Perspective` 但未展开其几何含义。本课理解 **视锥（frustum）**：相机可见的 3D 区域，以及透视矩阵如何把它压进裁剪体积。

## 1. 视锥由什么决定？

透视视锥是 **平截头锥体**，由四个参数定义：

| 参数 | 符号 | 含义 |
|------|------|------|
| 垂直视场角 | `fovy` | 上下视野开角（弧度） |
| 宽高比 | `aspect` | `width / height` |
| 近裁剪面 | `near` | 最近可见距离 |
| 远裁剪面 | `far` | 最远可见距离 |

在 **观察空间**（相机位于原点、看向 -Z）中：

- 近平面上半高：`nh = tan(fovy/2) * near`
- 近平面半宽：`nw = nh * aspect`
- 远平面同理用 `far` 计算

## 2. 六个裁剪平面（概念）

视锥由 6 个平面围成：

- **near**、**far**：垂直于视线
- **left**、**right**、**top**、**bottom**：与视线成夹角

完全在视锥外的三角形在 **裁剪阶段** 被丢弃；部分在外的会被 **裁切** 为视锥内的多边形。

## 3. 透视投影矩阵

`WebGL2Math.mat4Perspective(fovyRad, aspect, near, far)` 实现标准 OpenGL 透视矩阵，将观察空间坐标映射到裁剪空间，并使 **远处物体在 NDC 中更小**（通过 `w` 与深度相关）。

注意：

- `near` 必须 > 0
- `far` 必须 > `near`
- `aspect` 应随画布尺寸更新，否则画面拉伸

## 4. 本课演示：线框 + 滑块

演示包含：

1. **彩色立方体**（与第 11 课类似）
2. **青色视锥线框** `createFrustumLineMesh`：在相机空间绘制 8 条棱 + 近远平面
3. **HTML 滑块** 调节 FOV、near、far；另有轻微 FOV 脉冲动画

拖动滑块可直观看到：FOV 变大 → 视锥变宽；near 变小 → 近端变尖；far 变大 → 视锥拉长。

## 5. 视锥外的物体

若立方体顶点在裁剪空间 `w` 之外或 NDC 超出 `[-1,1]`，对应片元不会正确显示。本课相机与参数已调校，立方体始终在视锥内。

## 6. 本课示例

完整文件见 [`lessons/12-perspective-and-frustum/`](../lessons/12-perspective-and-frustum/)。

## 7. 自测题

请先独立思考，再查看 [`lessons/12-perspective-and-frustum/ANSWERS.md`](../lessons/12-perspective-and-frustum/ANSWERS.md)。

1. 透视投影矩阵中 `near` 和 `far` 各控制什么？`near` 过小会有什么问题？
2. 视锥体有哪些平面？视锥外的三角形会怎样？
3. `aspect = canvas.width / canvas.height` 为何必须传入透视矩阵？

## 下一课预告

**相机与深度**：`lookAt` 详解、深度缓冲、Z-fighting 与缓解。
