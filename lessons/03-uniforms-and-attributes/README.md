# 第 03 课：uniform 与顶点属性

本目录包含第 03 课的顶点/片元着色器对，对应正文 [`docs/03-uniforms-and-attributes.md`](../../docs/03-uniforms-and-attributes.md)。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：加载着色器、上传 uniform、用 `requestAnimationFrame` 驱动动画 |
| `vertex.glsl` | 顶点着色器：读 **属性** `aPosition`，写 `gl_Position` 与插值用 `vUv` |
| `fragment.glsl` | 片元着色器：读 **uniform** `uTime`、`uColorA`、`uColorB`，用 `sin` 与 `mix` 做颜色动画 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **顶点属性** `aPosition`（location 0）来自 VBO，每个顶点各有一份；顶点阶段把 `aPosition.xy` 映射为 `[0,1]` 的 `vUv`。
2. **uniform** 由 JavaScript 在每次绘制前上传：`uTime` 随动画变化，`uColorA` / `uColorB` 为两种基色。
3. 片元阶段用 `sin(uTime)` 得到 `[0,1]` 混合因子，再叠加轻微 UV 波动，在两种颜色间 `mix` 输出。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/03-uniforms-and-attributes/`（端口以实际为准）。

3. 应看到全屏双色在蓝橙之间平滑呼吸式变化。编译或链接失败时页面会显示错误信息。

也可阅读对照文档 [`docs/03-uniforms-and-attributes.md`](../../docs/03-uniforms-and-attributes.md) 中的术语与 JS 传参说明。

## 顶点数据提示（供日后 WebGL 使用）

全屏四边形裁剪空间顶点（`vec3`）例如：

```
(-1, -1, 0), (1, -1, 0), (-1, 1, 0), (1, 1, 0)
```

`aPosition` 绑定在 **attribute location 0**；uniform 名称与 location 无关，由 `getUniformLocation` 查询。
