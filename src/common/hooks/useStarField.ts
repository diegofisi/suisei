import { useEffect, useRef, type RefObject } from "react";
import { hexToRgba } from "@/common/helpers/color";
import { clamp, hashNoise, lerp } from "@/common/helpers/math";
import { Palette } from "@/common/models/palette";
import { useReducedMotion } from "@/common/hooks/useReducedMotion";
import { useScrollScrub } from "@/common/hooks/useScrollScrub";

// ---------------------------------------------------------------- tuning knobs
const MAX_STARS = 900; // hard ceiling so a 1920x1080 screen never exceeds ~900 stars
const MAX_PIXEL_RATIO = 2;
const POINTER_PARALLAX_PX = 10; // full-deflection offset of the near layer
const POINTER_EASE = 0.06;
const SHOOTING_GAP_MIN_MS = 2400;
const SHOOTING_GAP_MAX_MS = 5600;
const SHOOTING_BURST_CHANCE = 0.45; // odds of a second shooting star right behind the first
const AMBIENT_DRIFT_PX_PER_S = 7; // the sky keeps sliding even when nobody scrolls
const AMBIENT_SWAY_PX = 9; // slow sideways wander, strongest on the near layer
const FLASH_RATE = 0.21; // rad/s of the sparkle cycle; higher = more frequent flashes
const FLASH_SHARPNESS = 48; // exponent that turns the sine into a short spike
const SHOOTING_LIFE_MIN_MS = 600;
const SHOOTING_LIFE_MAX_MS = 1000;
const REBUILD_HEIGHT_TOLERANCE = 140; // mobile URL bars resize the viewport constantly; ignore small changes

const CORE_SPRITE_PX = 40;
const GLOW_SPRITE_PX = 128;
const FLARE_SPRITE_PX = 160;
const CORE_DRAW_SCALE = 6; // drawn diameter = star radius * scale
const GLOW_DRAW_SCALE = 20;
const FLARE_DRAW_SCALE = 26;
const OFFSCREEN_MARGIN_PX = 60;

interface LayerRecipe {
  parallaxFactor: number; // fraction of the page scroll this layer travels
  pointerDepth: number;
  worldSpan: number; // world height as a multiple of the viewport height
  areaPerStar: number; // px2 of world area per star
  radiusMin: number;
  radiusMax: number;
  alphaMin: number;
  alphaMax: number;
  glowChance: number;
  flareChance: number;
}

// Far layer: many, small, dim, barely moves. Near layer: fewer, bigger, brighter, moves most.
const LAYER_RECIPES: readonly LayerRecipe[] = [
  { parallaxFactor: 0.16, pointerDepth: 0.25, worldSpan: 2.2, areaPerStar: 13000, radiusMin: 0.35, radiusMax: 0.95, alphaMin: 0.2, alphaMax: 0.5, glowChance: 0, flareChance: 0 },
  { parallaxFactor: 0.45, pointerDepth: 0.6, worldSpan: 1.7, areaPerStar: 9500, radiusMin: 0.6, radiusMax: 1.6, alphaMin: 0.32, alphaMax: 0.75, glowChance: 0.16, flareChance: 0.1 },
  { parallaxFactor: 0.92, pointerDepth: 1, worldSpan: 1.35, areaPerStar: 7000, radiusMin: 0.9, radiusMax: 2.6, alphaMin: 0.5, alphaMax: 1, glowChance: 0.42, flareChance: 0.3 },
];

const STAR_TINTS: readonly { color: string; weight: number }[] = [
  { color: Palette.STAR_WHITE, weight: 0.52 },
  { color: Palette.STAR_BLUE, weight: 0.32 },
  { color: Palette.STAR_WARM, weight: 0.08 },
  { color: Palette.STAR_PINK, weight: 0.08 },
];

interface StarSprite {
  core: HTMLCanvasElement;
  glow: HTMLCanvasElement;
  flare: HTMLCanvasElement;
}

interface Star {
  xRatio: number;
  worldY: number;
  radius: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  twinkleDepth: number;
  hasGlow: boolean;
  hasFlare: boolean;
  sprite: StarSprite;
}

interface StarLayer {
  parallaxFactor: number;
  pointerDepth: number;
  worldHeight: number;
  stars: Star[];
}

