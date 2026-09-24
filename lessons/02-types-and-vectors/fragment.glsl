#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
void main() {
  vec2 center = vec2(0.5);
  vec2 dir = normalize(vUv - center);
  float t = dot(dir, normalize(vec2(1.0, 1.0))) * 0.5 + 0.5;
  t = smoothstep(0.25, 0.75, t);
  vec3 colorA = vec3(0.15, 0.35, 0.85);
  vec3 colorB = vec3(0.95, 0.45, 0.15);
  fragColor = vec4(mix(colorA, colorB, t), 1.0);
}
