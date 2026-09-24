# 第 04 课自测题答案

> 建议先自己做题，再展开本页。

## 1. `uniform sampler2D uTexture` 在 JavaScript 里应如何赋值？`gl.uniform1i(uTextureLoc, 0)` 里的 `0` 表示什么？

`sampler2D` 是 **uniform**，不能用 `uniform1f` 传「纹理对象」。正确流程：

1. 创建并上传纹理：`createTexture` → `bindTexture` → `texImage2D` → `texParameteri`  
2. 激活纹理单元：`gl.activeTexture(gl.TEXTURE0)`  
3. 把纹理绑到该单元：`gl.bindTexture(gl.TEXTURE_2D, texture)`  
4. 告诉着色器采样器读哪个单元：`gl.uniform1i(uTextureLoc, 0)`

**`0` 表示纹理单元索引**，对应 `gl.TEXTURE0`（下一单元为 `1` → `TEXTURE1`）。**不是** WebGL 纹理对象的内部 ID，也不是 attribute location。

## 2. OpenGL 纹理坐标 `(0, 0)` 在纹理的哪个角？从 HTML `Image` 上传时为什么有时需要 `UNPACK_FLIP_Y_WEBGL`？

在 **OpenGL / WebGL 纹理空间** 中，**(0, 0) 在左下角**，`u` 向右增加，`v` 向上增加。

许多 **图片文件与 Canvas 2D** 把 **(0, 0) 放在左上角**，`y` 向下增加。若直接 `texImage2D` 上传而不处理，图像在纹理里会 **上下颠倒**（或 UV 与视觉预期不符）。

在 `texImage2D` 之前设置：

```javascript
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
```

可在上传时翻转行序，使屏幕上的朝向与常见图片坐标一致。本课用显式 UV + 离屏 Canvas 绘制时，按 OpenGL 左下原点布局，通常可不设此项。

## 3. 若设置了 `TEXTURE_MIN_FILTER` 为 `LINEAR_MIPMAP_LINEAR` 却从未调用 `generateMipmap`，画面可能出现什么问题？本课 demo 如何避免？

依赖 mipmap 的缩小过滤（如 `LINEAR_MIPMAP_LINEAR`、`NEAREST_MIPMAP_NEAREST`）要求纹理 **mipmap 链完整**。未调用 `gl.generateMipmap(gl.TEXTURE_2D)` 时，纹理处于 **不完整（incomplete）** 状态，采样结果常为 **全黑或无效**。

本课 demo 的避免方式：

- **不生成 mipmap**  
- 将 `TEXTURE_MIN_FILTER` 与 `TEXTURE_MAG_FILTER` 均设为 **`gl.LINEAR`**（非 `LINEAR_MIPMAP_*`）  
- 上传棋盘格后立即 `texParameteri`，再绘制

若将来需要 mipmap，在 `texImage2D` 之后调用 `generateMipmap`，再把 `TEXTURE_MIN_FILTER` 改为 `LINEAR_MIPMAP_LINEAR` 即可。
