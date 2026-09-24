#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;
out vec4 fragColor;
void main() {
  // 调试 UV 时可改用：fragColor = vec4(vUv, 0.0, 1.0);
  vec2 uv = fract(vUv + vec2(uTime * 0.05, 0.0));
  vec4 tex = texture(uTexture, uv);
  float tint = sin(uTime) * 0.08 + 0.92;
  fragColor = vec4(tex.rgb * tint, tex.a);
}
