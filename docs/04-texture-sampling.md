# 第 04 课：纹理采样

前三课已掌握顶点属性、uniform 与 varying。本课引入 **纹理（Texture）**：把 2D 图像绑定到 GPU，在片元着色器里按 **UV 坐标** 采样颜色，让画面不再只靠 `mix` 算出的纯色。

## 1. 纹理是什么？

**纹理** 在 GPU 上通常是一张（或多张）2D 图像数据。片元着色器不直接读「像素数组」，而是通过 **采样器（sampler）** 与内置函数 **`texture()`**，根据 **UV 坐标** 查询该位置的颜色。

```
CPU 上传图片 → GPU 纹理对象 → uniform sampler2D → texture(sampler, uv) → 片元颜色
```

本课用程序生成的棋盘格（或 HTML `Image` / Canvas）作为纹理源，重点在 **如何把 UV 传到片元** 以及 **如何绑定纹理单元**。

## 2. UV 坐标

**UV** 是纹理上的二维坐标，通常记为 `vec2`，分量 `u`（横向）、`v`（纵向）。

| 概念 | 说明 |
|------|------|
| 常见范围 | 多数情况下在 **`[0, 1] × [0, 1]`** 内，`(0,0)` 到 `(1,1)` 覆盖整张图 |
| OpenGL / WebGL 纹理原点 | **左下角** 为 `(0, 0)`，向右为 `+u`，向上为 `+v` |
| 与图片加载器差异 | 浏览器 `Image`、Canvas 的 2D 坐标常把 **左上角** 当作 `(0,0)`。上传时若未翻转，画面可能上下颠倒 |

上传 HTML `Image` 或 `Canvas` 时，可在 `texImage2D` 之前设置：

```javascript
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
```

本课 demo 用离屏 Canvas 画棋盘格，并配合显式 UV 属性，与 OpenGL 左下原点一致，一般无需翻转。

### 2.1 UV 如何到达片元着色器？

两种方式（本仓库前两课用过推导式，本课改用 **显式属性**）：

**方式 A（第 03 课）：** 由裁剪空间位置推导  
`vUv = aPosition.xy * 0.5 + 0.5`

**方式 B（本课推荐）：** 第二个顶点属性 `aUv`  
每个顶点自带 UV，经 varying 插值到片元，更贴近真实网格。

```glsl
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUv;
out vec2 vUv;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUv = aUv;
}
```

全屏四边形四角 UV 示例：左下 `(0,0)`、右下 `(1,0)`、左上 `(0,1)`、右上 `(1,1)`。详见 [`lessons/04-texture-sampling/`](../lessons/04-texture-sampling/)。

## 3. `sampler2D` 与 `texture()`

在 GLSL ES 3.00 中，2D 纹理采样器类型为 **`sampler2D`**，声明为 **uniform**：

```glsl
uniform sampler2D uTexture;
```

片元着色器采样（**注意：ES 3.00 用 `texture()`，不是旧版 `texture2D()`**）：

```glsl
vec4 texColor = texture(uTexture, vUv);
fragColor = texColor;
```

`texture()` 返回 **`vec4`**（RGBA）。若只需亮度，可用 `.rgb` 或 `.a`。

### 3.1 调试：用 UV 当颜色（可选）

学习时可暂时把 UV 可视化为颜色（本课 `fragment.glsl` 中留有注释示例）：

```glsl
// fragColor = vec4(vUv, 0.0, 1.0);  // 左下黑，右上偏黄绿
```

确认 UV 正确后再改回 `texture()`。

## 4. 纹理单元与 JavaScript 绑定

**sampler 类型的 uniform 在 CPU 侧不传「纹理对象句柄」，而是传「纹理单元编号」（整数）。**

流程概览：

1. `gl.createTexture()` 创建纹理对象  
2. `gl.bindTexture(gl.TEXTURE_2D, tex)` 绑定到当前单元  
3. `gl.texImage2D(...)` 上传像素  
4. `gl.texParameteri(...)` 设置过滤与环绕  
5. `gl.activeTexture(gl.TEXTURE0)` 选中单元 0  
6. 再次 `bindTexture`（绑定到该单元）  
7. `gl.uniform1i(uTextureLoc, 0)` 告诉着色器：「`uTexture` 读 **TEXTURE0**」