interface ShootingStar {
  startX: number;
  startY: number;
  directionX: number;
  directionY: number;
  speed: number;
  tailLength: number;
  bornAt: number;
  lifeMs: number;
  tint: string;
}

interface SkyState {
  context: CanvasRenderingContext2D;
  viewportWidth: number;
  viewportHeight: number;
  layers: StarLayer[];
}

interface PointerParallax {
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
}

interface ShootingState {
  active: ShootingStar[];
  nextSpawnAt: number;
}

// ---------------------------------------------------------------- sprite baking
const createOffscreen = (pixelSize: number): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } | null => {
  const canvas = document.createElement("canvas");
  canvas.width = pixelSize;
  canvas.height = pixelSize;
  const context = canvas.getContext("2d");
  return context === null ? null : { canvas, context };
};

const bakeCore = (tint: string, pixelSize: number): HTMLCanvasElement | null => {
  const offscreen = createOffscreen(pixelSize);
  if (offscreen === null) return null;
  const center = pixelSize / 2;
  const gradient = offscreen.context.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, hexToRgba(Palette.ICE, 1));
  gradient.addColorStop(0.12, hexToRgba(tint, 0.92));
  gradient.addColorStop(0.3, hexToRgba(tint, 0.26));
  gradient.addColorStop(0.6, hexToRgba(tint, 0.05));
  gradient.addColorStop(1, hexToRgba(tint, 0));
  offscreen.context.fillStyle = gradient;
  offscreen.context.fillRect(0, 0, pixelSize, pixelSize);
  return offscreen.canvas;
};

const bakeGlow = (tint: string, pixelSize: number): HTMLCanvasElement | null => {
  const offscreen = createOffscreen(pixelSize);
  if (offscreen === null) return null;
  const center = pixelSize / 2;
  const gradient = offscreen.context.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, hexToRgba(tint, 0.4));
  gradient.addColorStop(0.14, hexToRgba(tint, 0.2));
  gradient.addColorStop(0.4, hexToRgba(tint, 0.06));
  gradient.addColorStop(1, hexToRgba(tint, 0));
  offscreen.context.fillStyle = gradient;
  offscreen.context.fillRect(0, 0, pixelSize, pixelSize);
  return offscreen.canvas;
};

// Four tapered spikes (lens diffraction), filled with a radial falloff so the tips vanish.
const bakeFlare = (tint: string, pixelSize: number): HTMLCanvasElement | null => {
  const offscreen = createOffscreen(pixelSize);
  if (offscreen === null) return null;
  const context = offscreen.context;
  const center = pixelSize / 2;
  const spikeLength = center * 0.94;
  const spikeHalfWidth = pixelSize * 0.014;
  const gradient = context.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, hexToRgba(Palette.ICE, 0.9));
  gradient.addColorStop(0.18, hexToRgba(tint, 0.3));
  gradient.addColorStop(0.6, hexToRgba(tint, 0.05));
  gradient.addColorStop(1, hexToRgba(tint, 0));
  context.fillStyle = gradient;
  const directions: readonly { x: number; y: number }[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  for (const direction of directions) {
    const tipX = center + direction.x * spikeLength;
    const tipY = center + direction.y * spikeLength;
    const sideX = direction.y * spikeHalfWidth;
    const sideY = direction.x * spikeHalfWidth;
    context.beginPath();
    context.moveTo(center + sideX, center + sideY);
    context.lineTo(tipX, tipY);
    context.lineTo(center - sideX, center - sideY);
    context.closePath();
    context.fill();
  }
  return offscreen.canvas;
};

const bakeSprites = (pixelRatio: number): StarSprite[] => {
  const sprites: StarSprite[] = [];
  for (const tint of STAR_TINTS) {
    const core = bakeCore(tint.color, Math.round(CORE_SPRITE_PX * pixelRatio));
    const glow = bakeGlow(tint.color, Math.round(GLOW_SPRITE_PX * pixelRatio));
    const flare = bakeFlare(tint.color, Math.round(FLARE_SPRITE_PX * pixelRatio));
    if (core === null || glow === null || flare === null) continue;
    sprites.push({ core, glow, flare });
  }
  return sprites;
};

