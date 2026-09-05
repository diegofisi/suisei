import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import { hexToRgba } from "@/common/helpers/color";
import { easeInOutCubic, easeOutCubic, hashNoise, lerp, phase } from "@/common/helpers/math";
import { Palette } from "@/common/models/palette";

/** Imperative handle: the scene hook drives these from the shared rAF loop. */
export interface SignatureParticlesHandle {
  render: (progress: number, timeMs: number) => void;
  resize: () => void;
}

const TAU = Math.PI * 2;

// --- tuning -----------------------------------------------------------------
const PARTICLE_COUNT = 3200;
/** Scroll window in which the cloud collapses into the signature. */
const FORM_START = 0.2;
const FORM_END = 0.85;
/** Per-particle delay range added to FORM_START. */
const MAX_STAGGER = 0.35;
/** Length of one particle's own trip; the last starter still lands on FORM_END. */
const FORM_SPAN = FORM_END - FORM_START - MAX_STAGGER;
/** Scroll point where the cloud has finished drifting to the center. */
const DRIFT_END = 0.3;

// The resting shape follows public/img/cometa-referencia.png: a blazing head low on the right and a long,
// wide tail of filaments streaming to the upper left across the whole stage.
const HEAD_SHARE = 0.13;
const COMA_SHARE = 0;
const HEAD_RADIUS = 0.13;
const COMA_RADIUS = 0.34;
const HEAD_FLATTEN = 0.94;
const HEAD_SPIN_INNER = 0.42;
const HEAD_SPIN_OUTER = 0.12;
const HEAD_X_WIDE = 0.78;
const HEAD_Y_WIDE = 0.76;
const TAIL_LENGTH = 4.6;
const TAIL_ANGLE = Math.PI + 0.54;
const TAIL_WIDTH_START = 0.24;
const TAIL_WIDTH_END = 0.9;
const TAIL_CURVE = 0.06;
const TAIL_SWAY = 0.02;
/** Share of tail particles that bunch into filament streaks instead of the diffuse fan. */
const FILAMENT_SHARE = 0.4;
const FILAMENT_COUNT = 6;
const CLOUD_RADIUS_WIDE = 0.3;
const CLOUD_RADIUS_NARROW = 0.28;
const HEAD_SIZE_WEIGHTS = [0.32, 0.4, 0.23, 0.05];
const TAIL_SIZE_WEIGHTS = [0.58, 0.3, 0.1, 0.02];
/** Idle orbital jitter once formed, in CSS px. */
const BREATH_AMPLITUDE = 0.6;

const GLOW_STEP = 10;
const GLOW_SCALE = 2.6;
const DPR_CAP = 2;
const NARROW_WIDTH = 760;

const SAMPLE_LONG_SIDE = 900;
const INK_LUMA_MAX = 110;
const SIGNATURE_SRC = "img/firma.jpg";
const FALLBACK_ASPECT = 2.6;

const CORE_SIZES = [0.8, 1.3, 1.9, 2.8];
const HALO_SCALE = 3.2;
const CORE_ALPHA = 0.85;
const HALO_ALPHA = 0.13;

// ICE/COMET mix dominates; SAKURA hints at "the person", STAR_WARM at the old suns of the galaxy.
const PARTICLE_COLORS = [
  { hex: Palette.ICE, weight: 0.4 },
  { hex: Palette.STAR_BLUE, weight: 0.32 },
  { hex: Palette.COMET, weight: 0.18 },
  { hex: Palette.SAKURA, weight: 0.07 },
  { hex: Palette.STAR_WARM, weight: 0.03 },
];
const COLOR_COUNT = PARTICLE_COLORS.length;
const SIZE_COUNT = CORE_SIZES.length;
const SPRITE_COUNT = COLOR_COUNT * SIZE_COUNT;
// Head burns white-cyan; the tail carries the reference's violet/pink streaks. Same index order as PARTICLE_COLORS.
const HEAD_COLOR_WEIGHTS = [0.5, 0.3, 0.17, 0.02, 0.01];
const TAIL_COLOR_WEIGHTS = [0.28, 0.3, 0.16, 0.22, 0.04];
/** Geometry shared with the WebGL comet so the shader and the particles agree on where the comet is. */
export interface CometFrame {
  headX: number;
  headY: number;
  /** Comet unit in CSS px (the head radius is a fraction of it). */
  radius: number;
  dirX: number;
  dirY: number;
  tailLength: number;
  /** 1 while the comet is whole, 0 once the particles have left it for the signature. */
  light: number;
}

