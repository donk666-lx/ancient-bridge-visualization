export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform float uProgress;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uSpread;
varying vec2 vUv;

float Hash(vec2 p) {
  vec3 p2 = vec3(p.xy, 1.0);
  return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
}

float noise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f *= f * (3.0 - 2.0 * f);
  return mix(
    mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
    mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  v += noise(p * 1.0) * 0.5;
  v += noise(p * 2.0) * 0.25;
  v += noise(p * 4.0) * 0.125;
  v += noise(p * 8.0) * 0.0625;
  return v;
}

float inkSplash(vec2 p) {
  float distance = length(p);
  float splash = 1.0 - smoothstep(0.0, 1.0, distance);
  splash *= 1.0 + sin(distance * 10.0) * 0.1;
  return splash;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);

  // 水墨风格的颜色 - 深灰色/黑色
  vec3 inkColor = vec3(0.1, 0.1, 0.1);
  
  // 多层次噪声创建水墨效果
  float noiseValue = fbm(centeredUv * 10.0);
  float noiseValue2 = fbm(centeredUv * 20.0) * 0.5;
  float noiseValue3 = fbm(centeredUv * 30.0) * 0.25;
  float totalNoise = noiseValue + noiseValue2 + noiseValue3;
  
  // 水墨扩散效果
  float inkSpread = inkSplash(centeredUv * 2.0) * 0.3;
  
  // 溶解边缘
  float dissolveEdge = uv.y - uProgress * 1.2;
  float d = dissolveEdge + (totalNoise + inkSpread) * uSpread;

  float pixelSize = 1.0 / uResolution.y;
  float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);
  
  // 添加随机墨点效果
  float dotNoise = noise(centeredUv * 50.0);
  if (dotNoise > 0.8) {
    alpha *= 0.8 + dotNoise * 0.2;
  }

  gl_FragColor = vec4(inkColor, alpha);
}
`;