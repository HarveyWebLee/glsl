# 第 09 课：进阶 SDF

阶段一结束后，阶段二从 **多形状 SDF 组合** 深入。第 05 课画了单圆、单矩形；本课引入 **硬布尔** 与 **smoothmin 平滑并集**，构建更丰富的场景。

## 1. 硬布尔运算

| 运算 | 公式 | 含义 |
|------|------|------|
| **并集** | `min(dA, dB)` | A 或 B 内 |
| **交集** | `max(dA, dB)` | A 且 B 内 |
| **差集** | `max(dA, -dB)` | A 内且不在 B 内 |

硬布尔在交界处 **尖角、折线**，适合机械风；有机造型需要 **软过渡**。

## 2. 平滑并集 smoothmin

```glsl
float opSmoothUnion(float dA, float dB, float k) {
  float h = clamp(0.5 + 0.5 * (dB - dA) / k, 0.0, 1.0);
  return mix(dB, dA, h) - k * h * (1.0 - h);
}
```

**`k`** 控制融合带宽度：越大越「熔接」。可链式调用组合多个形状。`k → 0` 趋近 `min`。

## 3. 与 `smoothstep` 抗锯齿的区别

| 技术 | 对象 |
|------|------|
| **`aaFill` / `smoothstep`** | 单形状边缘与背景 |
| **`smoothmin`** | 形状 **之间** 的软融合 |

先合成场景距离 `d`，再 `aaFill(d, edgeWidth)` 上色。

## 4. 本课示例

完整文件见 [`lessons/09-advanced-sdf/`](../lessons/09-advanced-sdf/)。

三区域对比：

1. **左**：圆 ∩ 旋转矩形（硬 `max`）
2. **中**：两圆 `opSmoothUnion`，`k` 随 `uTime` 微变
3. **右**：三形状链式 smoothmin

## 5. 自测题

请先独立思考，再查看 [`lessons/09-advanced-sdf/ANSWERS.md`](../lessons/09-advanced-sdf/ANSWERS.md)。

1. 硬并集与平滑并集视觉区别？`k` 变大时融合带如何变化？
2. 交集应用 `min` 还是 `max`？
3. `smoothstep` 抗锯齿与 `smoothmin` 分别解决什么问题？

## 下一课预告

**综合小实验**：噪声域扭曲 + SDF smoothmin + 梯度法线简易光照 + 动画调色——**阶段二收官**。
