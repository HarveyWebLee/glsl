# GLSL 学习仓库

Harvey 从零学习 GLSL 的笔记与示例代码仓库。每节课的文档、着色器文件和自测题答案都会提交到这里，方便复习与对照。

## 如何学习

1. 先看 [`docs/00-roadmap.md`](docs/00-roadmap.md) 了解整体路线。
2. 按课次阅读 `docs/` 下的正文，再打开 `lessons/` 里对应的着色器文件。
3. 每课末尾有自测题；先自己作答，再对照 `ANSWERS.md`。
4. 着色器示例统一使用 **GLSL ES 3.00**（`#version 300 es`），面向 WebGL2，暂不依赖 Three.js。
5. 第 01–10 课提供原生 WebGL2 演示页（`lessons/*/index.html`），可直接在浏览器中查看着色器效果。

## 如何运行演示

本仓库的 HTML 演示通过 `fetch` 加载同目录下的 `.glsl` 文件，**不能**直接用 `file://` 双击打开（浏览器会拦截本地文件请求）。请在仓库根目录启动静态服务器，例如：

```bash
# 任选其一
npx serve
python3 -m http.server 8080
```

然后在浏览器中访问：

| 课次 | 地址（以 `python3 -m http.server 8080` 为例） |
|------|-----------------------------------------------|
| 第 01 课 | http://localhost:8080/lessons/01-hello-shaders/ |
| 第 02 课 | http://localhost:8080/lessons/02-types-and-vectors/ |
| 第 03 课 | http://localhost:8080/lessons/03-uniforms-and-attributes/ |
| 第 04 课 | http://localhost:8080/lessons/04-texture-sampling/ |
| 第 05 课 | http://localhost:8080/lessons/05-patterns-and-sdf/ |
| 第 06 课 | http://localhost:8080/lessons/06-noise-and-animation/ |
| 第 07 课 | http://localhost:8080/lessons/07-transforms-and-matrices/ |
| 第 08 课 | http://localhost:8080/lessons/08-basic-lighting/ |
| 第 09 课 | http://localhost:8080/lessons/09-advanced-sdf/ |
| 第 10 课 | http://localhost:8080/lessons/10-procedural-scene/ |

无需安装依赖、无需打包工具；演示使用原生 WebGL2（`canvas.getContext('webgl2')`）。

## 目录说明

```
README.md                          # 本文件：仓库用途与进度
docs/
  00-roadmap.md                    # 学习路线
  01-pipeline-and-skeleton.md      # 第 01 课正文
  …                                # 02–10 课正文
lessons/
  _shared/
    webgl2-bootstrap.js            # 各课 demo 共用的极简 WebGL2 工具
  01-hello-shaders/ … 10-procedural-scene/
    README.md                      # 本课文件说明与运行提示
    index.html                     # WebGL2 演示页
    vertex.glsl / fragment.glsl    # 着色器
    ANSWERS.md                     # 自测题答案
```

## 当前进度

### 阶段一：语法与管线基础 ✅

| 课次 | 主题 | 状态 |
|------|------|------|
| 01 | 管线概览与最小着色器骨架 | ✅ |
| 02 | 类型与向量运算 | ✅ |
| 03 | uniform 与顶点属性 | ✅ |
| 04 | 纹理采样 | ✅ |
| 05 | 简单图案与 SDF | ✅ |
| 06 | 噪声与程序化动画 | ✅ |
| 07 | 变换矩阵 | ✅ |
| 08 | 基础光照 | ✅ |

### 阶段二：图形小实验 ✅

| 课次 | 主题 | 状态 |
|------|------|------|
| 09 | 进阶 SDF | ✅ |
| 10 | 综合小实验 | ✅ |

**本路线主体已完结（01–10）。** 纯色与渐变已在 02–03 课覆盖。FBO、PBR 等为可选进阶，见 [`docs/00-roadmap.md`](docs/00-roadmap.md)。

## 约定

- **文档语言**：简体中文（zh-Hans）。
- **着色器方言**：GLSL ES 3.00，首行写 `#version 300 es`。
- **精度**：片元着色器中声明 `precision`（ES 要求）。
- **颜色输出**：使用自定义 `out vec4`（如 `fragColor`），不使用已废弃的 `gl_FragColor`。