export const cometFrameOf = (width: number, height: number, progress: number, seconds: number): CometFrame => {
  const narrow = width < NARROW_WIDTH;
  // The head drifts from the lower right to the middle of the stage before the particles take off.
  const drift = easeOutCubic(phase(progress, 0, DRIFT_END));
  const radius = Math.min(width, height) * (narrow ? CLOUD_RADIUS_NARROW : CLOUD_RADIUS_WIDE);
  const bobX = Math.sin(seconds * 0.5) * radius * 0.02;
  const bobY = Math.cos(seconds * 0.37) * radius * 0.025;
  const sway = Math.sin(seconds * 0.23) * 0.02;
  return {
    headX: (narrow ? width * 0.5 : lerp(width * HEAD_X_WIDE, width * 0.5, drift)) + bobX,
    headY: (narrow ? height * 0.72 : lerp(height * HEAD_Y_WIDE, height * 0.5, drift)) + bobY,
    radius,
    dirX: Math.cos(TAIL_ANGLE + sway),
    dirY: Math.sin(TAIL_ANGLE + sway),
    tailLength: radius * TAIL_LENGTH,
    light: 1 - phase(progress, FORM_START * 0.5, FORM_START + MAX_STAGGER),
  };
};

// --- data -------------------------------------------------------------------
interface ParticleLayout {
  /** Head: polar radius. Tail: distance along the tail (0..1). In cloud-radius units. */
  radius: Float32Array;
  /** Head: polar angle. Tail: signed sideways offset in cloud-radius units. */
  angle: Float32Array;
  /** Head: orbital speed (rad/s). Tail: sway phase. */
  spin: Float32Array;
  /** 0 = head/coma, 1 = tail. */
  kind: Uint8Array;
  stagger: Float32Array;
  breath: Float32Array;
  targetX: Float32Array;
  targetY: Float32Array;
  colorIndex: Uint8Array;
  order: Uint16Array;
  spriteEnd: Int32Array;
}

interface SpriteAtlas {
  cores: HTMLCanvasElement[];
  coreHalf: number[];
  glows: HTMLCanvasElement[];
  glowHalf: number;
  dpr: number;
}

interface StageSize {
  width: number;
  height: number;
}

interface SignatureShape {
  x: Float32Array;
  y: Float32Array;
  aspect: number;
}

const noise = (index: number, salt: number): number => hashNoise(index * 3.17 + salt * 91.7 + 0.31);

const pickWeighted = (weights: number[], sample: number): number => {
  let acc = 0;
  for (let i = 0; i < weights.length; i += 1) {
    acc += weights[i] ?? 0;
    if (sample < acc) return i;
  }
  return weights.length - 1;
};

