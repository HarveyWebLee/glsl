# 第 14 课：三维网格光照

本目录对应正文 [`docs/14-mesh-lighting.md`](../../docs/14-mesh-lighting.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | UV 球体 + 方向光 + 轨道点光 |
| `vertex.glsl` | 传递世界空间位置与法线 |
| `fragment.glsl` | 环境光 + Lambert + Blinn-Phong（世界空间） |
| `ANSWERS.md` | 自测题参考答案 |

## 本课要点

1. **每顶点法线**：`createSphereMesh` 生成单位法线，经 `uNormalMatrix` 变换到世界空间。
2. **法线矩阵**：模型矩阵左上 3×3 的 **逆转置**，正确处理非均匀缩放下的法线。
3. **双光源**：平行光（固定方向）+ 点光（位置 + 距离衰减）。
4. **世界空间光照**：`N`、`L`、`V` 均在世界空间计算，与 `uViewPos`（相机世界坐标）一致。

## 如何运行

```bash
python3 -m http.server 8080
```

访问 `http://localhost:8080/lessons/14-mesh-lighting/`。
