# 第 09 课：进阶 SDF

本目录包含第 09 课的顶点/片元着色器对，对应正文 [`docs/09-advanced-sdf.md`](../../docs/09-advanced-sdf.md)。建立在第 05 课单形状 SDF 之上。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：硬布尔、smoothmin、多形状软融合 |
| `vertex.glsl` | 顶点着色器：全屏四边形 + `vUv` |
| `fragment.glsl` | 片元着色器：`opIntersection` / `opSmoothUnion` |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **左侧**：圆 ∩ 旋转矩形，硬交集 `max(dA, dB)`。
2. **中央**：两圆 `opSmoothUnion`，`k` 控制熔接宽度，对比硬 `min`。
3. **右侧**：圆 + 矩形 + 小圆链式 smoothmin。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/09-advanced-sdf/`（端口以实际为准）。

3. 应看到左蓝硬交集、中橙平滑双圆、右紫三形状软融合。编译或链接失败时页面会显示错误信息。
