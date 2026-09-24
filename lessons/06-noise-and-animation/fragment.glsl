#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
out vec4 fragColor;

/** 经典 hash：由位置决定伪随机，同一 UV 每帧结果相同 */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

/** 双线性插值 value noise */
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

/** 两层 fBm：低频大形 + 高频细节 */
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 2; octave++) {
    value += amplitude * valueNoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  // 用时间扭曲采样域，让噪声「流动」而非每帧重新掷骰子
  vec2 warp = vec2(
    sin(uv.y * 4.0 + uTime * 0.35),
    cos(uv.x * 3.5 - uTime * 0.28)
  ) * 0.18;
  vec2 samplePos = (uv + warp) * 3.2 + vec2(uTime * 0.08, uTime * 0.05);

  float n = fbm(samplePos);
  float n2 = fbm(samplePos * 1.7 + vec2(2.1, 5.3));

  vec3 deep = vec3(0.06, 0.08, 0.18);
  vec3 mid = vec3(0.18, 0.32, 0.62);
  vec3 highlight = vec3(0.72, 0.82, 0.95);
  vec3 color = mix(deep, mid, smoothstep(0.25, 0.55, n));
  color = mix(color, highlight, smoothstep(0.62, 0.88, n2) * 0.55);

  // 轻微颗粒感，强调「由位置决定」的 hash 特性
  float grain = hash(uv * uResolution.xy + floor(uTime * 24.0)) * 0.04;
  color += grain;

  fragColor = vec4(color, 1.0);
}
