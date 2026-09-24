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
