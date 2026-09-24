# 第 14 课：三维网格光照

第 08 课在 2D 全屏片元里用 **伪球面法线** 做光照。本课在 **真实三角网格** 上使用 **每顶点法线**，在片元着色器实现 Blinn-Phong，并区分 **方向光** 与 **点光**。

## 1. 网格法线

`createSphereMesh` 按经纬线生成球体，每个顶点带 **单位法线**（指向球心外侧）：

```glsl
layout(location = 1) in vec3 aNormal;
```

顶点着色器将法线变换到 **世界空间**：

```glsl
vWorldNormal = normalize(uNormalMatrix * aNormal);
```

## 2. 法线矩阵 `uNormalMatrix`

模型矩阵若含非均匀缩放，不能直接用 `mat4` 左上 3×3 变换法线。应使用 **逆转置**：

```javascript
var normalMatrix = WebGL2Math.mat3NormalFromMat4(model);
gl.uniformMatrix3fv(uNormalMatrix, false, normalMatrix);
```

纯旋转或均匀缩放时，与直接取 3×3 等价。

## 3. 世界空间光照（本课约定）

本课统一在 **世界空间** 计算：

| 向量 | 来源 |
|------|------|
| `N` | `vWorldNormal` |
| `V` | `normalize(uViewPos - vWorldPos)`，`uViewPos` 为相机世界坐标 |
| `L`（方向光） | `normalize(-uDirLightDir)` |
| `L`（点光） | `normalize(uPointLightPos - vWorldPos)` |

若改到观察空间，须用 `uView` 变换 `N` 与光向量，并保持一致。

## 4. 光照模型

```glsl
// 环境光
color = uAlbedo * uAmbientColor;

// Lambert 漫反射
float diff = max(dot(N, L), 0.0);

// Blinn-Phong 高光
vec3 H = normalize(L + V);
float spec = pow(max(dot(N, H), 0.0), shininess);
```

**方向光**：全场相同方向，无距离衰减。

**点光**：方向随片元变化；本课用 `atten = 1 / (1 + k·d²)` 近似衰减。

## 5. 与第 08 课的对比

| | 第 08 课 | 第 14 课 |
|---|---------|---------|
| 法线来源 | UV 解析伪球面 | 网格顶点属性 |
| 几何 | 全屏四边形 | UV 球体 |
| 空间 | 无真实 3D | 世界空间 + MVP |
| 光源 | 单一轨道光 | 方向光 + 点光 |

## 6. 本课示例

完整文件见 [`lessons/14-mesh-lighting/`](../lessons/14-mesh-lighting/)。

运行后应看到：蓝色球体、主方向光阴影侧、轨道点光的暖色高光。

## 7. 自测题

请先独立思考，再查看 [`lessons/14-mesh-lighting/ANSWERS.md`](../lessons/14-mesh-lighting/ANSWERS.md)。

1. 为何不能直接用 `mat4` 的左上 3×3 变换法线？`uNormalMatrix` 是什么？
2. 本课为何在世界空间计算光照，而不是观察空间？
3. 方向光与点光在片元着色器中的区别是什么？

## 下一课预告

**综合场景收官**：地面 + 多物体 + 双光源，整合阶段三全部技术。
