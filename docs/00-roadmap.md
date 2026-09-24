# 学习路线

本仓库按「概念 → 最小可编译示例 → 自测」推进。路线会随学习进度更新，此处只列近期目标。

## 阶段一：语法与管线基础

| 课次 | 主题 | 要点 |
|------|------|------|
| **01** | 管线与着色器骨架 | GLSL 是什么、顶点/片元分工、`main`/`gl_Position`、varying、`precision` |
| **02** | 类型与向量运算 | `float`/`int`/`bool`、`vec2`/`vec3`/`vec4`、swizzle、常用内置函数 |
| **03** | uniform 与属性 | `layout(location=…)`、`uniform` 传参、`getUniformLocation`、`requestAnimationFrame` |
| 04 | 纹理采样 | `sampler2D`、`texture()`、UV 坐标 |

## 阶段二：图形小实验（计划中）

- 纯色与渐变
- 简单图案（圆、矩形）
- 噪声与动画

## 阶段三：WebGL2 整合（计划中）

- 最小 WebGL2 程序把 `lessons/` 里的着色器跑起来
- 缓冲区、VAO、绘制调用

> 当前 **第 01、02、03 课** 已落库；其余课次在学到时再添加，避免一次性堆砌大纲。
