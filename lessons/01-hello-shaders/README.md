# 第 01 课：Hello Shaders

本目录包含第 01 课的最小顶点/片元着色器对，对应正文 [`docs/01-pipeline-and-skeleton.md`](../../docs/01-pipeline-and-skeleton.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `vertex.glsl` | 顶点着色器：读 `aPosition`，写 `gl_Position` 与 `vColor` |
| `fragment.glsl` | 片元着色器：读插值后的 `vColor`，写 `fragColor` |
| `ANSWERS.md` | 自测题参考答案 |

## 如何「运行」

本 PR **不包含** WebGL 应用或 `package.json`。你可以：

1. **阅读对照**：与文档中的代码块逐行比对。
2. **后续整合**：等仓库加入 WebGL2 示例后，将这两个文件编译、链接并绘制全屏三角形或四边形。
3. **外部工具**：把源码粘贴到 [ShaderToy](https://www.shadertoy.com/) 等工具时需注意语法差异；本课文件是按 WebGL2 顶点/片元分离写法设计的，不是单文件 ShaderToy 片段。

## 顶点数据提示（供日后 WebGL 使用）

若用全屏四边形演示，典型裁剪空间顶点（`vec3`，z 可为 0）例如：

```
(-1, -1, 0), (1, -1, 0), (-1, 1, 0), (1, 1, 0)
```

`aPosition` 经 `* 0.5 + 0.5` 后会得到四角与中心的渐变颜色。
