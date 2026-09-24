# 第 10 课：综合小实验

本目录包含第 10 课的顶点/片元着色器对，对应正文 [`docs/10-procedural-scene.md`](../../docs/10-procedural-scene.md)。**阶段二（图形小实验）最后一课。**

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 综合演示页 |
| `vertex.glsl` | 顶点着色器：全屏四边形 |
| `fragment.glsl` | 片元着色器：SDF + 噪声域扭曲 + 梯度法线 + 简易光照 + 动画调色 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **噪声域扭曲**（第 06 课）：`fbm` 偏移 SDF 采样坐标，形状边缘有机变形。
2. **平滑 SDF 组合**（第 09 课）：三圆 `opSmoothUnion` 熔接成流动形体。
3. **梯度法线**（第 08 课延伸）：对 `sceneDistance` 数值求导得近似法线，做 Lambert 漫反射。
4. **动画调色**：`palette(fbm(...))` 与 `uTime` 驱动色相变化；rim 光增强体积感。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/10-procedural-scene/`（端口以实际为准）。

3. 应看到中央熔融状有机形体，边缘被噪声扭曲，颜色与高光缓慢变化。编译或链接失败时页面会显示错误信息。
