# 第 15 课：综合场景收官

本课将阶段三（第 11–14 课）的技术 **组合在一个 3D 场景** 中：透视相机轨道、深度测试、地面平面、带光照的球体与立方体。这是 **阶段三（真实 3D 图形）的最后一课**。

## 1. 综合了哪些课？

| 来源课次 | 技术 | 本课中的角色 |
|----------|------|--------------|
| **11** | MVP、`mat4`、程序化网格 | 地面/球/立方体各自 `uModel` |
| **12** | 透视投影 | `mat4Perspective` + 合理 near/far |
| **13** | `lookAt` 轨道相机、深度测试 | 环绕场景；物体正确遮挡 |
| **14** | 法线矩阵、Blinn-Phong | 世界空间双光源光照 |

## 2. 场景构成

- **地面**：`createPlaneMesh`（8×8 XZ 平面，深灰材质）
- **主物体**：中心 **球体**，缓慢自转
- **辅物体**：侧面 **立方体**（复用 `createCubeMesh` 法线，面色在片元被 `uAlbedo` 覆盖）
- **主光**：暖色方向光（模拟太阳）+ 高光
- **补光**：冷色较弱方向光，减轻背光死黑

## 3. 绘制流程（每帧）

1. 调整画布、`clear` 颜色与深度
2. 计算 `projection`、`view`（轨道 `lookAt`）
3. 上传公共光照 uniform
4. 依次 `drawObject`：地面 → 球体 → 立方体（各带独立 `uModel` 与 `uAlbedo`）

## 4. 材质与光照

片元着色器与第 14 课类似，但简化为 **双方向光**（无主点光），便于理解主/补光分工：

```glsl
color = albedo * ambient;
color += albedo * mainLight * diffuse;
color += mainLight * specular;
color += albedo * fillLight * diffuse * 0.6;
```

## 5. 本课示例

完整文件见 [`lessons/15-3d-scene-capstone/`](../lessons/15-3d-scene-capstone/)。

## 6. 自测题

请先独立思考，再查看 [`lessons/15-3d-scene-capstone/ANSWERS.md`](../lessons/15-3d-scene-capstone/ANSWERS.md)。

1. 本课场景绘制顺序为何先地面再球体/立方体？与深度测试如何配合？
2. 主光与补光（fill light）各起什么作用？
3. 阶段三结束后，若要继续学习阴影贴图或 PBR，需要在本课基础上增加什么？

## 阶段三完结

**阶段三（真实 3D 图形）** 课次回顾：

| 课次 | 主题 |
|------|------|
| 11 | 三维坐标与 MVP |
| 12 | 透视投影与视锥体 |
| 13 | 相机与深度 |
| 14 | 三维网格光照 |
| 15 | 综合场景收官 |

**本路线主体已完结（01–15）。** 阴影贴图、FBO 离屏渲染、PBR、GPGPU 等为 **可选进阶**，见 [`docs/00-roadmap.md`](00-roadmap.md)。
