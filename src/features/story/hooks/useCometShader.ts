import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import { Palette } from "@/common/models/palette";
import { COMET_FRAGMENT_SHADER, COMET_VERTEX_SHADER } from "@/features/story/helpers/cometShader";
import { cometFrameOf } from "@/features/story/hooks/useSignatureParticles";

/** Same imperative contract as the particle system. */
export interface CometShaderHandle {
  render: (progress: number, timeMs: number) => void;
  resize: () => void;
}

/** Render scale relative to CSS px: the comet is all soft gradients, so half resolution reads identically. */
const RENDER_SCALE = 0.6;
const DPR_CAP = 1.5;
/** Fraction of the comet unit that is one shader unit; 1 = the particle cloud radius. */
const UNIT_SCALE = 1;

interface GlProgram {
  gl: WebGLRenderingContext;
  head: WebGLUniformLocation | null;
  dir: WebGLUniformLocation | null;
  scale: WebGLUniformLocation | null;
  length: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  intensity: WebGLUniformLocation | null;
}

const hexToVec3 = (hex: string): [number, number, number] => {
  const value = parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

const compile = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const setupProgram = (canvas: HTMLCanvasElement): GlProgram | null => {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
  if (!gl) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, COMET_VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, COMET_FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle covering clip space; the fragment shader does all the work.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.uniform3fv(gl.getUniformLocation(program, "u_ice"), hexToVec3(Palette.ICE));
  gl.uniform3fv(gl.getUniformLocation(program, "u_comet"), hexToVec3(Palette.COMET));
  gl.uniform3fv(gl.getUniformLocation(program, "u_blue"), hexToVec3(Palette.STAR_BLUE));
  gl.uniform3fv(gl.getUniformLocation(program, "u_pink"), hexToVec3(Palette.SAKURA));
  gl.clearColor(0, 0, 0, 0);

  return {
    gl,
    head: gl.getUniformLocation(program, "u_head"),
    dir: gl.getUniformLocation(program, "u_dir"),
    scale: gl.getUniformLocation(program, "u_scale"),
    length: gl.getUniformLocation(program, "u_length"),
    time: gl.getUniformLocation(program, "u_time"),
    intensity: gl.getUniformLocation(program, "u_intensity"),
  };
};

/** Draws the volumetric comet under the particles; silently does nothing where WebGL is unavailable. */
export const useCometShader = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  reducedMotion: boolean,
): CometShaderHandle => {
  const programRef = useRef<GlProgram | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, pixelScale: 1 });
  const clearedRef = useRef(false);
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const program = programRef.current;
    if (!canvas || !program) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    const pixelScale = Math.min(window.devicePixelRatio || 1, DPR_CAP) * RENDER_SCALE;
    canvas.width = Math.round(width * pixelScale);
    canvas.height = Math.round(height * pixelScale);
    program.gl.viewport(0, 0, canvas.width, canvas.height);
    sizeRef.current = { width, height, pixelScale };
    clearedRef.current = false;
  }, [canvasRef]);

  const render = useCallback((progress: number, timeMs: number) => {
    const program = programRef.current;
    if (!program) return;
    const { gl } = program;
    const { width, height, pixelScale } = sizeRef.current;
    if (width === 0 || height === 0) return;

    const frame = cometFrameOf(width, height, progress, timeMs * 0.001);
    const intensity = reducedRef.current ? 0 : frame.light;
    if (intensity <= 0.002) {
      // Nothing to show: clear once and skip the full-screen pass until the comet is back.
      if (!clearedRef.current) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        clearedRef.current = true;
      }
      return;
    }
    clearedRef.current = false;

    // Canvas px with GL orientation (origin bottom-left).
    gl.uniform2f(program.head, frame.headX * pixelScale, (height - frame.headY) * pixelScale);
    gl.uniform2f(program.dir, frame.dirX, -frame.dirY);
    gl.uniform1f(program.scale, frame.radius * pixelScale * UNIT_SCALE);
    gl.uniform1f(program.length, frame.tailLength / frame.radius);
    gl.uniform1f(program.time, timeMs * 0.001);
    gl.uniform1f(program.intensity, intensity);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    programRef.current = setupProgram(canvas);
    resize();
    const observer = new ResizeObserver(() => resize());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef, resize]);

  return useMemo(() => ({ render, resize }), [render, resize]);
};