const pickSprite = (sprites: readonly StarSprite[], noise: number): StarSprite | null => {
  let cursor = 0;
  for (let index = 0; index < STAR_TINTS.length; index += 1) {
    const tint = STAR_TINTS[index];
    const sprite = sprites[index];
    if (tint === undefined || sprite === undefined) break;
    cursor += tint.weight;
    if (noise <= cursor) return sprite;
  }
  return sprites[0] ?? null;
};

// ---------------------------------------------------------------- world building
const buildLayer = (
  recipe: LayerRecipe,
  layerIndex: number,
  viewportHeight: number,
  starCount: number,
  sprites: readonly StarSprite[],
): StarLayer => {
  const worldHeight = viewportHeight * recipe.worldSpan;
  const stars: Star[] = [];
  for (let index = 0; index < starCount; index += 1) {
    // Seeded per (layer, index) so a resize keeps every star where it was.
    const seed = layerIndex * 9973 + index * 7;
    const sizeNoise = hashNoise(seed + 2);
    const radius = lerp(recipe.radiusMin, recipe.radiusMax, Math.pow(sizeNoise, 2.2));
    const sizeRatio = (radius - recipe.radiusMin) / (recipe.radiusMax - recipe.radiusMin);
    const sprite = pickSprite(sprites, hashNoise(seed + 5));
    if (sprite === null) break;
    const hasGlow = sizeRatio > 0.45 && hashNoise(seed + 6) < recipe.glowChance;
    stars.push({
      xRatio: hashNoise(seed),
      worldY: hashNoise(seed + 1) * worldHeight,
      radius,
      baseAlpha: lerp(recipe.alphaMin, recipe.alphaMax, hashNoise(seed + 3) * 0.45 + sizeRatio * 0.55),
      twinklePhase: hashNoise(seed + 4) * Math.PI * 2,
      // Small stars flicker fast and shallow; big ones breathe slowly and deeply.
      twinkleSpeed: lerp(3.4, 0.7, sizeRatio) * lerp(0.7, 1.3, hashNoise(seed + 7)),
      twinkleDepth: lerp(0.45, 0.82, sizeRatio),
      hasGlow,
      hasFlare: hasGlow && hashNoise(seed + 8) < recipe.flareChance,
      sprite,
    });
  }
  return { parallaxFactor: recipe.parallaxFactor, pointerDepth: recipe.pointerDepth, worldHeight, stars };
};

const buildSky = (canvas: HTMLCanvasElement): SkyState | null => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  canvas.width = Math.round(viewportWidth * pixelRatio);
  canvas.height = Math.round(viewportHeight * pixelRatio);
  const context = canvas.getContext("2d");
  if (context === null) return null;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const sprites = bakeSprites(pixelRatio);
  const viewportArea = viewportWidth * viewportHeight;
  const wanted = LAYER_RECIPES.map((recipe) => Math.round((viewportArea * recipe.worldSpan) / recipe.areaPerStar));
  const total = wanted.reduce((sum, count) => sum + count, 0);
  const budgetScale = total > MAX_STARS ? MAX_STARS / total : 1;

  const layers = LAYER_RECIPES.map((recipe, layerIndex) =>
    buildLayer(recipe, layerIndex, viewportHeight, Math.floor((wanted[layerIndex] ?? 0) * budgetScale), sprites),
  );
  return { context, viewportWidth, viewportHeight, layers };
};

