# 第 03 课自测题答案

> 建议先自己做题，再展开本页。

## 1. 属性 `in` 与 `uniform` 在「每个顶点是否相同」和「谁负责赋值」上有什么区别？

| | 属性 `in`（如 `aPosition`） | `uniform`（如 `uTime`） |
|---|---------------------------|-------------------------|
| 每个顶点 | **可以不同**（逐顶点一份） | **整次 draw 调用内相同**（逐 draw 一份） |
| 谁赋值 | CPU 通过 **VBO + `vertexAttribPointer`** 绑定，GPU 按顶点读取 | CPU 通过 **`gl.uniform*`** 在 draw 前上传 |
| 典型用途 | 位置、法线、UV 等几何数据 | 时间、颜色、矩阵、开关等全局参数 |

简记：**属性 = 逐顶点；uniform = 逐 draw**。

## 2. 能否在 GLSL 里写 `layout(location = 0) uniform float uTime;` 来固定 uniform 的 location？它与 `layout(location = 0) in vec3 aPosition;` 的编号是否共用？

**WebGL2 / GLSL ES 3.00 中，uniform 不支持 `layout(location = …)` 这种显式绑定**（与 OpenGL 桌面版不同）。uniform 的「槽位」由链链后的程序内部决定，JavaScript 侧用 **`gl.getUniformLocation(program, 'uTime')`** 按**名称**查询。

`layout(location = 0) in aPosition` 里的 **`0` 只指顶点属性 location**，与 uniform 无关；**两套编号不共用**。属性 location 0 表示「第 0 号顶点属性输入」，不是「第 0 号 uniform」。

## 3. 若片元着色器声明了 `uniform float uTime`，但 JavaScript 在 `drawArrays` 前忘记调用 `gl.uniform1f`，画面会怎样？

uniform 在链链成功后会保留**上一次**上传的值（或链链后未设置时的**默认值**，标量 float 一般为 **0.0**）。

- **从未上传过**：`uTime` 为 0，`sin(0)=0`，混合因子固定，画面**静止**在某一帧状态，不会按预期动画。
- **曾上传过**：会继续使用**旧值**，动画可能卡住或表现异常。

因此每帧（或每次需要更新时）在 `useProgram` 之后、`drawArrays` 之前应调用对应的 `gl.uniform*`。本课演示用 `requestAnimationFrame` 每帧更新 `uTime`。
