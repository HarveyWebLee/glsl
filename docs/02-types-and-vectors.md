# 第 02 课：类型与向量运算

## 1. 标量类型

GLSL 是 **强类型** 语言。本课先掌握四类标量：

| 类型 | 含义 | 示例 |
|------|------|------|
| `float` | 单精度浮点 | `1.0`、`0.5` |
| `int` | 有符号整数 | `0`、`42`、`-3` |
| `uint` | 无符号整数 | `0u`、`255u` |
| `bool` | 布尔 | `true`、`false` |

### 1.1 没有隐式 int ↔ float 转换

在多数运算上下文中，**不能把 `int` 和 `float` 混用**。需要显式转换：

```glsl
float f = 1.0;
int i = int(f);      // 截断小数部分
float g = float(i);  // 整数转浮点
```

以下写法在编译时会报错：

```glsl
float x = 1;           // 错误：1 是 int 字面量
float y = 1 + 0.5;     // 错误：int 与 float 不能直接相加
```

正确写法：

```glsl
float x = 1.0;
float y = 1.0 + 0.5;
```

`bool` 与数值之间也不能隐式互转，需用比较或显式构造：

```glsl
bool flag = (x > 0.5);
float mask = flag ? 1.0 : 0.0;  // 三元运算符
```

## 2. 向量类型

向量把多个标量打包在一起，是着色器里最常用的类型。

### 2.1 浮点向量

| 类型 | 分量数 | 常见用途 |
|------|--------|----------|
| `vec2` | 2 | UV 坐标、二维方向 |
| `vec3` | 3 | RGB 颜色、三维方向 |
| `vec4` | 4 | RGBA 颜色、齐次坐标 |

### 2.2 整数与布尔向量（简要）

| 类型 | 说明 |
|------|------|
| `ivec2` / `ivec3` / `ivec4` | 整数向量，用于纹理坐标偏移、索引等 |
| `bvec2` / `bvec3` / `bvec4` | 布尔向量，用于 `lessThan` 等逐分量比较结果 |

本课重点在 `vec*`，`ivec*` 与 `bvec*` 知道存在即可，后续课程会用到。

## 3. 向量构造

### 3.1 标量广播

一个标量可以「填满」整个向量：

```glsl
vec3 gray = vec3(0.5);       // (0.5, 0.5, 0.5)
vec4 opaque = vec4(1.0);     // (1.0, 1.0, 1.0, 1.0)
```

### 3.2 拼接与截断

```glsl
vec2 uv = vec2(0.3, 0.7);
vec3 pos = vec3(uv, 0.0);           // (0.3, 0.7, 0.0)
vec4 color = vec4(pos, 1.0);         // (0.3, 0.7, 0.0, 1.0)
vec2 again = color.xy;               // 取前两个分量
```

也可以从更长的向量中截取：

```glsl
vec4 v = vec4(1.0, 2.0, 3.0, 4.0);
vec3 rgb = v.rgb;   // 等价于 v.xyz → (1, 2, 3)
float a = v.a;      // 等价于 v.w → 4.0
```

### 3.3 混合构造

```glsl
vec2 ab = vec2(1.0, 2.0);
vec4 packed = vec4(ab, 0.0, 1.0);    // (1, 2, 0, 1)
```

构造时 **分量总数必须匹配** 目标向量长度，类型也要兼容（`float` 与 `vec*` 混用需留意）。

## 4. Swizzle（分量重排）

Swizzle 用 `.x` `.y` `.z` `.w` 或 `.r` `.g` `.b` `.a` 访问或重排分量：

```glsl
vec4 c = vec4(1.0, 0.5, 0.2, 1.0);
vec3 rgb = c.rgb;        // 取前三个
vec2 rg  = c.rg;         // 取前两个
vec4 swapped = c.bgra;   // 重排为 (0.2, 0.5, 1.0, 1.0)
```

### 4.1 命名约定

- **位置语义**：`.x` `.y` `.z` `.w` — 常用于坐标、方向
- **颜色语义**：`.r` `.g` `.b` `.a` — 常用于颜色

同一向量中 **不能混用** 两套命名，例如 `.xy` 与 `.rg` 不能出现在同一个 swizzle 里。

### 4.2 作为左值（写入）

Swizzle 可以出现在赋值左侧，实现分量写入：

```glsl
vec4 v = vec4(0.0);
v.xy = vec2(1.0, 2.0);   // 只改 x、y
v.zw = v.yx;             // 交换 z、w
```

### 4.3 非法 swizzle

以下写法 **不允许**：

```glsl
vec3 a = vec3(1.0);
// a.xx = vec2(1.0, 2.0);  // 错误：重复分量不能作为左值
// float f = a.xxyy;         // 错误：结果超过 4 个分量
// vec2 b = a.xg;            // 错误：混用 xyzw 与 rgba
```

规则小结：

