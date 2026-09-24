#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

float sdBox(vec2 p, vec2 halfSize) {
  vec2 q = abs(p) - halfSize;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}

float opIntersection(float dA, float dB) {
  return max(dA, dB);
}

float opSmoothUnion(float dA, float dB, float k) {
  float h = clamp(0.5 + 0.5 * (dB - dA) / k, 0.0, 1.0);
  return mix(dB, dA, h) - k * h * (1.0 - h);
}

float aaFill(float d, float edgeWidth) {
  return 1.0 - smoothstep(0.0, edgeWidth, d);
}

mat2 rot2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  vec3 bg = vec3(0.07, 0.07, 0.1);
  vec3 color = bg;

  vec2 leftP = p - vec2(-0.42, 0.0);
  float dCircle = sdCircle(leftP, 0.34);
  float dBox = sdBox(rot2d(uTime * 0.4) * leftP, vec2(0.26, 0.18));
  float dHard = opIntersection(dCircle, dBox);
  color = mix(color, vec3(0.35, 0.78, 0.95), aaFill(dHard, 0.012));

  float orbit = sin(uTime * 0.9) * 0.22;
  float dC1 = sdCircle(p - vec2(orbit, 0.0), 0.28);
  float dC2 = sdCircle(p + vec2(orbit, 0.0), 0.28);
  float smoothK = 0.14 + sin(uTime * 1.2) * 0.04;
  float dSmooth = opSmoothUnion(dC1, dC2, smoothK);
  color = mix(color, vec3(0.95, 0.52, 0.28), aaFill(dSmooth, 0.014));

  vec2 rightBase = vec2(0.46, 0.0);
  float dR1 = sdCircle(p - rightBase - vec2(0.0, sin(uTime) * 0.08), 0.22);
  float dR2 = sdBox(rot2d(uTime * 0.35) * (p - rightBase), vec2(0.2, 0.14));
  float dR3 = sdCircle(p - rightBase - vec2(0.18, -0.12), 0.12);
  float dRight = opSmoothUnion(opSmoothUnion(dR1, dR2, 0.12), dR3, 0.1);
  color = mix(color, vec3(0.62, 0.48, 0.95), aaFill(dRight, 0.013));

  fragColor = vec4(color, 1.0);
}
