"use client";

import { useEffect, useRef } from "react";

type Pointer = { x: number; y: number; active: boolean };

type Renderer = {
  /** Upper bound on the backing-store ratio this renderer can afford. */
  maxPixelRatio: number;
  resize: (width: number, height: number, dpr: number) => void;
  frame: (elapsed: number, pointer: Pointer) => void;
  /** A click at this point, if the renderer has something to say about it. */
  impulse?: (x: number, y: number, elapsed: number) => void;
  dispose: () => void;
};

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  hue: number;
};

const VERTEX_SHADER = `
attribute vec2 aPos;

void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// The backdrop is additive light only: it never paints an opaque background, so
// the CSS aurora and stellar-cloud layers underneath stay visible. Alpha is the
// brightest channel, which keeps the premultiplied output valid (rgb <= a).
const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerOn;
// xy = origin in uv, z = start time in seconds; z < 0.0 means the slot is free.
uniform vec3 uRipples[3];
// 0 while no ripple is alive. A uniform branch is the same for every pixel in
// the draw, so skipping the whole block costs nothing and saves three exp() a
// pixel on the overwhelmingly common idle frame.
uniform float uRippleOn;

const vec3 SKY = vec3(0.41, 0.84, 1.0);
const vec3 VIOLET = vec3(0.44, 0.35, 1.0);
const vec3 ROSE = vec3(1.0, 0.48, 0.62);

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Octave count is the whole cost of this shader: every octave is four hashes
// per pixel. The warp field only needs the low frequencies, so it runs at three.
float fbm3(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 3; i++) {
    sum += amp * valueNoise(p);
    p = rot * p * 2.03;
    amp *= 0.5;
  }
  return sum;
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    sum += amp * valueNoise(p);
    p = rot * p * 2.03;
    amp *= 0.5;
  }
  return sum;
}

float starLayer(vec2 uv, float density, float seed, float t) {
  vec2 grid = uv * density;
  vec2 id = floor(grid);
  vec2 f = fract(grid) - 0.5;
  float h = hash21(id + seed);
  vec2 jitter = vec2(hash21(id + seed + 11.7), hash21(id + seed + 27.3)) - 0.5;
  float d = length(f - jitter * 0.72);
  float size = mix(0.018, 0.055, hash21(id + seed + 5.1));
  float twinkle = 0.5 + 0.5 * sin(t * (0.9 + h * 2.2) + h * 34.0);
  return step(0.82, h) * twinkle * smoothstep(size, 0.0, d);
}

// One meteor per cycle, seeded off the cycle index so the entry point changes
// every pass instead of looping identically.
float meteor(vec2 uv, float aspect, float t) {
  float cycle = 6.5;
  float idx = floor(t / cycle);
  float local = fract(t / cycle) * cycle;
  vec2 start = vec2(mix(-0.15, 0.85, hash21(vec2(idx, 3.7))), mix(0.72, 1.12, hash21(vec2(idx, 9.1))));
  vec2 dir = normalize(vec2(0.86, -0.51));
  float progress = clamp(local / 1.15, 0.0, 1.0);
  vec2 head = start + dir * progress * 1.35;
  vec2 rel = (uv - head) * vec2(aspect, 1.0);
  float along = dot(rel, dir);
  float perp = length(rel - along * dir);
  float trail = exp(-perp * 340.0) * exp(along * 26.0) * step(along, 0.0);
  float spark = exp(-dot(rel, rel) * 5200.0);
  float life = smoothstep(0.0, 0.06, progress) * smoothstep(1.0, 0.70, progress);
  return (trail + spark) * life;
}

// A click pushes a ring outward through the gas: the band both lights up and
// displaces the sample position, so the cloud visibly bulges as it passes.
vec2 rippleShift(vec2 uv, float aspect, float t, out float glow) {
  vec2 shift = vec2(0.0);
  glow = 0.0;
  if (uRippleOn < 0.5) return shift;
  for (int i = 0; i < 3; i++) {
    float start = uRipples[i].z;
    float age = t - start;
    float alive = step(0.0, start) * step(0.0, age) * step(age, 1.8);
    vec2 toward = (uv - uRipples[i].xy) * vec2(aspect, 1.0);
    float d = length(toward);
    float radius = age * 0.38;
    float edge = (d - radius) * 11.0;
    float band = exp(-edge * edge) * exp(-age * 1.7) * alive;
    shift += (toward / max(d, 0.0008)) * band * 0.026;
    glow += band;
  }
  return shift;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;

  // The flow field swirls around the cursor and relaxes back once it leaves;
  // uPointerOn is eased in JS so the relax is not a hard cut.
  vec2 toPointer = (uv - uPointer) * vec2(aspect, 1.0);
  float pd = length(toPointer);
  float influence = uPointerOn * exp(-pd * pd * 7.5);
  float angle = influence * 1.15;
  mat2 swirl = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 warped = uPointer + (swirl * toPointer) / vec2(aspect, 1.0) * (1.0 - influence * 0.16);

  float rippleGlow;
  warped += rippleShift(uv, aspect, uTime, rippleGlow) / vec2(aspect, 1.0);

  vec2 p = warped * vec2(aspect, 1.0) * 2.4;
  float t = uTime * 0.045;

  // Domain warping: a second fbm displaces the first, which is what turns flat
  // fog into filaments.
  vec2 drift = vec2(fbm3(p + vec2(t, -t * 0.7)), fbm3(p + vec2(4.7 - t * 0.6, 1.3 + t)));
  float cloud = fbm(p + drift * 1.7);
  cloud = pow(smoothstep(0.24, 0.92, cloud), 1.6);

  float band = smoothstep(1.05, -0.15, uv.y);
  vec3 light = VIOLET * cloud * 0.42 * band;
  light += SKY * pow(cloud, 2.1) * 0.5 * (0.35 + band * 0.65);
  light += ROSE * pow(cloud, 3.4) * 0.16;

  // Three parallax layers; the near one drifts fastest and reads as depth.
  vec2 sv = vec2(warped.x * aspect, warped.y);
  light += vec3(0.75, 0.88, 1.0) * starLayer(sv + vec2(uTime * 0.004, 0.0), 26.0, 0.0, uTime) * 0.55;
  light += vec3(0.85, 0.92, 1.0) * starLayer(sv + vec2(uTime * 0.009, 0.0), 15.0, 7.3, uTime) * 0.80;
  light += SKY * starLayer(sv + vec2(uTime * 0.016, 0.0), 8.0, 19.1, uTime) * 1.05;

  light += mix(SKY, VIOLET, 0.35) * meteor(uv, aspect, uTime) * 1.4;

  // The cursor reads as a bright core sitting in the gas rather than an overlay
  // drawn on top of it: same palette, same swirl, lit from the same pass.
  float core = exp(-pd * pd * 900.0);
  light += SKY * influence * 0.26;
  light += VIOLET * influence * influence * 0.34;
  light += mix(SKY, vec3(1.0), 0.35) * core * uPointerOn * 0.55;
  light += mix(SKY, VIOLET, 0.5) * rippleGlow * 0.5;

  // Dither, or the large soft gradients band on 8-bit displays.
  light += (hash21(gl_FragCoord.xy) - 0.5) * 0.015;

  float alpha = clamp(max(max(light.r, light.g), light.b), 0.0, 1.0);
  gl_FragColor = vec4(clamp(light, 0.0, 1.0), alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createNebula(canvas: HTMLCanvasElement): Renderer | null {
  const gl = (canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (!vertex || !fragment || !program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // One oversized triangle instead of a quad: no shared edge, one less vertex.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uPointer = gl.getUniformLocation(program, "uPointer");
  const uPointerOn = gl.getUniformLocation(program, "uPointerOn");
  const uRipples = gl.getUniformLocation(program, "uRipples");
  const uRippleOn = gl.getUniformLocation(program, "uRippleOn");

  let width = 1;
  let height = 1;
  let smoothX = 0.5;
  let smoothY = 0.5;
  let smoothOn = 0;
  let contextLost = false;
  // Three slots, reused oldest-first: a visitor clicking repeatedly gets
  // overlapping rings rather than a queue.
  const ripples = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1]);
  let nextRipple = 0;

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    // Fill-rate bound: ~2.6ms per full-screen pass at 1.0Mpx on Intel UHD, and
    // it scales linearly with pixel count, so a large or high-DPI display would
    // blow the frame budget at the device ratio. Never render above 1:1, and
    // the driver caps total pixels on top of this.
    maxPixelRatio: 1,
    resize(nextWidth, nextHeight) {
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    },
    frame(elapsed, pointer) {
      if (contextLost) return;
      const targetX = pointer.active ? pointer.x / width : 0.5;
      // gl_FragCoord counts up from the bottom, pointer events count down.
      const targetY = pointer.active ? 1 - pointer.y / height : 0.5;
      const targetOn = pointer.active ? 1 : 0;
      smoothX += (targetX - smoothX) * 0.08;
      smoothY += (targetY - smoothY) * 0.08;
      smoothOn += (targetOn - smoothOn) * 0.05;

      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uPointer, smoothX, smoothY);
      gl.uniform1f(uPointerOn, smoothOn);
      // Retire finished slots so the shader can skip the block entirely.
      let active = 0;
      for (let slot = 2; slot < ripples.length; slot += 3) {
        if (ripples[slot] < 0) continue;
        if (elapsed - ripples[slot] > 1.8) ripples[slot] = -1;
        else active += 1;
      }
      gl.uniform3fv(uRipples, ripples);
      gl.uniform1f(uRippleOn, active ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    impulse(x, y, elapsed) {
      const slot = nextRipple * 3;
      ripples[slot] = x / width;
      ripples[slot + 1] = 1 - y / height;
      ripples[slot + 2] = elapsed;
      nextRipple = (nextRipple + 1) % 3;
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

function createStarfield(canvas: HTMLCanvasElement): Renderer | null {
  const context = canvas.getContext("2d");
  if (!context) return null;

  let stars: Star[] = [];
  let width = 0;
  let height = 0;
  let tick = 0;

  const seedStars = () => {
    const count = Math.max(90, Math.min(260, Math.round((width * height) / 6200)));
    stars = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      radius: index % 17 === 0 ? 1.8 + Math.random() * 1.2 : 0.45 + Math.random() * 1.15,
      alpha: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.74 ? 275 : 198 + Math.random() * 24,
    }));
  };

  return {
    maxPixelRatio: 2,
    resize(nextWidth, nextHeight, dpr) {
      width = nextWidth;
      height = nextHeight;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    },
    frame(_elapsed, pointer) {
      tick += 1;
      context.clearRect(0, 0, width, height);
      if (pointer.active) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 260);
        glow.addColorStop(0, "rgba(105, 214, 255, 0.12)");
        glow.addColorStop(0.45, "rgba(112, 90, 255, 0.055)");
        glow.addColorStop(1, "rgba(10, 12, 34, 0)");
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);
      }

      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;

        if (pointer.active) {
          const dx = star.x - pointer.x;
          const dy = star.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 1 && distance < 230) {
            const force = (1 - distance / 230) * 0.7;
            star.x += (dx / distance) * force;
            star.y += (dy / distance) * force;
            star.x += (-dy / distance) * force * 0.34;
            star.y += (dx / distance) * force * 0.34;
          }
        }

        if (star.x < -8) star.x = width + 8;
        if (star.x > width + 8) star.x = -8;
        if (star.y < -8) star.y = height + 8;
        if (star.y > height + 8) star.y = -8;

        const twinkle = 0.62 + Math.sin(tick * 0.018 + star.phase) * 0.38;
        const distance = pointer.active ? Math.hypot(star.x - pointer.x, star.y - pointer.y) : 999;
        const proximity = Math.max(0, 1 - distance / 210);
        const radius = star.radius + proximity * 1.3;
        const alpha = Math.min(1, star.alpha * twinkle + proximity * 0.45);

        if (proximity > 0.33) {
          context.beginPath();
          context.moveTo(star.x, star.y);
          context.lineTo(pointer.x, pointer.y);
          context.strokeStyle = `hsla(${star.hue}, 92%, 76%, ${proximity * 0.13})`;
          context.lineWidth = 0.45;
          context.stroke();
        }

        context.beginPath();
        context.arc(star.x, star.y, radius, 0, Math.PI * 2);
        context.fillStyle = `hsla(${star.hue}, 96%, 82%, ${alpha})`;
        context.shadowColor = `hsla(${star.hue}, 100%, 72%, ${0.72 + proximity * 0.28})`;
        context.shadowBlur = radius > 1.5 ? 12 + proximity * 18 : 4 + proximity * 10;
        context.fill();
      }

      context.shadowBlur = 0;
    },
    dispose() {},
  };
}

export function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // getContext only locks a canvas to a context type once it returns one, so
    // asking for webgl first and falling through to 2d is safe.
    const renderer = createNebula(canvas) ?? createStarfield(canvas);
    if (!renderer) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer: Pointer = { x: -1000, y: -1000, active: false };
    const started = performance.now();
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let running = false;
    let onScreen = true;
    let pageVisible = !document.hidden;
    let quality = 1;
    let degradations = 0;
    let frameInterval = 0;
    let lastFrame = 0;
    let sampled = 0;
    let sampleTotal = 0;

    const render = () => renderer.frame((performance.now() - started) / 1000, pointer);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      let dpr = Math.min(window.devicePixelRatio || 1, 1.75, renderer.maxPixelRatio) * quality;
      // A 4K or scaled-up display would otherwise ask for four times the pixels
      // a 1080p one does at the same ratio.
      const budget = 1_300_000;
      const requested = width * height * dpr * dpr;
      if (requested > budget) dpr *= Math.sqrt(budget / requested);

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      renderer.resize(width, height, dpr);
      if (!running) render();
    };

    // Nothing here knows what GPU it landed on, so measure: if the backdrop
    // cannot hold a frame budget it drops resolution twice, then halves its
    // frame rate. It never stops outright — freezing mid-ripple would leave a
    // static ring painted across the hero, which reads far worse than a slower
    // one.
    const draw = () => {
      const now = performance.now();
      if (frameInterval && lastFrame && now - lastFrame < frameInterval) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      if (lastFrame) {
        sampled += 1;
        sampleTotal += now - lastFrame;
        if (sampled >= 45) {
          const average = sampleTotal / sampled;
          sampled = 0;
          sampleTotal = 0;
          if (average > 20 && degradations < 2) {
            degradations += 1;
            quality *= 0.72;
            resize();
          } else if (average > 20) {
            frameInterval = 32;
          }
        }
      }
      lastFrame = now;

      render();
      if (running) animationFrame = window.requestAnimationFrame(draw);
    };

    // The backdrop is one screen tall on a very long page: stop burning frames
    // once it scrolls away or the tab goes to the background.
    const sync = () => {
      const shouldRun = !reduceMotion && onScreen && pageVisible;
      if (shouldRun === running) return;
      running = shouldRun;
      if (shouldRun) {
        lastFrame = 0;
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      sync();
    };

    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!renderer.impulse) return;
      // A click on a link or control is already paying for navigation or a
      // smooth scroll; do not stack a full-screen effect on top of it.
      if ((event.target as Element | null)?.closest?.("a, button, details, input, video")) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      renderer.impulse(x, y, (performance.now() - started) / 1000);
      if (!running) render();
    };

    resize();
    visibility.observe(canvas);
    sync();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      visibility.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />;
}
