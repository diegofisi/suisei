// GLSL for the hero comet. Screen-space volumetric look: a blazing head plus a fan of noisy streaks
// stretched along the tail axis, tone-mapped so the highlights bloom softly instead of clipping.

export const COMET_VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const COMET_FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_head;       // head center, canvas px, GL orientation (y up)
uniform vec2 u_dir;        // unit vector from the head toward the end of the tail, GL orientation
uniform float u_scale;     // canvas px per comet unit
uniform float u_length;    // tail length in comet units
uniform float u_time;      // seconds
uniform float u_intensity; // 0..1, fades the whole comet out
uniform vec3 u_ice;
uniform vec3 u_comet;
uniform vec3 u_blue;
uniform vec3 u_pink;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
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
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.1, 9.3);
    amplitude *= 0.5;
  }
  return value;
}

// Soft highlight roll-off; WebGL1 has no tanh.
vec3 tonemap(vec3 color) {
  return 1.0 - exp(-color);
}

void main() {
  vec2 q = (gl_FragCoord.xy - u_head) / u_scale;
  vec2 perp = vec2(-u_dir.y, u_dir.x);
  float along = dot(q, u_dir);
  float across = dot(q, perp);
  float r = length(q);

  // ---- head: just a brighter tip. A tight white core and a small glow stretched along the tail, no halo rings.
  float flicker = 0.92 + 0.08 * sin(u_time * 5.3) * sin(u_time * 2.1 + 1.0);
  float core = exp(-r * r * 40.0);
  // Only behind the nucleus, so it reads as the start of the tail rather than a ball around the head.
  float tip = exp(-(across * across * 16.0 + along * along * 1.1)) * smoothstep(-0.04, 0.22, along);
  vec3 headColor = (core * 2.2 * u_ice + tip * 0.9 * mix(u_ice, u_comet, 0.4)) * flicker;

  // ---- tail envelope: starts inside the head, widens as it streams away, fades with distance
  float t = along / u_length;
  float halfWidth = 0.24 + 0.95 * t + 0.2 * t * t;
  float lane = across / halfWidth;
  float envelope = exp(-lane * lane * 1.7);
  float behind = smoothstep(-0.3, 0.12, along);
  float reach = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.42, 0.98, t));

  // ---- streaks: noise stretched along the axis and pushed away from the head over time
  vec2 coarse = vec2(along * 0.5 - u_time * 0.32, lane * 2.4 + along * 0.12);
  float streak = pow(fbm(coarse), 2.2) * 2.4;
  vec2 fine = vec2(along * 1.6 - u_time * 0.8, lane * 6.5 + 3.0);
  float filament = pow(fbm(fine), 3.0) * 1.7;
  float spine = exp(-lane * lane * 9.0) * exp(-t * 2.6) * 0.9;
  float tail = envelope * behind * reach * (0.16 + streak * 0.85 + filament * 0.55) + spine * envelope * behind;

  // ---- dust: sharp sparkles riding the tail
  float grain = noise(vec2(along * 42.0, across * 42.0) + u_time * 0.6);
  float sparkle = smoothstep(0.94, 1.0, grain) * envelope * reach * behind * 1.6;

  // ---- color: cyan-white at the head, blue mid-tail, violet/pink streaks on the upper edge far out
  vec3 tailColor = mix(u_ice, u_blue, smoothstep(0.0, 0.35, t));
  float pinkness = smoothstep(0.2, 0.8, t) * (0.35 + 0.5 * smoothstep(-0.2, 0.7, lane));
  tailColor = mix(tailColor, u_pink, pinkness);

  vec3 color = headColor + tail * tailColor * 0.92 + sparkle * u_ice;
  color = tonemap(color * u_intensity);
  float alpha = max(max(color.r, color.g), color.b);
  gl_FragColor = vec4(color, alpha);
}
`;
