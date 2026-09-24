# 第 08 课：基础光照

第 07 课在顶点侧做了 2D 变换。本课进入 **光照模型**：用法线、光方向计算明暗，让平面上的图形具有 **体积感**。这是 **阶段一（语法与管线基础）的最后一课**。

## 1. 法线是什么？

**法线 `N`** 是垂直于表面的单位向量，描述表面朝向。光照计算依赖 `N` 与 **光方向 `L`** 的夹角。

本课不加载 3D 网格，而在全屏四边形的片元里，由居中 UV  **解析构造伪球面法线**：

```glsl
vec2 p = vUv * 2.0 - 1.0;
float r2 = dot(p, p);
if (r2 > 1.0) { /* 圆外背景 */ }
float z = sqrt(1.0 - r2);
vec3 normal = normalize(vec3(p, z));
```

圆盘内每点对应单位球前半球的法线，视觉上像一颗球。

## 2. 为什么必须 `normalize`？

`dot(N, L)` 在 `N`、`L` 均为 **单位向量** 时才等于 `cosθ`。未归一化时亮度会随 `|N|` 错误变化。

## 3. Lambert 漫反射

粗糙表面向各方向散射，亮度与 **cosθ = N·L** 成正比，背光为 0：

```glsl
float diffuse = max(dot(normal, lightDir), 0.0);
```

`max(..., 0.0)` 截断背光侧。

## 4. 环境光

仅漫反射时背光全黑。加 **环境光 ambient**（常数）：

```glsl
vec3 color = albedo * (ambient + diffuse * 0.85);
```

## 5. Blinn-Phong 高光

光滑表面在 **镜面方向** 附近出现亮斑。Blinn-Phong 用 **半角向量** `H = normalize(L + V)`：

```glsl
vec3 halfDir = normalize(lightDir + viewDir);
float specular = pow(max(dot(normal, halfDir), 0.0), shininess);
color += vec3(1.0) * specular * 0.35;
```

`shininess` 越大，高光越尖锐。`viewDir` 本课取 `(0,0,1)`（正对屏幕）。

## 6. 动画光源

```glsl
vec3 lightDir = normalize(vec3(
  cos(uTime * 0.9) * 0.8,
  0.55,
  sin(uTime * 0.9) * 0.8
));
```

光在水平面轨道运动，高光随之绕行。

## 7. 本课示例

完整文件见 [`lessons/08-basic-lighting/`](../lessons/08-basic-lighting/)。

要点：圆外深色背景；圆内 **环境光 + Lambert + Blinn-Phong**；`uResolution` 保持正圆。

## 8. 自测题

请先独立思考，再查看 [`lessons/08-basic-lighting/ANSWERS.md`](../lessons/08-basic-lighting/ANSWERS.md)。

1. Lambert 漫反射为什么用 `max(dot(N, L), 0.0)`？
2. 为什么法线 `N` 必须 `normalize`？
3. 漫反射与 Blinn-Phong 高光在物理直觉上有什么区别？本课 demo 中各由哪几项体现？

## 阶段一完结

**阶段一（语法与管线基础）** 课次 01–08：

| 课次 | 主题 |
|------|------|
| 01 | 管线与着色器骨架 |
| 02 | 类型与向量运算 |
| 03 | uniform 与顶点属性 |
| 04 | 纹理采样 |
| 05 | 简单图案与 SDF |
| 06 | 噪声与程序化动画 |
| 07 | 变换矩阵 |
| 08 | 基础光照 |

**阶段二（图形小实验）** 从第 09 课开始：进阶 SDF、综合场景等。
