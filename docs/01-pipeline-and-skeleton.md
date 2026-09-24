# 第 01 课：管线概览与最小着色器骨架

## 1. GLSL 是什么？

**GLSL**（OpenGL Shading Language）是编写 **着色器（Shader）** 的语言。着色器是在 GPU 上运行的小程序，负责把几何变成屏幕上的像素。

在本仓库中，我们使用 **GLSL ES 3.00** 方言（文件首行写 `#version 300 es`），与 **WebGL2** 兼容，便于在浏览器里运行，且暂不依赖 Three.js 等框架。

你可以把 GLSL 文件当作「带严格类型和固定入口的 C 系语言」：没有 `main` 以外的自由入口，输入输出通过 `in` / `out`（以及 uniform）约定。

## 2. 顶点着色器 vs 片元着色器

现代图形管线里，与本课最相关的两个阶段是：

| 阶段 | 着色器 | 做什么 |
|------|--------|--------|
| 顶点处理 | **顶点着色器（Vertex Shader）** | 每个顶点执行一次：读入位置等属性，输出裁剪空间位置 `gl_Position`，可把数据传给下一阶段 |
| 光栅化 | （固定功能） | 把三角形变成片元（潜在像素） |
| 像素着色 | **片元着色器（Fragment Shader）** | 每个片元执行一次：决定最终颜色（本课用 `out vec4 fragColor`） |

数据从顶点着色器传到片元着色器时，变量在顶点之间会被 **插值**（例如三角形三个顶点的颜色会在内部平滑过渡）。

```
顶点属性 ──► 顶点着色器 ──► varying ──► 片元着色器 ──► 帧缓冲
              gl_Position      (插值)        fragColor
```

## 3. 必须遵守的硬规则

### 3.1 入口函数

每个着色器必须有：

```glsl
void main() {
  // ...
}
```

### 3.2 顶点着色器：必须写 `gl_Position`

`gl_Position` 是 `vec4`，表示顶点在 **裁剪空间** 中的齐次坐标。本课示例直接把输入位置当作裁剪坐标（仅用于理解语法，不是生产用法）。

### 3.3 顶点与片元之间的 `in` / `out` 必须匹配

- 顶点着色器：`out vec3 vColor;`
- 片元着色器：`in vec3 vColor;`

**类型与名字必须一致**，否则链接（link）阶段会失败。

### 3.4 片元颜色：用 `out vec4`，不要用 `gl_FragColor`

在 GLSL ES 3.00 中，片元着色器通过自定义 `out` 变量输出颜色，例如：

```glsl
out vec4 fragColor;
```

`gl_FragColor` 是旧版 GLSL 的内置变量，**300 es 中不存在**。

### 3.5 精度：`precision`（ES 特有）

OpenGL ES 要求片元着色器声明默认浮点精度，常见写法：

```glsl
precision highp float;
```

顶点着色器也建议写上，保持与片元一致。`highp` / `mediump` / `lowp` 表示精度与性能权衡；学习阶段用 `highp float` 即可。

### 3.6 版本声明

文件 **第一行** 必须是：

```glsl
#version 300 es
```

## 4. 本课最小可编译对着器对

完整文件见 [`lessons/01-hello-shaders/`](../lessons/01-hello-shaders/)。

**顶点着色器** `vertex.glsl`：

```glsl
#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
out vec3 vColor;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vColor = aPosition * 0.5 + 0.5;
}
```

要点：

- `layout(location = 0) in vec3 aPosition`：从 CPU 侧绑定的第 0 号属性读三维位置。
- `vColor = aPosition * 0.5 + 0.5`：把大约 `[-1,1]` 的范围映射到 `[0,1]`，当作 RGB（无几何体时可在 WebGL 演示里看到渐变）。

**片元着色器** `fragment.glsl`：

```glsl
#version 300 es
precision highp float;
in vec3 vColor;
out vec4 fragColor;
void main() {
  fragColor = vec4(vColor, 1.0);
}
```

要点：

- `in vec3 vColor` 接收插值后的颜色。
- `fragColor` 的 alpha 设为 `1.0` 表示不透明。

## 5. 自测题

请先独立思考，再查看 [`lessons/01-hello-shaders/ANSWERS.md`](../lessons/01-hello-shaders/ANSWERS.md)。

1. 顶点着色器和片元着色器各执行多少次？各自必须写出哪个内置/约定输出？
2. 若顶点着色器写 `out vec3 vColor`，片元着色器写 `in vec4 vColor`，会发生什么？
3. 在 GLSL ES 3.00 的片元着色器中，为什么需要 `precision highp float;`？颜色应该写到哪个变量？

## 下一课预告

类型与向量运算：`vec2`/`vec3`/`vec4`、swizzle、以及常用内置函数。
