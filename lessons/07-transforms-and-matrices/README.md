# 第 07 课：变换矩阵

本目录包含第 07 课的顶点/片元着色器对，对应正文 [`docs/07-transforms-and-matrices.md`](../../docs/07-transforms-and-matrices.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：JS 每帧构建 `mat3` 并上传 `uModel` |
| `vertex.glsl` | 顶点着色器：`uModel * vec3(aPosition.xy, 1.0)` 做 2D TRS |
| `fragment.glsl` | 片元着色器：圆 SDF + 网格线，便于观察 UV 随顶点运动 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **单位四边形**：`createUnitQuadWithUv` 提供约 `[-0.5, 0.5]` 的局部网格，非全屏。
2. **顶点变换**：`uModel`（`mat3`）在顶点着色器中对 `aPosition` 做平移、旋转、缩放。
3. **JS 侧**：`mat3FromTRS(tx, ty, rot, sx, sy)` 每帧计算矩阵，`gl.uniformMatrix3fv` 上传。
4. **片元**：圆 SDF 与网格线画在局部 UV 上，四边形旋转/移动时图案一起变形。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/07-transforms-and-matrices/`（端口以实际为准）。

3. 应看到带网格的圆角方块在屏幕中平移、旋转、缩放。编译或链接失败时页面会显示错误信息。

也可阅读对照文档 [`docs/07-transforms-and-matrices.md`](../../docs/07-transforms-and-matrices.md) 中的列主序与 MVP 概念说明。

## 顶点数据提示

- `aPosition` → attribute location **0**（`vec3`，局部坐标）
- `aUv` → attribute location **1**（`vec2`）
- `uModel` → uniform **`mat3`**（列主序，与 `gl.uniformMatrix3fv(..., false, ...)` 对应）
