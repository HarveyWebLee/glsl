# 第 13 课：相机与深度

本目录对应正文 [`docs/13-camera-and-depth.md`](../../docs/13-camera-and-depth.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 轨道 `lookAt` 相机 + 深度测试 + 网格与两立方体 |
| `vertex.glsl` / `fragment.glsl` | 单色网格/立方体 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课要点

1. **`mat4LookAt(eye, center, up)`**：构建视图矩阵，将世界坐标变换到相机空间。
2. **`gl.enable(gl.DEPTH_TEST)`**：启用深度缓冲，近处物体遮挡远处。
3. **每帧清除**：`clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT)`。
4. **Z-fighting**：近平面过近或深度范围过大时，同深度表面会闪烁；可拉大 `near`、缩小 `far/near` 比，或使用 `gl.polygonOffset`（本课文档提及）。

## 如何运行

```bash
python3 -m http.server 8080
```

访问 `http://localhost:8080/lessons/13-camera-and-depth/`，观察轨道相机下立方体相互遮挡是否正确。
