# 第 08 课：基础光照

本目录包含第 08 课的顶点/片元着色器对，对应正文 [`docs/08-basic-lighting.md`](../../docs/08-basic-lighting.md)。**阶段一（语法与管线基础）最后一课。**

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` | WebGL2 演示页：伪球面法线 + 轨道光 |
| `vertex.glsl` | 顶点着色器：全屏四边形，传递 `vUv` |
| `fragment.glsl` | 片元着色器：环境光 + Lambert 漫反射 + Blinn-Phong 高光 |
| `ANSWERS.md` | 自测题参考答案 |

## 本课着色器在做什么

1. **伪球面法线**：由居中 UV 计算 `normalize(vec3(p, sqrt(1-r²)))`，无需加载网格。
2. **Lambert 漫反射**：`max(dot(N, L), 0.0)`，背光面为 0。
3. **Blinn-Phong 高光**：半角向量 `H = normalize(L + V)`，`pow(dot(N, H), shininess)`。
4. **环境光**：常数 `ambient` 避免背光全黑。
5. **`uTime`**：光源在水平面轨道运动。

## 如何运行

1. 在仓库根目录启动静态服务器：

   ```bash
   npx serve
   # 或
   python3 -m http.server 8080
   ```

2. 浏览器打开：`http://localhost:8080/lessons/08-basic-lighting/`（端口以实际为准）。

3. 应看到深蓝背景上的蓝色球体，高光随轨道光移动。编译或链接失败时页面会显示错误信息。

也可阅读对照文档 [`docs/08-basic-lighting.md`](../../docs/08-basic-lighting.md) 中的 N·L 与法线归一化说明。
