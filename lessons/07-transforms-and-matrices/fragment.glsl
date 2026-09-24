#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
out vec4 fragColor;

float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float d = sdCircle(p, 0.72);
  float mask = 1.0 - smoothstep(0.0, 0.02, d);

  vec3 inner = vec3(0.28, 0.62, 0.95);
  vec3 edge = vec3(0.95, 0.55, 0.22);
  vec3 color = mix(edge, inner, mask);

  // 网格线帮助观察 UV 与顶点变换
  float grid = step(0.96, fract(vUv.x * 8.0)) + step(0.96, fract(vUv.y * 8.0));
  color = mix(color, vec3(1.0), clamp(grid * 0.15, 0.0, 1.0));

  fragColor = vec4(color, 1.0);
}