// ---------------------------------------------------------------- drawing
const drawStars = (state: SkyState, scrollY: number, seconds: number, pointerX: number, pointerY: number): void => {
  const { context, viewportWidth, viewportHeight } = state;
  for (const layer of state.layers) {
    const offsetX = pointerX * layer.pointerDepth * POINTER_PARALLAX_PX;
    const offsetY = pointerY * layer.pointerDepth * POINTER_PARALLAX_PX;
    const scrollOffset = (scrollY + seconds * AMBIENT_DRIFT_PX_PER_S) * layer.parallaxFactor;
    for (const star of layer.stars) {
      let y = (star.worldY - scrollOffset) % layer.worldHeight;
      if (y < 0) y += layer.worldHeight;
      if (y > viewportHeight + OFFSCREEN_MARGIN_PX) {
        // Wrap the tail of the world back above the fold so the seam never opens a gap.
        y -= layer.worldHeight;
        if (y < -OFFSCREEN_MARGIN_PX) continue;
      }
      y += offsetY;
      const sway = Math.sin(seconds * 0.13 + star.twinklePhase) * AMBIENT_SWAY_PX * layer.pointerDepth;
      const x = (star.xRatio * 1.04 - 0.02) * viewportWidth + offsetX + sway;
      const twinkle = 1 - star.twinkleDepth * (0.5 + 0.5 * Math.sin(seconds * star.twinkleSpeed + star.twinklePhase));
      // Flare stars occasionally spike into a bright sparkle for a fraction of a second.
      const flash = star.hasFlare
        ? Math.pow(Math.max(0, Math.sin(seconds * FLASH_RATE + star.twinklePhase * 3.1)), FLASH_SHARPNESS)
        : 0;
      const alpha = Math.min(1, star.baseAlpha * twinkle + flash * 0.9);

      if (star.hasGlow) {
        const glowSize = star.radius * GLOW_DRAW_SCALE;
        context.globalAlpha = alpha * 0.55;
        context.drawImage(star.sprite.glow, x - glowSize / 2, y - glowSize / 2, glowSize, glowSize);
      }
      if (star.hasFlare) {
        const flareSize = star.radius * FLARE_DRAW_SCALE * (1 + flash * 1.4);
        context.globalAlpha = Math.min(1, alpha * twinkle * 0.4 + flash * 0.7);
        context.drawImage(star.sprite.flare, x - flareSize / 2, y - flareSize / 2, flareSize, flareSize);
      }
      const coreSize = star.radius * CORE_DRAW_SCALE;
      context.globalAlpha = alpha;
      context.drawImage(star.sprite.core, x - coreSize / 2, y - coreSize / 2, coreSize, coreSize);
    }
  }
  context.globalAlpha = 1;
};

const spawnShootingStar = (viewportWidth: number, viewportHeight: number, bornAt: number): ShootingStar => {
  const goesLeft = Math.random() < 0.5;
  const slope = lerp(0.3, 0.62, Math.random()); // radians below the horizon, always falling
  return {
    startX: viewportWidth * (goesLeft ? lerp(0.55, 1.15, Math.random()) : lerp(-0.15, 0.45, Math.random())),
    startY: viewportHeight * lerp(-0.1, 0.4, Math.random()),
    directionX: (goesLeft ? -1 : 1) * Math.cos(slope),
    directionY: Math.sin(slope),
    speed: lerp(0.9, 1.5, Math.random()) * viewportWidth,
    tailLength: lerp(0.14, 0.26, Math.random()) * viewportWidth,
    bornAt,
    lifeMs: lerp(SHOOTING_LIFE_MIN_MS, SHOOTING_LIFE_MAX_MS, Math.random()),
    tint: Math.random() < 0.25 ? Palette.STAR_BLUE : Palette.STAR_WHITE,
  };
};