const makeSprite = (hex: string, core: number, dpr: number): HTMLCanvasElement => {
  const halo = core * HALO_SCALE;
  const canvas = document.createElement("canvas");
  const size = Math.max(2, Math.ceil(halo * 2 * dpr));
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, hexToRgba(hex, CORE_ALPHA));
    gradient.addColorStop(Math.min(0.9, core / halo), hexToRgba(hex, HALO_ALPHA));
    gradient.addColorStop(1, hexToRgba(hex, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return canvas;
};

const buildAtlas = (dpr: number): SpriteAtlas => {
  const cores: HTMLCanvasElement[] = [];
  const coreHalf: number[] = [];
  const glows: HTMLCanvasElement[] = [];
  const largest = CORE_SIZES[SIZE_COUNT - 1] ?? 3.2;
  for (const color of PARTICLE_COLORS) {
    for (const core of CORE_SIZES) {
      cores.push(makeSprite(color.hex, core, dpr));
      coreHalf.push(core * HALO_SCALE);
    }
    glows.push(makeSprite(color.hex, largest * GLOW_SCALE, dpr));
  }
  return { cores, coreHalf, glows, glowHalf: largest * GLOW_SCALE * HALO_SCALE, dpr };
};

/** Comet: dense head + faint coma (polar) and a curved tail (along/sideways), in units of the cloud radius. */
const buildLayout = (): ParticleLayout => {
  const radius = new Float32Array(PARTICLE_COUNT);
  const angle = new Float32Array(PARTICLE_COUNT);
  const spin = new Float32Array(PARTICLE_COUNT);
  const kind = new Uint8Array(PARTICLE_COUNT);
  const stagger = new Float32Array(PARTICLE_COUNT);
  const breath = new Float32Array(PARTICLE_COUNT);
  const colorIndex = new Uint8Array(PARTICLE_COUNT);
  const spriteOf = new Uint8Array(PARTICLE_COUNT);
  const counts = new Int32Array(SPRITE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const roll = noise(i, 1);
    const sample = noise(i, 2);
    let sizeWeights = HEAD_SIZE_WEIGHTS;
    let colorWeights = HEAD_COLOR_WEIGHTS;
    if (roll < HEAD_SHARE) {
      // Head: density falls off from the core, so the middle burns brightest.
      const r = HEAD_RADIUS * Math.pow(sample, 0.72);
      radius[i] = r;
      angle[i] = noise(i, 3) * TAU;
      spin[i] = lerp(HEAD_SPIN_INNER, HEAD_SPIN_OUTER, r / HEAD_RADIUS);
      kind[i] = 0;
    } else if (roll < HEAD_SHARE + COMA_SHARE) {
      radius[i] = HEAD_RADIUS + Math.sqrt(sample) * (COMA_RADIUS - HEAD_RADIUS);
      angle[i] = noise(i, 3) * TAU;
      spin[i] = HEAD_SPIN_OUTER * 0.5;
      kind[i] = 0;
      sizeWeights = TAIL_SIZE_WEIGHTS;
    } else {
      // Tail: dense near the head, thinning and fanning out; part diffuse fan, part filament streaks.
      const along = Math.pow(sample, 1.35);
      const width = lerp(TAIL_WIDTH_START, TAIL_WIDTH_END, along);
      const isFilament = noise(i, 10) < FILAMENT_SHARE;
      let side: number;
      if (isFilament) {
        const filament = Math.floor(noise(i, 11) * FILAMENT_COUNT);
        const lane = (filament + 0.5) / FILAMENT_COUNT - 0.5;
        side = lane * width * 0.9 + (noise(i, 3) - 0.5) * width * 0.08;
      } else {
        const spread = noise(i, 3) + noise(i, 9) - 1;
        side = spread * width;
      }
      radius[i] = along;
      angle[i] = side;
      spin[i] = noise(i, 8) * TAU;
      kind[i] = 1;
      sizeWeights = TAIL_SIZE_WEIGHTS;
      colorWeights = TAIL_COLOR_WEIGHTS;
    }
    // Replaced by a left-to-right order once the signature is sampled.
    stagger[i] = MAX_STAGGER * noise(i, 6);
    breath[i] = noise(i, 7) * TAU;

    const color = pickWeighted(colorWeights, noise(i, 4));
    const size = pickWeighted(sizeWeights, noise(i, 5));
    colorIndex[i] = color;
    const sprite = color * SIZE_COUNT + size;
    spriteOf[i] = sprite;
    counts[sprite] = (counts[sprite] ?? 0) + 1;
  }

  // Counting sort, so the draw loop batches by sprite with zero per-particle state changes.
  const spriteEnd = new Int32Array(SPRITE_COUNT);
  const writeAt = new Int32Array(SPRITE_COUNT);
  let acc = 0;
  for (let s = 0; s < SPRITE_COUNT; s += 1) {
    writeAt[s] = acc;
    acc += counts[s] ?? 0;
    spriteEnd[s] = acc;
  }
  const order = new Uint16Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const s = spriteOf[i] ?? 0;
    const at = writeAt[s] ?? 0;
    order[at] = i;
    writeAt[s] = at + 1;
  }

  return {
    radius,
    angle,
    spin,
    kind,
    stagger,
    breath,
    targetX: new Float32Array(PARTICLE_COUNT),
    targetY: new Float32Array(PARTICLE_COUNT),
    colorIndex,
    order,
    spriteEnd,
  };
};

