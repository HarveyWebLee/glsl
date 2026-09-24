# 第 15 课：综合场景收官

本目录对应正文 [`docs/15-3d-scene-capstone.md`](../../docs/15-3d-scene-capstone.md)。**阶段三（真实 3D 图形）最后一课。**

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 地面 + 球体 + 立方体；透视相机轨道；双光源光照 |
| `vertex.glsl` / `fragment.glsl` | 世界空间 Blinn-Phong |
| `ANSWERS.md` | 自测题参考答案 |

## 综合了哪些技术？

| 来源课次 | 技术 |
|----------|------|
| **11** | MVP 矩阵、程序化网格 |
| **12** | 透视投影、视锥 |
| **13** | `lookAt` 轨道相机、深度测试 |
| **14** | 法线矩阵、环境光 + Lambert + Blinn-Phong |

## 如何运行

```bash
python3 -m http.server 8080
```

访问 `http://localhost:8080/lessons/15-3d-scene-capstone/`。
