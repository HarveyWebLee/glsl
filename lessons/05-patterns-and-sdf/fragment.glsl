#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

/** 到圆心的有符号距离：内部为负，外部为正 */
float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

/** 轴对齐矩形 SDF，halfSize 为半宽、半高 */
float sdBox(vec2 p, vec2 halfSize) {
  vec2 q = abs(p) - halfSize;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}

/** 由 SDF 距离生成抗锯齿填充遮罩 */
float aaFill(float d, float edgeWidth) {
  return 1.0 - smoothstep(0.0, edgeWidth, d);
}

/** 绕原点的二维旋转矩阵 */
mat2 rot2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  vec3 bg = vec3(0.08, 0.08, 0.1);
  vec3 color = bg;

  // 左侧：半径随 uTime 脉动的抗锯齿圆
  vec2 circleCenter = vec2(-0.45, 0.0);
  float radius = 0.28 + sin(uTime * 2.0) * 0.06;
  float dCircle = sdCircle(p - circleCenter, radius);
  float circleMask = aaFill(dCircle, 0.015);
  vec3 circleColor = vec3(0.32, 0.72, 0.95);
  circleColor += vec3(0.12, 0.08, 0.0) * (sin(uTime * 3.0) * 0.5 + 0.5);
  color = mix(color, circleColor, circleMask);

  // 右侧：缓慢旋转的抗锯齿矩形
  vec2 boxCenter = vec2(0.45, 0.0);
  vec2 boxP = rot2d(uTime * 0.5) * (p - boxCenter);
  float dBox = sdBox(boxP, vec2(0.22, 0.16));
  float boxMask = aaFill(dBox, 0.012);
  vec3 boxColor = vec3(0.95, 0.55, 0.28);
  color = mix(color, boxColor, boxMask);

  fragColor = vec4(color, 1.0);
}
