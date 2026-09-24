#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  float r2 = dot(p, p);
  vec3 bg = vec3(0.06, 0.07, 0.1);

  if (r2 > 1.0) {
    fragColor = vec4(bg, 1.0);
    return;
  }

  // 由 UV 重建单位球面法线（半球 z ≥ 0）
  float z = sqrt(1.0 - r2);
  vec3 normal = normalize(vec3(p, z));

  // 轨道光源
  vec3 lightDir = normalize(vec3(
    cos(uTime * 0.9) * 0.8,
    0.55,
    sin(uTime * 0.9) * 0.8
  ));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);

  vec3 albedo = vec3(0.35, 0.55, 0.92);
  float ambient = 0.18;
  float diffuse = max(dot(normal, lightDir), 0.0);
  float specular = pow(max(dot(normal, halfDir), 0.0), 48.0);

  vec3 color = albedo * (ambient + diffuse * 0.85);
  color += vec3(1.0) * specular * 0.35;

  fragColor = vec4(color, 1.0);
}
