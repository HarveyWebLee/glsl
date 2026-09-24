# 第 06 课：噪声与程序化动画

第 05 课用 SDF 在片元里「画」几何形状。本课转向 **程序化纹理**：不依赖图片，用 **噪声函数** 从 UV 坐标生成连续变化的图案，并用 **`uTime`** 驱动动画。

## 1. 噪声 ≠ 每帧随机

若对每个像素每帧独立随机，画面会变成 **电视雪花**——值在时间上剧烈跳变，没有连贯的云、火焰或水面感。

**程序化噪声** 的核心是：颜色由 **空间位置** 决定，同一位置每次算出相同值；动画来自 **改变采样坐标**（偏移、缩放、扭曲），而不是对同一像素重新掷骰子。

```
固定 hash(p) → 空间上伪随机但可重复
p + f(uTime) → 采样域随时间移动 → 图案流动
```

## 2. Hash：最简伪随机

经典写法（教学常用）：

```glsl
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
```

| 要点 | 说明 |
|------|------|
| 输入是 **位置** `p` | 同一 `p` 永远得到同一结果 |
| `dot` + `sin` + `fract` | 把 2D 坐标映射到 `[0, 1)` |
| 非真随机 | 质量一般，但零依赖、易理解 |

**注意**：`fract(sin(...))` 在大尺度上可能出现带状伪影；生产环境常用 Perlin、Simplex 或预烘焙纹理。本课重在理解 **「噪声 = 空间函数」**。

## 3. Value Noise：从离散到连续

单独对整数格点 `hash` 会得到棋盘格般的突变。**Value noise** 在四邻格点插值：

```glsl
float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);  // smoothstep 式平滑

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
```

`floor` 确定格点，`fract` 得到格内小数坐标，双线性 `mix` 让相邻格点之间平滑过渡。

## 4. fBm（分形布朗运动，选做）

把多层不同频率的噪声叠加：

```glsl
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 2; octave++) {
    value += amplitude * valueNoise(p);
    p *= 2.0;           // 频率加倍 → 更细细节
    amplitude *= 0.5;   // 减弱高频权重
  }
  return value;
}
```

低频层决定大形（云块），高频层增加边缘碎屑。层数越多通常越细腻，片元成本也越高。

## 5. 用 `uTime` 做动画

### 5.1 错误做法（概念上）

```glsl
// 每帧对同一 UV 独立随机 → 雪花噪点
float n = hash(vUv + uTime);
```

### 5.2 正确做法：扭曲采样域

```glsl
vec2 warp = vec2(sin(uv.y * 4.0 + uTime * 0.35), cos(uv.x * 3.5 - uTime * 0.28)) * 0.18;
vec2 samplePos = (uv + warp) * 3.2 + vec2(uTime * 0.08, uTime * 0.05);
float n = fbm(samplePos);
```

`uTime` 进入 **采样坐标**，噪声场在空间中平移、扭曲，视觉上像云在飘动。

## 6. `fract(sin(...))` vs 纹理噪声

| 方式 | 优点 | 缺点 |
|------|------|------|
| **过程 hash / value noise** | 无纹理、体积小、易教学 | 质量有限，大尺度可能有伪影 |
| **`sampler2D` 噪声图** | 可存高质量 Perlin 等、采样快 | 需上传资源、重复周期受贴图尺寸限制 |

本课 demo 用过程噪声；第 04 课的纹理采样知识可直接用于噪声贴图方案。

## 7. 本课示例

完整文件见 [`lessons/06-noise-and-animation/`](../lessons/06-noise-and-animation/)。

**片元着色器**要点：

- `hash` → `valueNoise` → 两层 `fbm`
- `uResolution` 修正宽高比
- `uTime` 扭曲 UV 并缓慢平移采样域
- 用 `smoothstep` 把噪声映射为深蓝云色，叠加轻微 `hash` 颗粒

```glsl
vec2 samplePos = (uv + warp) * 3.2 + vec2(uTime * 0.08, uTime * 0.05);
float n = fbm(samplePos);
vec3 color = mix(deep, mid, smoothstep(0.25, 0.55, n));
```

## 8. 自测题

请先独立思考，再查看 [`lessons/06-noise-and-animation/ANSWERS.md`](../lessons/06-noise-and-animation/ANSWERS.md)。

1. 为什么 `hash(vec2 p)` 用位置 `p` 做输入，而不是直接用 `uTime`？若每帧对同一像素独立随机，画面会怎样？
2. `fract(sin(dot(...)))` 与从 `sampler2D` 读取预烘焙噪声图，各有什么优缺点？
3. fBm 里每层 `p *= 2.0` 且 `amplitude *= 0.5` 分别起什么作用？

## 下一课预告

**变换矩阵**：`mat2` / `mat3` / `mat4`、列主序、2D 平移/旋转/缩放，在顶点着色器用 `uniform mat3 uModel` 变换 `aPosition`。
