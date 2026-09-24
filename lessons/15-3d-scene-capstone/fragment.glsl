#version 300 es
precision highp float;

in vec3 vWorldPos;
in vec3 vWorldNormal;

uniform vec3 uAlbedo;
uniform vec3 uAmbientColor;
uniform vec3 uDirLightDir;
uniform vec3 uDirLightColor;
uniform vec3 uFillLightDir;
uniform vec3 uFillLightColor;
uniform vec3 uViewPos;

out vec4 fragColor;

void main() {
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(uViewPos - vWorldPos);

  vec3 color = uAlbedo * uAmbientColor;

  vec3 L0 = normalize(-uDirLightDir);
  float diff0 = max(dot(N, L0), 0.0);
  vec3 H0 = normalize(L0 + V);
  float spec0 = pow(max(dot(N, H0), 0.0), 40.0);
  color += uAlbedo * uDirLightColor * diff0;
  color += uDirLightColor * spec0 * 0.3;

  vec3 L1 = normalize(-uFillLightDir);
  float diff1 = max(dot(N, L1), 0.0);
  color += uAlbedo * uFillLightColor * diff1 * 0.6;

  fragColor = vec4(color, 1.0);
}
