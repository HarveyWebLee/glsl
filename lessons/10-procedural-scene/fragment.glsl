#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 2; i++) {
    value += amplitude * valueNoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

float opSmoothUnion(float dA, float dB, float k) {
  float h = clamp(0.5 + 0.5 * (dB - dA) / k, 0.0, 1.0);
  return mix(dB, dA, h) - k * h * (1.0 - h);
}

float sceneDistance(vec2 p) {
  vec2 warp = vec2(
    fbm(p * 1.8 + uTime * 0.12),
    fbm(p * 1.8 + vec2(4.2, 1.7) - uTime * 0.1)
  ) * 0.22 - 0.11;
  vec2 q = p + warp;

  float orbitA = sin(uTime * 0.75) * 0.32;
  float orbitB = cos(uTime * 0.55) * 0.28;
  float d1 = sdCircle(q - vec2(orbitA, orbitB * 0.6), 0.26);
  float d2 = sdCircle(q - vec2(-orbitB * 0.8, orbitA * 0.5), 0.22);
  float d3 = sdCircle(q, 0.16 + sin(uTime * 1.4) * 0.05);
  return opSmoothUnion(opSmoothUnion(d1, d2, 0.14), d3, 0.11);
}

vec3 palette(float t) {
  return mix(
    vec3(0.15, 0.35, 0.75),
    vec3(0.95, 0.45, 0.55),
    smoothstep(0.2, 0.85, t)
  );
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  float d = sceneDistance(p);
  vec3 bg = vec3(0.05, 0.06, 0.09);

  if (d > 0.02) {
    float vignette = 1.0 - length(p) * 0.35;
    fragColor = vec4(bg * vignette, 1.0);
    return;
  }

  float eps = 0.002;
  float dx = sceneDistance(p + vec2(eps, 0.0)) - sceneDistance(p - vec2(eps, 0.0));
  float dy = sceneDistance(p + vec2(0.0, eps)) - sceneDistance(p - vec2(0.0, eps));
  vec3 normal = normalize(vec3(-dx, -dy, 0.12));

  vec3 lightDir = normalize(vec3(cos(uTime * 0.8), 0.6, sin(uTime * 0.8)));
  float diffuse = max(dot(normal, lightDir), 0.0);
  float ambient = 0.22;

  float noiseShade = fbm(p * 3.0 + uTime * 0.05);
  vec3 albedo = palette(noiseShade + sin(uTime * 0.3) * 0.1);
  vec3 color = albedo * (ambient + diffuse * 0.9);

  float rim = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
  color += vec3(0.4, 0.6, 0.95) * rim * 0.25;

  float edge = 1.0 - smoothstep(0.0, 0.018, d);
  color = mix(bg, color, edge);

  fragColor = vec4(color, 1.0);
}
