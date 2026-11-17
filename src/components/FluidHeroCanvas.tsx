"use client";

import React, { useEffect, useRef } from "react";

interface FluidHeroCanvasProps {
  mach?: number; // 0.3 | 0.85 | 1.8
  afterburner?: boolean;
  resetSignal?: number;
  vortexMode?: boolean;
  onCursorTelemetry?: (speed: number, xPct: number, yPct: number) => void;
}

/**
 * Real-time GPU WebGL2 2D Eulerian Navier-Stokes wind tunnel.
 * Rasterizes the hero name ("YOUSSEF HEGAZY") + cutout portrait silhouette
 * into a physical solid obstacle mask so airflow deflects & sheds live vortices.
 * Automatically falls back to a smooth Canvas2D flow field on unsupported GPUs.
 */
export default function FluidHeroCanvas({
  mach = 0.85,
  afterburner = false,
  resetSignal = 0,
  vortexMode = false,
  onCursorTelemetry,
}: FluidHeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const propsRef = useRef({ mach, afterburner, vortexMode, onCursorTelemetry });
  propsRef.current = { mach, afterburner, vortexMode, onCursorTelemetry };
  const resetFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (resetSignal > 0 && resetFnRef.current) {
      resetFnRef.current();
    }
  }, [resetSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    const extFloat = gl ? gl.getExtension("EXT_color_buffer_float") : null;
    if (!gl || !extFloat || prefersReduced) {
      return initFallback2D(canvas, propsRef, prefersReduced);
    }

    // -------------------------------------------------------------------------
    // WebGL2 Ping-Pong Navier-Stokes Shaders
    // -------------------------------------------------------------------------
    const SIM_W = 320;
    const SIM_H = 180;

    const baseVert = `#version 300 es
      in vec2 aPos;
      out vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const splatFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uTarget;
      uniform sampler2D uObs;
      uniform vec2 uPoint;
      uniform vec3 uValue;
      uniform float uRadius;
      uniform float uAspect;
      void main() {
        if (texture(uObs, vUv).r > 0.5) {
          fragColor = vec4(0.0);
          return;
        }
        vec2 p = vUv - uPoint;
        p.x *= uAspect;
        float splat = exp(-dot(p, p) / uRadius);
        vec3 base = texture(uTarget, vUv).xyz;
        fragColor = vec4(base + splat * uValue, 1.0);
      }
    `;

    const inflowFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uVel;
      uniform sampler2D uObs;
      uniform float uSpeed;
      uniform float uTime;
      void main() {
        float obs = texture(uObs, vUv).r;
        if (obs > 0.5) {
          fragColor = vec4(0.0, 0.0, 0.0, 1.0);
          return;
        }
        vec2 v = texture(uVel, vUv).xy;
        if (vUv.x < 0.025) {
          float ripple = 0.04 * sin(vUv.y * 28.0 + uTime * 3.5);
          v = mix(v, vec2(uSpeed, ripple), 0.72);
        }
        fragColor = vec4(v * 0.9992, 0.0, 1.0);
      }
    `;

    const dyeInflowFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uDye;
      uniform sampler2D uObs;
      uniform float uTime;
      uniform int uAfterburner;
      void main() {
        if (texture(uObs, vUv).r > 0.5) {
          fragColor = vec4(0.0);
          return;
        }
        vec3 d = texture(uDye, vUv).rgb * 0.992;
        if (vUv.x < 0.04) {
          float band = smoothstep(0.15, 0.96, sin(vUv.y * 44.0 + sin(uTime * 1.3) * 0.45));
          vec3 col = uAfterburner == 1
            ? mix(vec3(0.96, 0.58, 0.08), vec3(0.22, 0.78, 0.98), 0.35 + 0.35 * sin(vUv.y * 12.0))
            : mix(vec3(0.08, 0.52, 0.92), vec3(0.25, 0.85, 1.00), 0.5 + 0.5 * sin(vUv.y * 16.0 + uTime));
          d = max(d, col * band * 0.98);
        }
        fragColor = vec4(d, 1.0);
      }
    `;

    const curlFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uVel;
      uniform vec2 uTexel;
      void main() {
        float L = texture(uVel, vUv - vec2(uTexel.x, 0.0)).y;
        float R = texture(uVel, vUv + vec2(uTexel.x, 0.0)).y;
        float T = texture(uVel, vUv + vec2(0.0, uTexel.y)).x;
        float B = texture(uVel, vUv - vec2(0.0, uTexel.y)).x;
        fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }
    `;

    const vorticityFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uVel;
      uniform sampler2D uCurl;
      uniform sampler2D uObs;
      uniform vec2 uTexel;
      uniform float uStrength;
      uniform float uDt;
      void main() {
        if (texture(uObs, vUv).r > 0.5) {
          fragColor = vec4(0.0);
          return;
        }
        float L = abs(texture(uCurl, vUv - vec2(uTexel.x, 0.0)).x);
        float R = abs(texture(uCurl, vUv + vec2(uTexel.x, 0.0)).x);
        float T = abs(texture(uCurl, vUv + vec2(0.0, uTexel.y)).x);
        float B = abs(texture(uCurl, vUv - vec2(0.0, uTexel.y)).x);
        float C = texture(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(T - B, L - R);
        force /= length(force) + 1e-5;
        force *= uStrength * C;
        vec2 vel = texture(uVel, vUv).xy + force * uDt;
        fragColor = vec4(clamp(vel, -8.0, 8.0), 0.0, 1.0);
      }
    `;

    const divFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uVel;
      uniform sampler2D uObs;
      uniform vec2 uTexel;
      void main() {
        float cO = texture(uObs, vUv).r;
        if (cO > 0.5) {
          fragColor = vec4(0.0);
          return;
        }
        vec2 C = texture(uVel, vUv).xy;
        float L = texture(uObs, vUv - vec2(uTexel.x, 0.0)).r > 0.5 ? -C.x : texture(uVel, vUv - vec2(uTexel.x, 0.0)).x;
        float R = texture(uObs, vUv + vec2(uTexel.x, 0.0)).r > 0.5 ? -C.x : texture(uVel, vUv + vec2(uTexel.x, 0.0)).x;
        float T = texture(uObs, vUv + vec2(0.0, uTexel.y)).r > 0.5 ? -C.y : texture(uVel, vUv + vec2(0.0, uTexel.y)).y;
        float B = texture(uObs, vUv - vec2(0.0, uTexel.y)).r > 0.5 ? -C.y : texture(uVel, vUv - vec2(0.0, uTexel.y)).y;
        fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }
    `;

    const jacobiFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uPressure;
      uniform sampler2D uDiv;
      uniform sampler2D uObs;
      uniform vec2 uTexel;
      void main() {
        float cP = texture(uPressure, vUv).x;
        float L = texture(uObs, vUv - vec2(uTexel.x, 0.0)).r > 0.5 ? cP : texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
        float R = texture(uObs, vUv + vec2(uTexel.x, 0.0)).r > 0.5 ? cP : texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
        float T = texture(uObs, vUv + vec2(0.0, uTexel.y)).r > 0.5 ? cP : texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
        float B = texture(uObs, vUv - vec2(0.0, uTexel.y)).r > 0.5 ? cP : texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
        float div = texture(uDiv, vUv).x;
        fragColor = vec4((L + R + T + B - div) * 0.25, 0.0, 0.0, 1.0);
      }
    `;

    const gradSubFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uPressure;
      uniform sampler2D uVel;
      uniform sampler2D uObs;
      uniform vec2 uTexel;
      void main() {
        if (texture(uObs, vUv).r > 0.5) {
          fragColor = vec4(0.0);
          return;
        }
        float cP = texture(uPressure, vUv).x;
        float L = texture(uObs, vUv - vec2(uTexel.x, 0.0)).r > 0.5 ? cP : texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
        float R = texture(uObs, vUv + vec2(uTexel.x, 0.0)).r > 0.5 ? cP : texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
        float T = texture(uObs, vUv + vec2(0.0, uTexel.y)).r > 0.5 ? cP : texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
        float B = texture(uObs, vUv - vec2(0.0, uTexel.y)).r > 0.5 ? cP : texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
        vec2 vel = texture(uVel, vUv).xy - 0.5 * vec2(R - L, T - B);
        fragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    const advectFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uVel;
      uniform sampler2D uSource;
      uniform sampler2D uObs;
      uniform vec2 uTexel;
      uniform float uDt;
      uniform float uDissip;
      void main() {
        if (texture(uObs, vUv).r > 0.5) {
          fragColor = vec4(0.0);
          return;
        }
        vec2 vel = texture(uVel, vUv).xy;
        vec2 coord = vUv - uDt * vel * uTexel * 92.0;
        fragColor = texture(uSource, clamp(coord, 0.002, 0.998)) * uDissip;
      }
    `;

    const displayFrag = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uDye;
      uniform sampler2D uCurl;
      uniform sampler2D uObs;
      uniform int uAfterburner;
      void main() {
        vec3 base = vec3(0.0157, 0.0275, 0.0588); // #04070F obsidian
        vec3 dye = texture(uDye, vUv).rgb;
        float curl = abs(texture(uCurl, vUv).x);
        float obs = texture(uObs, vUv).r;
        vec3 vortGlow = uAfterburner == 1
          ? vec3(0.96, 0.58, 0.08) * clamp(curl * 0.85, 0.0, 0.55)
          : vec3(0.22, 0.76, 0.98) * clamp(curl * 0.70, 0.0, 0.48);
        vec3 col = base + dye * 0.92 + vortGlow;
        // Subtle outline shimmer right at obstacle boundary
        float edge = clamp(obs * (1.0 - obs) * 4.0, 0.0, 1.0);
        col += vec3(0.25, 0.80, 1.00) * edge * 0.35;
        fragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      return sh;
    }

    function createProgram(fs: string) {
      const prog = gl!.createProgram()!;
      gl!.attachShader(prog, compile(gl!.VERTEX_SHADER, baseVert));
      gl!.attachShader(prog, compile(gl!.FRAGMENT_SHADER, fs));
      gl!.linkProgram(prog);
      const posLoc = gl!.getAttribLocation(prog, "aPos");
      return { prog, posLoc };
    }

    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    function createFBO(w: number, h: number, filter: number) {
      const tex = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA16F, w, h, 0, gl!.RGBA, gl!.HALF_FLOAT, null);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
      gl!.clearColor(0, 0, 0, 1);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      return { tex, fbo };
    }

    function createDoubleFBO(w: number, h: number, filter: number) {
      let a = createFBO(w, h, filter);
      let b = createFBO(w, h, filter);
      return {
        get read() { return a; },
        get write() { return b; },
        swap() { const t = a; a = b; b = t; },
      };
    }

    const pSplat = createProgram(splatFrag);
    const pInflow = createProgram(inflowFrag);
    const pDyeIn = createProgram(dyeInflowFrag);
    const pCurl = createProgram(curlFrag);
    const pVort = createProgram(vorticityFrag);
    const pDiv = createProgram(divFrag);
    const pJac = createProgram(jacobiFrag);
    const pGrad = createProgram(gradSubFrag);
    const pAdv = createProgram(advectFrag);
    const pDisp = createProgram(displayFrag);

    const LINEAR = gl.LINEAR;
    let vel = createDoubleFBO(SIM_W, SIM_H, LINEAR);
    let dye = createDoubleFBO(SIM_W * 2, SIM_H * 2, LINEAR);
    let pressure = createDoubleFBO(SIM_W, SIM_H, gl.NEAREST);
    const curl = createFBO(SIM_W, SIM_H, LINEAR);
    const div = createFBO(SIM_W, SIM_H, gl.NEAREST);

    // Rasterize hero text + cutout portrait silhouette into obstacle texture!
    const obsTex = gl.createTexture()!;
    const obsCanvas = document.createElement("canvas");
    obsCanvas.width = SIM_W;
    obsCanvas.height = SIM_H;
    const obsCtx = obsCanvas.getContext("2d")!;

    let cutoutImg: HTMLImageElement | null = null;
    const imgLoader = new Image();
    imgLoader.src = "/media/profile/youssef-cutout.png";
    imgLoader.onload = () => {
      cutoutImg = imgLoader;
      rebuildObstacle();
    };

    function rebuildObstacle() {
      obsCtx.clearRect(0, 0, SIM_W, SIM_H);
      obsCtx.fillStyle = "#000000";
      obsCtx.fillRect(0, 0, SIM_W, SIM_H);
      obsCtx.fillStyle = "#ff0000";

      const cRect = canvas!.getBoundingClientRect();
      const scaleX = cRect.width > 0 ? SIM_W / cRect.width : 1;
      const scaleY = cRect.height > 0 ? SIM_H / cRect.height : 1;

      // Align obstacle mask tightly to the actual rendered DOM headline box
      const hEl = document.querySelector('[data-fluid-obstacle="headline"]');
      if (hEl && cRect.width > 0) {
        const hr = hEl.getBoundingClientRect();
        const rx = (hr.left - cRect.left) * scaleX;
        const ry = (hr.top - cRect.top) * scaleY;
        const rw = hr.width * scaleX;
        const rh = hr.height * scaleY;
        obsCtx.fillRect(rx + rw * 0.02, ry + rh * 0.12, rw * 0.92, rh * 0.78);
      }

      // Rasterize portrait cutout silhouette aligned to exact DOM image box
      const pEl = document.querySelector('[data-fluid-obstacle="portrait"]');
      if (cutoutImg && pEl && cRect.width > 0) {
        const pr = pEl.getBoundingClientRect();
        const sil = document.createElement("canvas");
        sil.width = SIM_W;
        sil.height = SIM_H;
        const sctx = sil.getContext("2d")!;
        const dx = (pr.left - cRect.left) * scaleX;
        const dy = (pr.top - cRect.top) * scaleY;
        const dw = pr.width * scaleX;
        const dh = pr.height * scaleY;
        sctx.drawImage(cutoutImg, dx, dy, dw, dh);
        sctx.globalCompositeOperation = "source-in";
        sctx.fillStyle = "#ff0000";
        sctx.fillRect(0, 0, SIM_W, SIM_H);
        obsCtx.drawImage(sil, 0, 0);
      }

      gl!.bindTexture(gl!.TEXTURE_2D, obsTex);
      gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, obsCanvas);
    }
    rebuildObstacle();
    window.addEventListener("resize", rebuildObstacle);
    document.fonts?.ready.then(rebuildObstacle);

    function blit(target: { fbo: WebGLFramebuffer } | null, w: number, h: number, programObj: { prog: WebGLProgram; posLoc: number }) {
      gl!.viewport(0, 0, w, h);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target ? target.fbo : null);
      gl!.useProgram(programObj.prog);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
      gl!.enableVertexAttribArray(programObj.posLoc);
      gl!.vertexAttribPointer(programObj.posLoc, 2, gl!.FLOAT, false, 0, 0);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function bindTex(prog: WebGLProgram, name: string, unit: number, tex: WebGLTexture) {
      gl!.activeTexture(gl!.TEXTURE0 + unit);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.uniform1i(gl!.getUniformLocation(prog, name), unit);
    }

    // Resize handling
    function syncSize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.max(320, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(240, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    // Cursor interaction
    const pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      pointer.dx = (nx - pointer.x) * 45;
      pointer.dy = (ny - pointer.y) * 45;
      pointer.x = nx;
      pointer.y = ny;
      pointer.moved = true;
      const spd = Math.min(2.4, Math.hypot(pointer.dx, pointer.dy) * 0.25 + propsRef.current.mach);
      propsRef.current.onCursorTelemetry?.(spd, nx * 100, (1 - ny) * 100);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    resetFnRef.current = () => {
      vel = createDoubleFBO(SIM_W, SIM_H, LINEAR);
      dye = createDoubleFBO(SIM_W * 2, SIM_H * 2, LINEAR);
      pressure = createDoubleFBO(SIM_W, SIM_H, gl.NEAREST);
    };

    let rafId = 0;
    const t0 = performance.now();

    function step(renderDisplay = true) {
      const now = (performance.now() - t0) * 0.001;
      const { mach: curMach, afterburner: ab, vortexMode: vMode } = propsRef.current;
      const dt = 0.016;
      const inflowSpeed = 1.2 + curMach * 1.65;
      const texel = [1 / SIM_W, 1 / SIM_H];

      // 1. Wind-tunnel inflow velocity & smoke rakes
      gl!.useProgram(pInflow.prog);
      bindTex(pInflow.prog, "uVel", 0, vel.read.tex);
      bindTex(pInflow.prog, "uObs", 1, obsTex);
      gl!.uniform1f(gl!.getUniformLocation(pInflow.prog, "uSpeed"), inflowSpeed);
      gl!.uniform1f(gl!.getUniformLocation(pInflow.prog, "uTime"), now);
      blit(vel.write, SIM_W, SIM_H, pInflow);
      vel.swap();

      gl!.useProgram(pDyeIn.prog);
      bindTex(pDyeIn.prog, "uDye", 0, dye.read.tex);
      bindTex(pDyeIn.prog, "uObs", 1, obsTex);
      gl!.uniform1f(gl!.getUniformLocation(pDyeIn.prog, "uTime"), now);
      gl!.uniform1i(gl!.getUniformLocation(pDyeIn.prog, "uAfterburner"), ab ? 1 : 0);
      blit(dye.write, SIM_W * 2, SIM_H * 2, pDyeIn);
      dye.swap();

      // 2. Cursor velocity & dye injection
      if (pointer.moved) {
        pointer.moved = false;
        const aspect = canvas!.width / Math.max(1, canvas!.height);
        gl!.useProgram(pSplat.prog);
        bindTex(pSplat.prog, "uTarget", 0, vel.read.tex);
        bindTex(pSplat.prog, "uObs", 1, obsTex);
        gl!.uniform2f(gl!.getUniformLocation(pSplat.prog, "uPoint"), pointer.x, pointer.y);
        gl!.uniform3f(gl!.getUniformLocation(pSplat.prog, "uValue"), pointer.dx, pointer.dy, 0);
        gl!.uniform1f(gl!.getUniformLocation(pSplat.prog, "uRadius"), vMode ? 0.006 : 0.003);
        gl!.uniform1f(gl!.getUniformLocation(pSplat.prog, "uAspect"), aspect);
        blit(vel.write, SIM_W, SIM_H, pSplat);
        vel.swap();

        bindTex(pSplat.prog, "uTarget", 0, dye.read.tex);
        const col = ab || vMode ? [0.96, 0.62, 0.12] : [0.22, 0.78, 0.99];
        gl!.uniform3f(gl!.getUniformLocation(pSplat.prog, "uValue"), col[0] * 0.7, col[1] * 0.7, col[2] * 0.7);
        gl!.uniform1f(gl!.getUniformLocation(pSplat.prog, "uRadius"), vMode ? 0.009 : 0.0045);
        blit(dye.write, SIM_W * 2, SIM_H * 2, pSplat);
        dye.swap();
      }

      // 3. Curl & Vorticity confinement
      gl!.useProgram(pCurl.prog);
      bindTex(pCurl.prog, "uVel", 0, vel.read.tex);
      gl!.uniform2f(gl!.getUniformLocation(pCurl.prog, "uTexel"), texel[0], texel[1]);
      blit(curl, SIM_W, SIM_H, pCurl);

      gl!.useProgram(pVort.prog);
      bindTex(pVort.prog, "uVel", 0, vel.read.tex);
      bindTex(pVort.prog, "uCurl", 1, curl.tex);
      bindTex(pVort.prog, "uObs", 2, obsTex);
      gl!.uniform2f(gl!.getUniformLocation(pVort.prog, "uTexel"), texel[0], texel[1]);
      gl!.uniform1f(gl!.getUniformLocation(pVort.prog, "uStrength"), vMode ? 28.0 : 18.0);
      gl!.uniform1f(gl!.getUniformLocation(pVort.prog, "uDt"), dt);
      blit(vel.write, SIM_W, SIM_H, pVort);
      vel.swap();

      // 4. Divergence & Jacobi Pressure-Poisson projection (18 iters)
      gl!.useProgram(pDiv.prog);
      bindTex(pDiv.prog, "uVel", 0, vel.read.tex);
      bindTex(pDiv.prog, "uObs", 1, obsTex);
      gl!.uniform2f(gl!.getUniformLocation(pDiv.prog, "uTexel"), texel[0], texel[1]);
      blit(div, SIM_W, SIM_H, pDiv);

      gl!.useProgram(pJac.prog);
      bindTex(pJac.prog, "uDiv", 1, div.tex);
      bindTex(pJac.prog, "uObs", 2, obsTex);
      gl!.uniform2f(gl!.getUniformLocation(pJac.prog, "uTexel"), texel[0], texel[1]);
      for (let i = 0; i < 10; i++) {
        bindTex(pJac.prog, "uPressure", 0, pressure.read.tex);
        blit(pressure.write, SIM_W, SIM_H, pJac);
        pressure.swap();
      }

      // 5. Gradient subtraction
      gl!.useProgram(pGrad.prog);
      bindTex(pGrad.prog, "uPressure", 0, pressure.read.tex);
      bindTex(pGrad.prog, "uVel", 1, vel.read.tex);
      bindTex(pGrad.prog, "uObs", 2, obsTex);
      gl!.uniform2f(gl!.getUniformLocation(pGrad.prog, "uTexel"), texel[0], texel[1]);
      blit(vel.write, SIM_W, SIM_H, pGrad);
      vel.swap();

      // 6. Semi-Lagrangian Advection (Velocity + Dye)
      gl!.useProgram(pAdv.prog);
      bindTex(pAdv.prog, "uVel", 0, vel.read.tex);
      bindTex(pAdv.prog, "uSource", 1, vel.read.tex);
      bindTex(pAdv.prog, "uObs", 2, obsTex);
      gl!.uniform2f(gl!.getUniformLocation(pAdv.prog, "uTexel"), texel[0], texel[1]);
      gl!.uniform1f(gl!.getUniformLocation(pAdv.prog, "uDt"), dt);
      gl!.uniform1f(gl!.getUniformLocation(pAdv.prog, "uDissip"), 0.996);
      blit(vel.write, SIM_W, SIM_H, pAdv);
      vel.swap();

      bindTex(pAdv.prog, "uVel", 0, vel.read.tex);
      bindTex(pAdv.prog, "uSource", 1, dye.read.tex);
      bindTex(pAdv.prog, "uObs", 2, obsTex);
      gl!.uniform1f(gl!.getUniformLocation(pAdv.prog, "uDissip"), 0.9972);
      blit(dye.write, SIM_W * 2, SIM_H * 2, pAdv);
      dye.swap();

      // 7. Display composite to screen
      if (renderDisplay) {
        gl!.useProgram(pDisp.prog);
        bindTex(pDisp.prog, "uDye", 0, dye.read.tex);
        bindTex(pDisp.prog, "uCurl", 1, curl.tex);
        bindTex(pDisp.prog, "uObs", 2, obsTex);
        gl!.uniform1i(gl!.getUniformLocation(pDisp.prog, "uAfterburner"), ab ? 1 : 0);
        blit(null, canvas!.width, canvas!.height, pDisp);
      }
    }

    // Pre-warm 32 frames so initial paint stays instant while flow already wraps headline & portrait
    for (let w = 0; w < 32; w++) {
      step(false);
    }

    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !rafId) {
          rafId = requestAnimationFrame(loop);
        }
      },
      { rootMargin: "150px 0px" }
    );
    io.observe(canvas);

    const loop = () => {
      if (!inView) {
        rafId = 0;
        return;
      }
      step(true);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", rebuildObstacle);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full block"
      aria-hidden="true"
    />
  );
}

// Graceful Canvas2D streamline fallback for reduced-motion / software WebGL devices
function initFallback2D(
  canvas: HTMLCanvasElement,
  propsRef: React.MutableRefObject<{ mach: number; afterburner: boolean; vortexMode: boolean; onCursorTelemetry?: (s: number, x: number, y: number) => void }>,
  reduced: boolean
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const resize = () => {
    canvas.width = canvas.clientWidth || 1280;
    canvas.height = canvas.clientHeight || 720;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  let raf = 0;
  let t = 0;
  const draw = () => {
    t += reduced ? 0.003 : 0.025 * (0.6 + propsRef.current.mach);
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#04070f";
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 1.4;
    const lines = 22;
    for (let i = 0; i < lines; i++) {
      const y0 = ((i + 0.5) / lines) * h;
      ctx.strokeStyle = propsRef.current.afterburner
        ? "rgba(245, 158, 11, 0.28)"
        : "rgba(56, 189, 248, 0.25)";
      ctx.beginPath();
      for (let x = 0; x <= w; x += 28) {
        const dx = (x / w - 0.66);
        const dy = (y0 / h - 0.5);
        const dist = Math.hypot(dx, dy);
        const deflect = Math.exp(-dist * dist * 18) * Math.sin(t + i * 0.6) * 26;
        const y = y0 + deflect + Math.sin(x * 0.012 - t * 2 + i) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    if (!reduced) raf = requestAnimationFrame(draw);
  };
  draw();
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
  };
}
