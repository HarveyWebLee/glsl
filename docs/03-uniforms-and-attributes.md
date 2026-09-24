# 第 03 课：uniform 与顶点属性

前两课已接触 `layout(location = 0) in vec3 aPosition` 与 varying（`out` / `in`）。本课区分 **顶点属性** 与 **uniform**：前者随顶点变化，后者在一次绘制调用内对所有顶点、所有片元相同，且由 JavaScript 在 CPU 侧上传。

## 1. 属性 `in` 与 `uniform` 对比

| | 顶点属性 `in` | `uniform` |
|---|--------------|-----------|
| 更新粒度 | **逐顶点**（每个顶点可不同） | **逐 draw**（一次 `drawArrays` / `drawElements` 内相同） |
| 典型来源 | VBO + `vertexAttribPointer` | `gl.uniform1f` / `uniform3f` / `uniformMatrix4fv` 等 |
| GLSL 声明 | `layout(location = N) in vec3 aPosition;` | `uniform float uTime;` |
| 插值 | 顶点输出可经 varying 插值到片元 | **不插值**，片元读到的值与顶点相同 |
| 谁能在着色器里读 | 主要在**顶点着色器**读属性（片元一般不直接读 attribute） | **顶点与片元着色器均可**读同一 uniform |

记忆口诀：**属性跟着顶点走，uniform 跟着 draw 走**。

### 1.1 命名习惯（本仓库约定）

| 前缀 | 含义 | 示例 |
|------|------|------|
| `a` | attribute | `aPosition` |
| `u` | uniform | `uTime`、`uColorA` |
| `v` | varying（顶点 out → 片元 in） | `vUv` |

## 2. `layout(location = N)` 只用于属性

在 GLSL ES 3.00（WebGL2）中，**只有顶点输入（attribute）** 可以用 `layout(location = N)` 指定槽位：

```glsl
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUv;   // 若有多路属性，可继续 1、2…
```

JavaScript 侧对应：

```javascript
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
// location 1 则 enableVertexAttribArray(1) + vertexAttribPointer(1, …)
```

**uniform 在 WebGL2 中不能**写 `layout(location = …)` 来固定编号。uniform 位置由链链后的程序决定，需用 **`gl.getUniformLocation(program, 'uTime')`** 按名称查询。

重要：**属性 location 编号与 uniform 无关，两套体系不共用**。`location = 0` 只表示「第 0 号顶点属性」，不是「第 0 号 uniform」。

## 3. 顶点与片元都能读 uniform

uniform 在链链进同一 `program` 后，**顶点着色器与片元着色器声明同名 uniform** 即可共享同一份 CPU 上传的值：

```glsl
// vertex.glsl
uniform float uTime;
void main() {
  // 顶点阶段也可读 uTime，例如做顶点动画
}

// fragment.glsl
uniform float uTime;
void main() {
  // 片元阶段读 uTime 做颜色动画
}
```

本课示例主要在片元阶段使用 `uTime`；顶点阶段只处理属性 `aPosition` 与 varying `vUv`。

## 4. JavaScript 如何设置 uniform

流程：**链链 program → 查询 location → 每帧 useProgram → uniform* → draw**。

### 4.1 查询位置

```javascript
var uTimeLoc = gl.getUniformLocation(program, 'uTime');
var uColorALoc = gl.getUniformLocation(program, 'uColorA');
```

若着色器里未使用该 uniform 或名称拼错，`getUniformLocation` 返回 **`null`**；对 `null` 调用 `uniform*` 会被静默忽略，容易难以排查，建议链链后检查关键 uniform。

### 4.2 上传标量与向量

| GLSL 类型 | 常用 API | 示例 |
|-----------|----------|------|
| `float` | `gl.uniform1f(loc, x)` | `gl.uniform1f(uTimeLoc, 1.5)` |
| `vec2` | `gl.uniform2f(loc, x, y)` | `gl.uniform2f(uResLoc, w, h)` |
| `vec3` | `gl.uniform3f(loc, x, y, z)` | `gl.uniform3f(uColorALoc, 0.2, 0.4, 0.9)` |
| `vec3`（数组形式） | `gl.uniform3fv(loc, array)` | `gl.uniform3fv(uColorALoc, new Float32Array([0.2, 0.4, 0.9]))` |
| `vec4` | `gl.uniform4f` / `uniform4fv` | 同上，四个分量 |

`uniform3fv` 适合颜色、方向等已放在 `Float32Array` 里的数据；`uniform3f` 适合直接传三个数，对初学者更直观。

### 4.3 与 `requestAnimationFrame` 配合

动画通常每帧更新 `uTime`（秒）：

```javascript
function render(timeMs) {
  gl.useProgram(program);
  gl.uniform1f(uTimeLoc, timeMs * 0.001);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
```

本课 demo 使用共用的 `WebGL2Bootstrap.startRenderLoop` 封装上述循环。

### 4.4 uniform 的生命周期提示

- 上传的值会保留在 **当前 WebGL 状态** 中，直到再次调用 `uniform*` 或链链新 program。
- **忘记上传**：标量 float 默认 **0.0**，画面可能静止或颜色不对。
- **useProgram 之后、draw 之前** 上传，确保写入当前绑定的 program。

## 5. 本课示例

完整文件见 [`lessons/03-uniforms-and-attributes/`](../lessons/03-uniforms-and-attributes/)。

**顶点着色器** `vertex.glsl`：属性 `aPosition` → `gl_Position` 与 `vUv`。

```glsl
#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
out vec2 vUv;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUv = aPosition.xy * 0.5 + 0.5;
}
```

**片元着色器** `fragment.glsl`：uniform 驱动颜色动画。

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
out vec4 fragColor;
void main() {
  float t = sin(uTime) * 0.5 + 0.5;
  float uvWave = sin(vUv.x * 6.28318 + uTime * 1.5) * 0.06;
  t = clamp(t + uvWave, 0.0, 1.0);
  fragColor = vec4(mix(uColorA, uColorB, t), 1.0);
}
```

要点：

- **`aPosition`** 来自 VBO，四个角顶点坐标不同，经插值得到 `vUv`。
- **`uTime`、`uColorA`、`uColorB`** 由 JS 每帧 `uniform1f` / `uniform3f` 上传，整屏片元共享。
- `sin(uTime)` 把时间在 `[0,1]` 间振荡，再 `mix` 两色；`vUv.x` 上的轻微正弦调制让过渡带略有波纹。

## 6. 自测题

请先独立思考，再查看 [`lessons/03-uniforms-and-attributes/ANSWERS.md`](../lessons/03-uniforms-and-attributes/ANSWERS.md)。

1. 属性 `in` 与 `uniform` 在「每个顶点是否相同」和「谁负责赋值」上有什么区别？
2. 能否在 GLSL 里写 `layout(location = 0) uniform float uTime;` 来固定 uniform 的 location？它与 `layout(location = 0) in vec3 aPosition;` 的编号是否共用？
3. 若片元着色器声明了 `uniform float uTime`，但 JavaScript 在 `drawArrays` 前忘记调用 `gl.uniform1f`，画面会怎样？

## 下一课预告

纹理采样：`sampler2D`、`texture()`、UV 与图片坐标。
