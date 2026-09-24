#version 300 es
precision highp float;
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec2 aUv;
uniform mat3 uModel;
out vec2 vUv;
void main() {
  vec3 worldPos = uModel * vec3(aPosition.xy, 1.0);
  gl_Position = vec4(worldPos.xy, 0.0, 1.0);
  vUv = aUv;
}
