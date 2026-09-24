# 第 12 课：透视投影与视锥体

本目录对应正文 [`docs/12-perspective-and-frustum.md`](../../docs/12-perspective-and-frustum.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 立方体 + 视锥线框；滑块调节 FOV / near / far |
| `vertex.glsl` / `fragment.glsl` | 实体网格着色器 |
| `line-vertex.glsl` / `line-fragment.glsl` | 视锥线框 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课要点

1. **透视矩阵**：`mat4Perspective(fovy, aspect, near, far)` 将视锥映射到裁剪体积。
2. **视锥参数**：垂直视场角 FOV、宽高比 aspect、近裁剪面 near、远裁剪面 far。
3. **线框可视化**：`createFrustumLineMesh` 在相机空间绘制视锥边，随参数实时更新。
4. **裁剪**：视锥外的几何在 GPU 裁剪阶段被丢弃。

## 如何运行

```bash
python3 -m http.server 8080
```

访问 `http://localhost:8080/lessons/12-perspective-and-frustum/`，拖动右侧滑块观察视锥与立方体变化。
