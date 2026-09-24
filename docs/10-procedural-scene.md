# 第 10 课：综合小实验

本课将阶段一、二中的技术 **组合在一个画面** 里，不做引擎，只保留一个清晰的 WebGL2 全屏演示。这是 **阶段二（图形小实验）的最后一课**。

## 1. 综合了哪些课？

| 来源课次 | 技术 | 本课中的角色 |
|----------|------|--------------|
| **05 / 09** | SDF、`opSmoothUnion` | 三圆熔接成流动形体 |
| **06** | `fbm`、域扭曲 | 扭曲 SDF 采样坐标，边缘有机变形 |
| **08** | 法线 + Lambert | SDF 数值梯度作法线，轨道光漫反射 |
| **02 / 03** | `mix`、uniform 动画 | `palette` 调色、`uTime` 驱动 |

## 2. 场景距离与域扭曲

```glsl
vec2 warp = vec2(fbm(...), fbm(...)) * 0.22 - 0.11;
vec2 q = p + warp;
float d = opSmoothUnion(opSmoothUnion(d1, d2, k), d3, k);
```

噪声进入 **坐标** 而非仅颜色，轮廓随 `uTime` 流动。

## 3. 数值梯度法线

对隐式曲面 `d(p)=0`，法线近似为梯度：

```glsl
float dx = sceneDistance(p + vec2(eps,0)) - sceneDistance(p - vec2(eps,0));
float dy = sceneDistance(p + vec2(0,eps)) - sceneDistance(p - vec2(0,eps));
vec3 normal = normalize(vec3(-dx, -dy, 0.12));
```

适用于 smoothmin 后的复杂形状；代价是多次 `sceneDistance` 调用。

## 4. 简易光照与调色

```glsl
vec3 albedo = palette(fbm(p * 3.0 + uTime * 0.05));
vec3 color = albedo * (ambient + diffuse * 0.9);
```

`palette` 在蓝–粉之间插值；rim 光增强边缘体积感。

## 5. 本课示例

完整文件见 [`lessons/10-procedural-scene/`](../lessons/10-procedural-scene/)。

运行后应看到：中央 **熔融状** 形体、噪声扭曲轮廓、颜色与高光缓慢变化。

## 6. 自测题

请先独立思考，再查看 [`lessons/10-procedural-scene/ANSWERS.md`](../lessons/10-procedural-scene/ANSWERS.md)。

1. 为何用 `fbm` 扭曲 SDF 坐标，而不是只对颜色加噪声？
2. SDF 数值梯度法线与第 08 课 UV 伪球面法线有何异同？
3. 若去掉 `opSmoothUnion` 改用硬 `min`，会失去什么？

## 阶段二完结

**阶段二（图形小实验）** 课次回顾：

| 课次 | 主题 | 说明 |
|------|------|------|
| 02–03 | 纯色与渐变 | `mix`、uniform 驱动（已覆盖「纯色与渐变」） |
| 05 | 简单图案与 SDF | 单形状 |
| 06 | 噪声与程序化动画 | hash、fBm |
| 09 | 进阶 SDF | 布尔、smoothmin |
| 10 | 综合小实验 | 本课 |

**后续可选进阶（本仓库尚未开设，非必修）**：帧缓冲（FBO）、GPGPU、PBR 材质、阴影、后处理等。学到时再按需添加。
