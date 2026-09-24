# 第 01 课：Hello Shaders

本目录包含第 01 课的最小顶点/片元着色器对，对应正文 [`docs/01-pipeline-and-skeleton.md`](../../docs/01-pipeline-and-skeleton.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：加载本目录 `vertex.glsl` / `fragment.glsl` 并绘制全屏四边形 |
| `vertex.glsl` | 顶点着色器：读 `aPosition`，写 `gl_Position` 与 `vColor` |
| `fragment.glsl` | 片元着色器：读插值后的 `vColor`，写 `fragColor` |
| `ANSWERS.md` | 自测题参考答案 |

## 如何运行

1. 在仓库根目录启动静态服务器（`file://` 无法 `fetch` 本地 `.glsl`）：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/01-hello-shaders/`（端口以实际为准）。

3. 应看到由顶点颜色插值形成的四角渐变。若着色器编译/链接失败，页面会显示错误日志。

也可阅读对照文档 [`docs/01-pipeline-and-skeleton.md`](../../docs/01-pipeline-and-skeleton.md) 中的代码块逐行比对。

## 顶点数据提示（供日后 WebGL 使用）

若用全屏四边形演示，典型裁剪空间顶点（`vec3`，z 可为 0）例如：

```
(-1, -1, 0), (1, -1, 0), (-1, 1, 0), (1, 1, 0)
```

`aPosition` 经 `* 0.5 + 0.5` 后会得到四角与中心的渐变颜色。
