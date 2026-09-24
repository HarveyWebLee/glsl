# GLSL 学习仓库

Harvey 从零学习 GLSL 的笔记与示例代码仓库。每节课的文档、着色器文件和自测题答案都会提交到这里，方便复习与对照。

## 如何学习

1. 先看 [`docs/00-roadmap.md`](docs/00-roadmap.md) 了解整体路线。
2. 按课次阅读 `docs/` 下的正文，再打开 `lessons/` 里对应的着色器文件。
3. 每课末尾有自测题；先自己作答，再对照 `ANSWERS.md`。
4. 着色器示例统一使用 **GLSL ES 3.00**（`#version 300 es`），面向 WebGL2，暂不依赖 Three.js。

## 目录说明

```
README.md                          # 本文件：仓库用途与进度
docs/
  00-roadmap.md                    # 学习路线（简短）
  01-pipeline-and-skeleton.md      # 第 01 课正文
lessons/
  01-hello-shaders/
    README.md                      # 本课文件说明与运行提示
    vertex.glsl                    # 顶点着色器
    fragment.glsl                  # 片元着色器
    ANSWERS.md                     # 自测题答案
```

后续课程会按同样结构追加：`docs/02-*.md` 对应 `lessons/02-*/`。

## 当前进度

| 课次 | 主题 | 状态 |
|------|------|------|
| 01 | 管线概览与最小着色器骨架 | ✅ 已完成 |
| 02+ | 待定 | 未开始 |

## 约定

- **文档语言**：简体中文（zh-Hans）。
- **着色器方言**：GLSL ES 3.00，首行写 `#version 300 es`。
- **精度**：片元着色器中声明 `precision`（ES 要求）。
- **颜色输出**：使用自定义 `out vec4`（如 `fragColor`），不使用已废弃的 `gl_FragColor`。