/** Reads dark ink pixels from the signature and keeps a stable, uniformly random subset. */
const sampleSignature = (image: HTMLImageElement): SignatureShape | null => {
  const longest = Math.max(image.naturalWidth, image.naturalHeight);
  if (longest === 0) return null;
  const scale = SAMPLE_LONG_SIDE / longest;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, width, height);

  let pixels: Uint8ClampedArray;
  try {
    pixels = ctx.getImageData(0, 0, width, height).data;
  } catch {
    return null;
  }

  const inkX: number[] = [];
  const inkY: number[] = [];
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const luma =
        0.2126 * (pixels[offset] ?? 255) + 0.7152 * (pixels[offset + 1] ?? 255) + 0.0722 * (pixels[offset + 2] ?? 255);
      if (luma >= INK_LUMA_MAX) continue;
      inkX.push(x);
      inkY.push(y);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  const total = inkX.length;
  if (total < 64) return null;

  // Partial Fisher-Yates with a fixed seed: uniform density, no stride aliasing.
  const indices = new Uint32Array(total);
  for (let i = 0; i < total; i += 1) indices[i] = i;
  const take = Math.min(PARTICLE_COUNT, total);
  for (let k = 0; k < take; k += 1) {
    const j = k + Math.floor(hashNoise(k * 7.71 + 1.37) * (total - k));
    const swap = indices[k] ?? 0;
    indices[k] = indices[j] ?? 0;
    indices[j] = swap;
  }

  const boxWidth = Math.max(1, maxX - minX);
  const boxHeight = Math.max(1, maxY - minY);
  const x = new Float32Array(PARTICLE_COUNT);
  const y = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const source = indices[i % take] ?? 0;
    x[i] = ((inkX[source] ?? minX) - minX) / boxWidth;
    y[i] = ((inkY[source] ?? minY) - minY) / boxHeight;
  }
  return { x, y, aspect: boxWidth / boxHeight };
};

/** Used when the image cannot be read: a comet, so the scene still works. */
const buildFallbackShape = (): SignatureShape => {
  const x = new Float32Array(PARTICLE_COUNT);
  const y = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    if (noise(i, 11) < 0.34) {
      const r = Math.sqrt(noise(i, 12)) * 0.062;
      const a = noise(i, 13) * TAU;
      x[i] = 0.16 + Math.cos(a) * r;
      y[i] = 0.5 + Math.sin(a) * r * FALLBACK_ASPECT;
    } else {
      const t = Math.pow(noise(i, 14), 0.75);
      const spread = 0.16 * Math.pow(1 - t, 0.85);
      x[i] = 0.16 + t * 0.82;
      y[i] = 0.5 + (noise(i, 15) - 0.5) * 2 * spread + t * 0.05;
    }
  }
  return { x, y, aspect: FALLBACK_ASPECT };
};