const drawShootingStars = (state: SkyState, shooting: ShootingState, timeMs: number): void => {
  const { context, viewportWidth, viewportHeight } = state;
  if (shooting.nextSpawnAt === 0) {
    shooting.nextSpawnAt = timeMs + lerp(SHOOTING_GAP_MIN_MS, SHOOTING_GAP_MAX_MS, Math.random());
  }
  if (timeMs >= shooting.nextSpawnAt) {
    shooting.active.push(spawnShootingStar(viewportWidth, viewportHeight, timeMs));
    if (Math.random() < SHOOTING_BURST_CHANCE) {
      shooting.active.push(spawnShootingStar(viewportWidth, viewportHeight, timeMs + lerp(220, 620, Math.random())));
    }
    shooting.nextSpawnAt = timeMs + lerp(SHOOTING_GAP_MIN_MS, SHOOTING_GAP_MAX_MS, Math.random());
  }

  for (let index = shooting.active.length - 1; index >= 0; index -= 1) {
    const star = shooting.active[index];
    if (star === undefined) continue;
    const elapsed = timeMs - star.bornAt;
    if (elapsed > star.lifeMs) {
      shooting.active.splice(index, 1);
      continue;
    }
    if (elapsed < 0) continue;
    const progress = elapsed / star.lifeMs;
    const travelled = (star.speed * elapsed) / 1000;
    const headX = star.startX + star.directionX * travelled;
    const headY = star.startY + star.directionY * travelled;
    const tail = star.tailLength * clamp(progress * 4, 0, 1);
    const tailX = headX - star.directionX * tail;
    const tailY = headY - star.directionY * tail;
    const fade = Math.min(1, progress * 8) * Math.pow(1 - progress, 0.9);

    const trail = context.createLinearGradient(headX, headY, tailX, tailY);
    trail.addColorStop(0, hexToRgba(Palette.ICE, 0.95 * fade));
    trail.addColorStop(0.28, hexToRgba(star.tint, 0.4 * fade));
    trail.addColorStop(1, hexToRgba(star.tint, 0));
    context.strokeStyle = trail;
    context.lineCap = "round";
    // Two passes: a wide soft body plus a thin bright spine, so the tail tapers.
    context.lineWidth = 2.6;
    context.globalAlpha = 0.5;
    context.beginPath();
    context.moveTo(headX, headY);
    context.lineTo(tailX, tailY);
    context.stroke();
    context.lineWidth = 1.1;
    context.globalAlpha = 1;
    context.beginPath();
    context.moveTo(headX, headY);
    context.lineTo(tailX, tailY);
    context.stroke();

    const headRadius = 26;
    const head = context.createRadialGradient(headX, headY, 0, headX, headY, headRadius);
    head.addColorStop(0, hexToRgba(Palette.ICE, 0.9 * fade));
    head.addColorStop(0.2, hexToRgba(star.tint, 0.32 * fade));
    head.addColorStop(1, hexToRgba(star.tint, 0));
    context.fillStyle = head;
    context.beginPath();
    context.arc(headX, headY, headRadius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
};

const renderSky = (
  state: SkyState,
  scrollY: number,
  timeMs: number,
  pointer: PointerParallax | null,
  shooting: ShootingState | null,
): void => {
  const { context, viewportWidth, viewportHeight } = state;
  context.clearRect(0, 0, viewportWidth, viewportHeight);
  context.globalCompositeOperation = "lighter"; // stars add light, they never occlude each other
  drawStars(state, scrollY, timeMs / 1000, pointer === null ? 0 : pointer.currentX, pointer === null ? 0 : pointer.currentY);
  if (shooting !== null) drawShootingStars(state, shooting, timeMs);
  context.globalCompositeOperation = "source-over";
};

/** Paints the parallax star sky on a full-viewport canvas. Draws from the shared scrub loop, never from React state. */
export const useStarField = (canvasRef: RefObject<HTMLCanvasElement | null>): void => {
  const reducedMotion = useReducedMotion();
  const skyRef = useRef<SkyState | null>(null);
  const pointerRef = useRef<PointerParallax>({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const shootingRef = useRef<ShootingState>({ active: [], nextSpawnAt: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const rebuild = () => {
      const sky = buildSky(canvas);
      skyRef.current = sky;
      // Reduced motion gets one static sky: no twinkle, no parallax, no shooting stars.
      if (sky !== null && reducedMotion) renderSky(sky, window.scrollY, 0, null, null);
    };
    rebuild();

    const handleResize = () => {
      const sky = skyRef.current;
      if (sky !== null && sky.viewportWidth === window.innerWidth && Math.abs(sky.viewportHeight - window.innerHeight) < REBUILD_HEIGHT_TOLERANCE) return;
      rebuild();
    };
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (event: PointerEvent) => {
      const pointer = pointerRef.current;
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const usesFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (usesFinePointer && !reducedMotion) window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      skyRef.current = null;
    };
  }, [canvasRef, reducedMotion]);

  useScrollScrub((frame) => {
    const sky = skyRef.current;
    if (sky === null || reducedMotion) return;
    const pointer = pointerRef.current;
    pointer.currentX += (pointer.targetX - pointer.currentX) * POINTER_EASE;
    pointer.currentY += (pointer.targetY - pointer.currentY) * POINTER_EASE;
    renderSky(sky, frame.scrollY, frame.time, pointer, shootingRef.current);
  });
};