- 左值 swizzle 中 **同一分量不能出现两次**（如 `.xx`）
- 右值 swizzle 结果最多 **4 个分量**
- 同一 swizzle 内 **只用一套命名**（`xyzw` 或 `rgba`，或 `stpq`）

## 5. 逐分量运算

两个等长向量之间的 `+` `-` `*` `/` 默认是 **逐分量** 的：

```glsl
vec3 a = vec3(1.0, 2.0, 3.0);
vec3 b = vec3(0.5, 1.0, 1.5);
vec3 sum = a + b;           // (1.5, 3.0, 4.5)
vec3 scaled = a * 2.0;      // 标量广播：(2, 4, 6)
vec3 product = a * b;       // 逐分量乘：(0.5, 2.0, 4.5)
```

## 6. 常用内置函数

以下函数在向量着色中极其常见，建议记住签名与含义。

| 函数 | 作用 | 简例 |
|------|------|------|
| `length(v)` | 向量长度（模） | `length(vec2(3, 4))` → `5.0` |
| `normalize(v)` | 单位化（方向不变，长度为 1） | `normalize(vec2(3, 4))` |
| `dot(a, b)` | 点积（标量） | `dot(vec3(1,0,0), vec3(0,1,0))` → `0.0` |
| `cross(a, b)` | 叉积（仅 `vec3`，结果垂直于 a、b） | 法线计算常用 |
| `mix(a, b, t)` | 线性插值：`a*(1-t) + b*t` | 混色、渐变 |
| `clamp(x, lo, hi)` | 限制在 `[lo, hi]` | 防止颜色溢出 |
| `step(edge, x)` | `x < edge ? 0.0 : 1.0` | 硬边阈值 |
| `smoothstep(e0, e1, x)` | 在 `[e0,e1]` 平滑 0→1 | 柔和过渡 |

### 6.1 短示例

```glsl
// 两点距离
float dist = length(p - center);

// 用点积判断「朝向」
float facing = dot(normalize(lightDir), normalize(surfaceNormal));

// 两色渐变
vec3 color = mix(vec3(1, 0, 0), vec3(0, 0, 1), t);

// 把 t 限制在 [0,1]
t = clamp(t, 0.0, 1.0);

// 圆边：距离小于半径为 1，否则为 0
float circle = step(radius, dist);

// 柔和圆边
float softCircle = 1.0 - smoothstep(radius - 0.01, radius, dist);
```

`cross` 仅对 `vec3` 定义，返回与输入垂直的 `vec3`，常用于从两条边求三角形法线。

## 7. 本课示例：用向量数学上色

完整文件见 [`lessons/02-types-and-vectors/`](../lessons/02-types-and-vectors/)。

**顶点着色器** `vertex.glsl`：传递裁剪空间位置，并换算为 `[0,1]` 的 UV。

```glsl
#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
out vec2 vUv;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUv = aPosition.xy * 0.5 + 0.5;
}
```

**片元着色器** `fragment.glsl`：以屏幕中心为原点，用 `normalize`、`dot`、`smoothstep`、`mix` 在两种颜色间渐变。

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
void main() {
  vec2 center = vec2(0.5);
  vec2 dir = normalize(vUv - center);
  float t = dot(dir, normalize(vec2(1.0, 1.0))) * 0.5 + 0.5;
  t = smoothstep(0.25, 0.75, t);
  vec3 colorA = vec3(0.15, 0.35, 0.85);
  vec3 colorB = vec3(0.95, 0.45, 0.15);
  fragColor = vec4(mix(colorA, colorB, t), 1.0);
}
```

要点：

- `vUv - center` 得到从中心指向当前片元的向量；`normalize` 得到单位方向。
- `dot(dir, …)` 衡量该方向与对角线方向的「对齐程度」，映射到 `[0,1]`。
- `smoothstep` 柔化过渡，`mix` 在 `colorA` 与 `colorB` 之间插值。
- 全屏四边形上会得到沿对角线方向的平滑双色渐变（具体外观取决于顶点布局）。

## 8. 自测题

请先独立思考，再查看 [`lessons/02-types-and-vectors/ANSWERS.md`](../lessons/02-types-and-vectors/ANSWERS.md)。

1. 表达式 `vec3(1, 2, 3) + 1.0` 能否通过编译？若不能，应如何改写？
2. `vec4 c = vec4(1.0, 2.0, 3.0, 4.0);` 执行 `c.rg = c.ba;` 后，`c` 的四个分量分别是多少？
3. `mix(a, b, t)` 当 `t = 0.0`、`t = 1.0`、`t = 0.5` 时各得到什么？`smoothstep(0.0, 1.0, 0.5)` 约等于多少？

## 下一课预告

uniform 与属性：`layout(location=…)`、从 CPU 用 `gl.uniform*` 传入时间与颜色等参数。详见 [`docs/03-uniforms-and-attributes.md`](03-uniforms-and-attributes.md)。
