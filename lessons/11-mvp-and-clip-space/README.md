# 第 11 课：三维坐标与 MVP

本目录包含第 11 课的顶点/片元着色器与演示页，对应正文 [`docs/11-mvp-and-clip-space.md`](../../docs/11-mvp-and-clip-space.md)。**阶段三（真实 3D 图形）第一课。**

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示：六面色立方体 + MVP 矩阵 |
| `vertex.glsl` | `gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0)` |
| `fragment.glsl` | 传递顶点颜色 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **MVP 管线**：模型矩阵 `uModel`、视图矩阵 `uView`、投影矩阵 `uProjection` 在 JS 侧构建并上传。
2. **列主序**：`gl.uniformMatrix4fv(loc, false, array)` 的 `false` 表示数组已是列主序。
3. **裁剪与透视除法**：`gl_Position` 为裁剪空间；GPU 自动做 `xyz / w` 得到 NDC，再映射到视口。
4. **程序化立方体**：`WebGL2Math.createCubeMesh` 在 JS 生成顶点/法线/面色，无外部模型文件。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/11-mvp-and-clip-space/`

3. 应看到轨道相机环绕的彩色自转立方体。编译失败时页面会显示错误信息。
