# 第 04 课：纹理采样

本目录包含第 04 课的顶点/片元着色器对，对应正文 [`docs/04-texture-sampling.md`](../../docs/04-texture-sampling.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：生成棋盘格纹理、绑定 `sampler2D`、UV 滚动动画 |
| `vertex.glsl` | 顶点着色器：读 **属性** `aPosition` 与 `aUv`，输出 `vUv` |
| `fragment.glsl` | 片元着色器：用 `texture(uTexture, uv)` 采样，配合 `uTime` 做水平滚动与轻微色调变化 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **顶点属性**：`aPosition`（location 0）与 **`aUv`（location 1）** 来自交错 VBO；`vUv` 经插值传到片元。
2. **纹理**：JavaScript 用离屏 Canvas 绘制彩色棋盘格，`texImage2D` 上传到 GPU；`REPEAT` + `LINEAR` 过滤。
3. **采样**：`uniform sampler2D uTexture` 绑定纹理单元 0；片元里 `fract(vUv + vec2(uTime * 0.05, 0.0))` 让图案水平平铺滚动。
4. **`uTime`** 同时驱动轻微亮度起伏（`sin(uTime)`），便于确认动画循环在运行。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/04-texture-sampling/`（端口以实际为准）。

3. 应看到全屏彩色棋盘格缓慢向右平铺滚动，并带轻微明暗呼吸。编译或链接失败时页面会显示错误信息。

也可阅读对照文档 [`docs/04-texture-sampling.md`](../../docs/04-texture-sampling.md) 中的 UV、纹理单元与过滤说明。

## 顶点数据提示

全屏四边形使用 **交错 VBO**（`x, y, z, u, v`），由共用工具 `createFullscreenQuadWithUv` 创建：

- `aPosition` → attribute location **0**（`vec3`）  
- `aUv` → attribute location **1**（`vec2`）  
- 四角 UV：左下 `(0,0)`、右下 `(1,0)`、左上 `(0,1)`、右上 `(1,1)`

若改用 `new Image()` 加载 URL，在 `texImage2D` 前可考虑 `gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)`，详见正文。
