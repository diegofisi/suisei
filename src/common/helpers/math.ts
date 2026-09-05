export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, amount: number): number => from + (to - from) * amount;

/** Maps `value` from [inMin, inMax] to [0, 1], clamped. */
export const phase = (value: number, inMin: number, inMax: number): number => clamp((value - inMin) / (inMax - inMin), 0, 1);

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Deterministic pseudo-random in [0,1) so particle layouts are stable across re-renders. */
export const hashNoise = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
