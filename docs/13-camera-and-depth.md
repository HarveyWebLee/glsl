# 第 13 课：相机与深度

第 11–12 课建立了 MVP 与视锥。本课聚焦 **相机（视图矩阵）** 与 **深度缓冲**：让多个 3D 物体正确相互遮挡。

## 1. `lookAt` 视图矩阵

```javascript
var view = WebGL2Math.mat4LookAt(eye, center, up);
```

| 参数 | 含义 |
|------|------|
| `eye` | 相机在世界空间的位置 |
| `center` | 观察目标点 |
| `up` | 相机「头顶」方向（通常 `[0,1,0]`，与视线不平行） |

`lookAt` 构造的矩阵将 **世界坐标** 变换到 **以相机为原点的观察空间**。本课用 `orbitEye(time, radius, height, target)` 让相机绕场景轨道运动。

## 2. 深度测试

默认关闭深度测试时，**后绘制的三角形会覆盖先绘制的**，无论远近。

```javascript
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
```

每帧绘制前：

```javascript
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
```

深度缓冲为每个像素记录 **最近片段的深度**；新片段只有比已存值更近（或相等，取决于 `depthFunc`）才会通过测试并写入颜色。

## 3. 本课场景

- **XZ 网格线** `createGridLineMesh`：提供地面参考
- **两个立方体**：位置略有重叠，轨道相机下应看到正确前后关系

若关闭 `DEPTH_TEST`，远离相机的面可能错误地画在近处物体之上。

## 4. Z-fighting

当两个表面 **深度值极其接近**（共面或深度精度不足）时，会出现闪烁条纹，称为 **Z-fighting**。

常见原因与缓解：

| 原因 | 缓解 |
|------|------|
| `near` 过小 | 增大 `near`（在仍能看见近物的前提下） |
| `far/near` 过大 | 缩小可见深度范围 |
| 共面多边形 | 建模时微移表面；或使用 `gl.polygonOffset(factor, units)` |

深度缓冲非线性：在近平面附近精度高，远处精度低。因此 **不要把 `near` 设得极小**。

## 5. 本课示例

完整文件见 [`lessons/13-camera-and-depth/`](../lessons/13-camera-and-depth/)。

## 6. 自测题

请先独立思考，再查看 [`lessons/13-camera-and-depth/ANSWERS.md`](../lessons/13-camera-and-depth/ANSWERS.md)。

1. 视图矩阵 `uView` 在概念上做了什么？`lookAt(eye, center, up)` 三个参数各表示什么？
2. 为何必须同时清除颜色缓冲和深度缓冲？只清颜色会怎样？
3. Z-fighting 的常见原因与缓解办法有哪些？

## 下一课预告

**三维网格光照**：每顶点法线、法线矩阵、方向光与点光、片元 Blinn-Phong。
