# 第 06 课：噪声与程序化动画

本目录包含第 06 课的顶点/片元着色器对，对应正文 [`docs/06-noise-and-animation.md`](../../docs/06-noise-and-animation.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：程序化噪声云、UV 域扭曲与 fBm |
| `vertex.glsl` | 顶点着色器：读 **属性** `aPosition` 与 `aUv`，输出 `vUv` |
| `fragment.glsl` | 片元着色器：`hash` / `valueNoise` / `fbm` + `uTime` 动画 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **hash**：`fract(sin(dot(p, …)))` 由 **位置** `p` 决定伪随机值，同一 UV 每帧稳定。
2. **value noise**：对整数格点 hash 后双线性插值，得到连续噪声。
3. **fBm**：两层不同频率噪声叠加，形成云状层次。
4. **动画**：用 `uTime` **扭曲采样坐标**（domain warping），让图案流动；不是每帧对同一像素重新随机。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/06-noise-and-animation/`（端口以实际为准）。

3. 应看到深蓝背景上缓慢流动的柔和噪声云，带轻微颗粒感。编译或链接失败时页面会显示错误信息。

也可阅读对照文档 [`docs/06-noise-and-animation.md`](../../docs/06-noise-and-animation.md) 中的 hash 与纹理噪声对比说明。

## 顶点数据提示

全屏四边形使用 **交错 VBO**（`x, y, z, u, v`），由共用工具 `createFullscreenQuadWithUv` 创建：

- `aPosition` → attribute location **0**（`vec3`）
- `aUv` → attribute location **1**（`vec2`）

本课 **不需要纹理**；噪声完全在片元着色器内由数学函数生成。
