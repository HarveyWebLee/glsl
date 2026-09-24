#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
out vec2 vUv;
void main() {
  gl_Position = vec4(aPosition, 1.0);
  vUv = aPosition.xy * 0.5 + 0.5;
}
