"use client";

import React, { useEffect, useRef } from "react";
import { COPY, Locale } from "@/lib/i18n";

const CAPABILITIES = [
  {
    group: "01 // PHYSICS, CFD & 3D GRAPHICS",
    items: [
      "Three.js & React Three Fiber",
      "WebGL2 & Custom GLSL Shaders",
      "Eulerian Navier-Stokes CFD",
      "Prandtl Lifting-Line & ISA Models",
      "GSAP ScrollTrigger & Canvas2D",
    ],
  },
  {
    group: "02 // FULL-STACK SYSTEMS",
    items: [
      "Next.js 15 & React 19 (TS)",
      "Node.js & Express APIs",
      "Tailwind CSS v4 & Design Systems",
      "Offline-First PWAs & IndexedDB",
      "Firebase RTDB / Firestore & Supabase",
    ],
  },
  {
    group: "03 // REMOTE SENSING, ML & IOT",
    items: [
      "EgSA Satellite Remote Sensing",
      "NTI Machine Learning Pipelines",
      "PyTorch Neural Surrogate Inference",
      "Robotics Telemetry & EV Digital Twins",
      "STL Geometry & PDF Eng Reporting",
    ],
  },
];

export default function OrbitSection({ locale }: { locale: Locale }) {
  const t = COPY[locale].orbit;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Procedural starfield + glowing Earth orbital atmospheric limb
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth || 1200;
      canvas.height = canvas.clientHeight || 520;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const stars = Array.from({ length: 110 }, (_, i) => ({
      x: ((i * 73) % 1000) / 1000,
      y: ((i * 293) % 1000) / 1000,
      r: (i % 3) * 0.6 + 0.5,
      a: 0.25 + (i % 5) * 0.14,
    }));

    let raf = 0;
    let t0 = 0;
    let inView = false;
    const draw = () => {
      if (!inView) {
        raf = 0;
        return;
      }
      t0 += 0.008;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#03060c";
      ctx.fillRect(0, 0, w, h);

      // Twinkling stars
      for (const s of stars) {
        const alpha = s.a * (0.7 + 0.3 * Math.sin(t0 * 2 + s.x * 20));
        ctx.fillStyle = `rgba(237, 242, 250, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h * 0.72, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Curved Earth atmospheric limb
      const radius = Math.max(w * 1.15, 1100);
      const cx = w * 0.5;
      const cy = h + radius * 0.86;

      const grad = ctx.createRadialGradient(cx, cy, radius * 0.96, cx, cy, radius * 1.04);
      grad.addColorStop(0, "rgba(10, 28, 62, 0.98)");
      grad.addColorStop(0.55, "rgba(56, 189, 248, 0.42)");
      grad.addColorStop(0.8, "rgba(56, 189, 248, 0.08)");
      grad.addColorStop(1, "rgba(4, 7, 15, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.04, Math.PI, 0);
      ctx.fill();

      // Subtle satellite orbital pass dot
      const ang = -Math.PI * 0.68 + ((t0 * 0.12) % 0.36);
      const sx = cx + Math.cos(ang) * (radius * 1.025);
      const sy = cy + Math.sin(ang) * (radius * 1.025);
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !raf) {
          raf = requestAnimationFrame(draw);
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <section
      id="orbit"
      className="relative overflow-hidden border-t border-white/5 bg-[#03060c] px-4 py-28 sm:px-8"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="font-mono-hud text-xs tracking-widest text-[#38bdf8]">{t.eyebrow}</div>
        <h2 className="font-display mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#edf2fa] sm:text-5xl">
          {t.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-[#8a99b5]">{t.subtitle}</p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CAPABILITIES.map((col) => (
            <div key={col.group} className="hud-glass rounded-2xl p-6">
              <div className="font-mono-hud text-xs font-bold tracking-widest text-[#38bdf8]">
                {col.group}
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-[#edf2fa]">
                {col.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
