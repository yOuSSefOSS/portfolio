"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ScrubCallout {
  at: number; // 0..1 progress threshold
  label: string;
  sub: string;
}

interface ScrollScrubCanvasProps {
  folder: string; // e.g. "/media/scrub/f16"
  frameCount: number; // e.g. 72
  title: string;
  description: string;
  accent?: "cyan" | "amber";
  callouts?: ScrubCallout[];
}

/**
 * Apple-grade scroll-scrubbed ImageBitmap sequence canvas.
 * Preloads crisp WebP frames and binds scroll progress (0..1) via GSAP ScrollTrigger,
 * plus allows manual interactive scrubbing with the tactical HUD slider.
 */
export default function ScrollScrubCanvas({
  folder,
  frameCount,
  title,
  description,
  accent = "cyan",
  callouts = [],
}: ScrollScrubCanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentIdxRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const startedPreloadRef = useRef(false);

  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pick exact frame or nearest already-loaded frame so scrubbing never flickers
    let img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let off = 1; off < frameCount; off++) {
        const lo = imagesRef.current[Math.max(0, idx - off)];
        if (lo && lo.complete && lo.naturalWidth > 0) {
          img = lo;
          break;
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    ctx.fillStyle = "#04070f";
    ctx.fillRect(0, 0, cw, ch);

    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  };

  // Load frame 0 immediately; lazy-preload remaining frames only when user scrolls near
  useEffect(() => {
    imagesRef.current = new Array(frameCount).fill(null);
    startedPreloadRef.current = false;
    let mounted = true;
    let count = 0;

    const loadIdx = (i: number) => {
      if (imagesRef.current[i - 1]) return;
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = `${folder}/f_${num}.webp`;
      img.onload = () => {
        if (!mounted) return;
        count++;
        if (count === 1 || count === frameCount || count % 8 === 0) {
          setLoadedCount(count);
        }
        if (i === 1) drawFrame(0);
      };
      imagesRef.current[i - 1] = img;
    };

    loadIdx(1);

    const el = wrapRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedPreloadRef.current) {
          startedPreloadRef.current = true;
          for (let i = 2; i <= frameCount; i++) {
            loadIdx(i);
          }
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" }
    );
    if (el) io.observe(el);

    return () => {
      mounted = false;
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, frameCount]);

  // GSAP ScrollTrigger scrubbing (only updates React state when integer % changes)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let lastPct = -1;
    const ctx = gsap.context(() => {
      const state = { frame: 0 };
      gsap.to(state, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 35%",
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            const pct = Math.round(p * 100);
            if (pct !== lastPct) {
              lastPct = pct;
              setProgress(p);
            }
            const idx = Math.min(frameCount - 1, Math.max(0, Math.round(p * (frameCount - 1))));
            if (idx !== currentIdxRef.current) {
              currentIdxRef.current = idx;
              drawFrame(idx);
            }
          },
        },
      });
    }, wrapRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  const handleManualScrub = (val: number) => {
    setProgress(val);
    const idx = Math.min(frameCount - 1, Math.max(0, Math.round(val * (frameCount - 1))));
    currentIdxRef.current = idx;
    drawFrame(idx);
  };

  const accentHex = accent === "amber" ? "#f59e0b" : "#38bdf8";

  return (
    <div ref={wrapRef} className="relative rounded-2xl border border-[#38bdf8]/15 bg-[#04070f] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-hud text-xs tracking-widest" style={{ color: accentHex }}>
            {title}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-[#8a99b5]">{description}</p>
        </div>
        <div className="font-mono-hud flex items-center gap-3 text-xs text-[#8a99b5]">
          <span>
            CACHE {Math.round((loadedCount / frameCount) * 100)}%
          </span>
          <span
            className="rounded-full border px-2.5 py-0.5 font-semibold"
            style={{ borderColor: `${accentHex}55`, color: accentHex }}
          >
            DISASSEMBLY {Math.round(progress * 100)}%
          </span>
        </div>
      </div>

      {/* Borderless Canvas Stage */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#04070f]">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="video-edge-mask h-full w-full object-contain"
        />

        {/* Synced Callout Pills */}
        {callouts.length > 0 && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
            {callouts.map((c) => {
              const active = progress >= c.at;
              return (
                <div
                  key={c.label}
                  className={`hud-glass rounded-lg px-3 py-1.5 transition-all duration-300 ${
                    active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-25"
                  }`}
                >
                  <div className="font-mono-hud text-[10px] font-bold" style={{ color: accentHex }}>
                    {c.label}
                  </div>
                  <div className="text-[11px] text-[#edf2fa]">{c.sub}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Precision Manual Scrubber Bar */}
      <div className="mt-4 flex items-center gap-4">
        <span className="font-mono-hud text-[11px] text-[#8a99b5]">SCRUB</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={progress}
          onChange={(e) => handleManualScrub(Number(e.target.value))}
          aria-label={title}
          className="h-1.5 w-full cursor-pointer accent-[#38bdf8]"
        />
        <span className="font-mono-hud w-12 text-right text-xs text-[#edf2fa]">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}