```javascript
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(uTextureLoc, 0);  // 0 表示 TEXTURE0，不是纹理 ID
```

若有多个纹理，可用 `TEXTURE1`、`TEXTURE2`…，对应 `uniform1i(loc, 1)` 等。**单元索引与 attribute location 无关。**

## 5. 过滤与环绕（入门）

上传像素后需设置参数，否则纹理处于「不完整」状态，采样可能全黑或报错。

| 参数 | 常用值 | 效果 |
|------|--------|------|
| `TEXTURE_MAG_FILTER` | `NEAREST` / `LINEAR` | 放大时：硬边像素块 vs 平滑插值 |
| `TEXTURE_MIN_FILTER` | `NEAREST` / `LINEAR` | 缩小时同理 |
| `TEXTURE_WRAP_S` / `TEXTURE_WRAP_T` | `CLAMP_TO_EDGE` / `REPEAT` | 超出 `[0,1]` 时：贴边拉伸 vs **重复平铺** |

本课 demo：

- **环绕**：`REPEAT`，配合 UV 滚动可看到棋盘格平铺  
- **过滤**：`LINEAR`（双线性），边缘更平滑  
- **mipmap**：本课 **不生成 mipmap**，`TEXTURE_MIN_FILTER` 设为 **`LINEAR`**（勿用 `LINEAR_MIPMAP_LINEAR`，否则未生成 mipmap 时纹理不完整）

若日后需要 mipmap，可在 `texImage2D` 后调用 `gl.generateMipmap(gl.TEXTURE_2D)`，再把 `TEXTURE_MIN_FILTER` 设为 `LINEAR_MIPMAP_LINEAR`。

## 6. 本课示例

完整文件见 [`lessons/04-texture-sampling/`](../lessons/04-texture-sampling/)。

**顶点着色器** `vertex.glsl`：`aPosition` + `aUv` → `vUv`。

```glsl
#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUv;
out vec2 vUv;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUv = aUv;
}
```

**片元着色器** `fragment.glsl`：采样纹理，并做轻微 UV 滚动与色调调制。

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;
out vec4 fragColor;
void main() {
  vec2 uv = fract(vUv + vec2(uTime * 0.05, 0.0));
  vec4 tex = texture(uTexture, uv);
  float tint = sin(uTime) * 0.08 + 0.92;
  fragColor = vec4(tex.rgb * tint, tex.a);
}
```

要点：

- **`aUv`** 与 **`aPosition`** 同为顶点属性，分别占用 location 0、1。  
- **`uTexture`** 绑定到纹理单元 0；片元用 `texture(uTexture, uv)` 取色。  
- **`fract(vUv + …)`** 配合 **`REPEAT`**，UV 超出 1 时图案重复；水平滚动由 `uTime` 驱动。  
- 纹理数据来自 **离屏 Canvas 棋盘格**（无需提交二进制图片）；换成 `new Image()` + URL 时流程相同，注意 `UNPACK_FLIP_Y_WEBGL`。

## 7. 自测题

请先独立思考，再查看 [`lessons/04-texture-sampling/ANSWERS.md`](../lessons/04-texture-sampling/ANSWERS.md)。

1. `uniform sampler2D uTexture` 在 JavaScript 里应如何赋值？`gl.uniform1i(uTextureLoc, 0)` 里的 `0` 表示什么？
2. OpenGL 纹理坐标 `(0, 0)` 在纹理的哪个角？从 HTML `Image` 上传时为什么有时需要 `UNPACK_FLIP_Y_WEBGL`？
3. 若设置了 `TEXTURE_MIN_FILTER` 为 `LINEAR_MIPMAP_LINEAR` 却从未调用 `generateMipmap`，画面可能出现什么问题？本课 demo 如何避免？

## 下一课预告

简单图案与坐标变换：用 UV 或 SDF 画圆、矩形，或引入矩阵把顶点变换到屏幕空间。
