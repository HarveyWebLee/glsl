# 第 02 课：类型与向量运算

本目录包含第 02 课的顶点/片元着色器对，对应正文 [`docs/02-types-and-vectors.md`](../../docs/02-types-and-vectors.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：加载本目录 `vertex.glsl` / `fragment.glsl` 并绘制全屏四边形 |
| `vertex.glsl` | 顶点着色器：读 `aPosition`，写 `gl_Position` 与插值用 `vUv` |
| `fragment.glsl` | 片元着色器：用 `normalize`、`dot`、`smoothstep`、`mix` 做双色渐变 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. 顶点阶段把 `aPosition.xy` 映射到 `[0,1]` 作为 `vUv`（与第 01 课相同的坐标变换思路）。
2. 片元阶段以 `(0.5, 0.5)` 为中心，计算单位方向 `dir`，再与对角线方向做点积得到混合因子 `t`。
3. 经 `smoothstep` 柔化后，用 `mix` 在蓝橙两色之间插值，输出 `fragColor`。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/02-types-and-vectors/`（端口以实际为准）。

3. 应看到以屏幕中心为基准的蓝橙对角渐变（`normalize` / `dot` / `smoothstep` / `mix`）。编译或链接失败时页面会显示错误信息。

也可阅读对照文档 [`docs/02-types-and-vectors.md`](../../docs/02-types-and-vectors.md) 中的代码块与术语说明。

## 顶点数据提示（供日后 WebGL 使用）

全屏四边形裁剪空间顶点（`vec3`）例如：

```
(-1, -1, 0), (1, -1, 0), (-1, 1, 0), (1, 1, 0)
```

`vUv` 将覆盖 `[0,1]×[0,1]`，片元着色器中的 `center = vec2(0.5)` 即屏幕中心。
