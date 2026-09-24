#version 300 es
precision highp float;

in vec3 vWorldPos;
in vec3 vWorldNormal;

uniform vec3 uAlbedo;
uniform vec3 uAmbientColor;
uniform vec3 uDirLightDir;
uniform vec3 uDirLightColor;
uniform vec3 uPointLightPos;
uniform vec3 uPointLightColor;
uniform vec3 uViewPos;

out vec4 fragColor;

void main() {
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(uViewPos - vWorldPos);

  vec3 color = uAlbedo * uAmbientColor;

  vec3 Ld = normalize(-uDirLightDir);
  float diffDir = max(dot(N, Ld), 0.0);
  vec3 Hd = normalize(Ld + V);
  float specDir = pow(max(dot(N, Hd), 0.0), 48.0);
  color += uAlbedo * uDirLightColor * diffDir;
  color += uDirLightColor * specDir * 0.35;

  vec3 Lp = normalize(uPointLightPos - vWorldPos);
  float dist = length(uPointLightPos - vWorldPos);
  float atten = 1.0 / (1.0 + 0.25 * dist * dist);
  float diffPt = max(dot(N, Lp), 0.0);
  vec3 Hp = normalize(Lp + V);
  float specPt = pow(max(dot(N, Hp), 0.0), 32.0);
  color += uAlbedo * uPointLightColor * diffPt * atten;
  color += uPointLightColor * specPt * 0.25 * atten;

  fragColor = vec4(color, 1.0);
}