export const useSignatureParticles = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  reducedMotion: boolean,
): SignatureParticlesHandle => {
  const layoutRef = useRef<ParticleLayout | null>(null);
  const atlasRef = useRef<SpriteAtlas | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const stageRef = useRef<StageSize>({ width: 0, height: 0 });
  const aspectRef = useRef(FALLBACK_ASPECT);
  const hasShapeRef = useRef(false);
  const staticDrawnRef = useRef(false);
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Resetting the bitmap size wipes the context state, so the transform is set here.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    contextRef.current = ctx;
    stageRef.current = { width, height };
    if (!atlasRef.current || atlasRef.current.dpr !== dpr) atlasRef.current = buildAtlas(dpr);
    staticDrawnRef.current = false;
  }, [canvasRef]);

  const render = useCallback((progress: number, timeMs: number) => {
    const ctx = contextRef.current;
    const layout = layoutRef.current;
    const atlas = atlasRef.current;
    if (!ctx || !layout || !atlas) return;
    const still = reducedRef.current;
    if (still && staticDrawnRef.current) return;

    const { width, height } = stageRef.current;
    if (width === 0 || height === 0) return;
    const p = still ? 1 : progress;
    const seconds = timeMs * 0.001;
    const formable = hasShapeRef.current;
    const narrow = width < NARROW_WIDTH;

    const frame = cometFrameOf(width, height, p, seconds);
    const cloudX = frame.headX;
    const cloudY = frame.headY;
    const cloudRadius = frame.radius;
    const tailDirX = frame.dirX;
    const tailDirY = frame.dirY;
    const tailLength = frame.tailLength;
    const bobX = 0;
    const bobY = 0;

    // Reduced motion keeps the titles up, so the static signature moves out of their column.
    const parked = still && !narrow;
    const aspect = aspectRef.current;
    let boxWidth = narrow ? width * 0.9 : Math.min(width * (parked ? 0.42 : 0.64), parked ? 560 : 900);
    let boxHeight = boxWidth / aspect;
    const maxHeight = height * (narrow ? 0.4 : 0.5);
    if (boxHeight > maxHeight) {
      boxHeight = maxHeight;
      boxWidth = boxHeight * aspect;
    }
    const boxX = parked ? width * 0.95 - boxWidth : (width - boxWidth) / 2;
    const boxY = (narrow ? height * 0.6 : height * 0.5) - boxHeight / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    const pulse = still ? 0 : phase(p, FORM_END, 1) * (0.72 + 0.28 * Math.sin(seconds * 2.1));

    if (pulse > 0.01) {
      const glowX = boxX + boxWidth / 2;
      const glowY = boxY + boxHeight / 2;
      const glowRadius = Math.max(boxWidth, boxHeight) * 0.62;
      const halo = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
      halo.addColorStop(0, hexToRgba(Palette.COMET, 0.16 * pulse));
      halo.addColorStop(0.55, hexToRgba(Palette.COMET, 0.05 * pulse));
      halo.addColorStop(1, hexToRgba(Palette.COMET, 0));
      ctx.fillStyle = halo;
      ctx.fillRect(glowX - glowRadius, glowY - glowRadius, glowRadius * 2, glowRadius * 2);

      // Dimmer second pass over a tenth of the particles; past FORM_END every one is formed.
      ctx.globalAlpha = pulse * 0.5;
      const glowHalf = atlas.glowHalf;
      const glowSize = glowHalf * 2;
      for (let i = 0; i < PARTICLE_COUNT; i += GLOW_STEP) {
        const sprite = atlas.glows[layout.colorIndex[i] ?? 0];
        if (!sprite) continue;
        const wobble = layout.breath[i] ?? 0;
        const px = boxX + (layout.targetX[i] ?? 0) * boxWidth + Math.sin(seconds * 1.35 + wobble) * BREATH_AMPLITUDE;
        const py =
          boxY + (layout.targetY[i] ?? 0) * boxHeight + Math.cos(seconds * 1.12 + wobble * 1.7) * BREATH_AMPLITUDE;
        ctx.drawImage(sprite, px - glowHalf, py - glowHalf, glowSize, glowSize);
      }
      ctx.globalAlpha = 1;
    }

    let cursor = 0;
    for (let s = 0; s < SPRITE_COUNT; s += 1) {
      const end = layout.spriteEnd[s] ?? 0;
      const sprite = atlas.cores[s];
      const half = atlas.coreHalf[s] ?? 1;
      if (!sprite) {
        cursor = end;
        continue;
      }
      const size = half * 2;
      for (; cursor < end; cursor += 1) {
        const i = layout.order[cursor] ?? 0;
        const start = FORM_START + (layout.stagger[i] ?? 0);
        const eased = formable ? easeInOutCubic(phase(p, start, start + FORM_SPAN)) : 0;
        const wobble = layout.breath[i] ?? 0;
        let x: number;
        let y: number;
        if (eased >= 1) {
          x = boxX + (layout.targetX[i] ?? 0) * boxWidth + Math.sin(seconds * 1.35 + wobble) * BREATH_AMPLITUDE;
          y = boxY + (layout.targetY[i] ?? 0) * boxHeight + Math.cos(seconds * 1.12 + wobble * 1.7) * BREATH_AMPLITUDE;
        } else {
          let gx: number;
          let gy: number;
          if (layout.kind[i] === 1) {
            // Tail particles sway sideways and slide along the tail so it looks like it is streaming.
            const swayPhase = layout.spin[i] ?? 0;
            const along = (layout.radius[i] ?? 0) + Math.sin(seconds * 0.9 + swayPhase) * TAIL_SWAY;
            const side =
              (layout.angle[i] ?? 0) + TAIL_CURVE * along * along + Math.sin(seconds * 1.3 + swayPhase * 2.3) * 0.012;
            const alongPx = along * tailLength;
            const sidePx = side * cloudRadius;
            gx = cloudX + bobX + tailDirX * alongPx - tailDirY * sidePx;
            gy = cloudY + bobY + tailDirY * alongPx + tailDirX * sidePx;
          } else {
            const r = (layout.radius[i] ?? 0) * cloudRadius;
            const a = (layout.angle[i] ?? 0) + seconds * (layout.spin[i] ?? 0) * (1 - eased);
            gx = cloudX + bobX + Math.cos(a) * r;
            gy = cloudY + bobY + Math.sin(a) * r * HEAD_FLATTEN;
          }
          const tx = boxX + (layout.targetX[i] ?? 0) * boxWidth;
          const ty = boxY + (layout.targetY[i] ?? 0) * boxHeight;
          x = gx + (tx - gx) * eased + Math.sin(seconds * 1.35 + wobble) * BREATH_AMPLITUDE * eased;
          y = gy + (ty - gy) * eased + Math.cos(seconds * 1.12 + wobble * 1.7) * BREATH_AMPLITUDE * eased;
        }
        ctx.drawImage(sprite, x - half, y - half, size, size);
      }
    }

    ctx.globalCompositeOperation = "source-over";
    if (still && formable) staticDrawnRef.current = true;
  }, []);

  useEffect(() => {
    layoutRef.current = buildLayout();
    resize();

    let cancelled = false;
    const applyShape = (shape: SignatureShape) => {
      const layout = layoutRef.current;
      if (cancelled || !layout) return;
      layout.targetX.set(shape.x);
      layout.targetY.set(shape.y);
      // Mostly left-to-right, so the cloud writes the signature instead of melting into it.
      for (let i = 0; i < layout.stagger.length; i += 1) {
        layout.stagger[i] = MAX_STAGGER * (0.62 * (layout.targetX[i] ?? 0) + 0.38 * noise(i, 6));
      }
      aspectRef.current = shape.aspect;
      hasShapeRef.current = true;
      staticDrawnRef.current = false;
    };

    const image = new Image();
    image.decoding = "async";
    image.onload = () => applyShape(sampleSignature(image) ?? buildFallbackShape());
    image.onerror = () => applyShape(buildFallbackShape());
    image.src = SIGNATURE_SRC;

    const canvas = canvasRef.current;
    const observer = new ResizeObserver(() => resize());
    if (canvas) observer.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, resize]);

  useEffect(() => {
    staticDrawnRef.current = false;
  }, [reducedMotion]);

  return useMemo(() => ({ render, resize }), [render, resize]);
};
