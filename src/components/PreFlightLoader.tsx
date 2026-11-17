"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface PreFlightLoaderProps {
  onComplete: () => void;
}

const SESSION_KEY = "yh_boot_v2";
const COUNT_MS = 750;
const DOOR_MS = 600;

/**
 * "Hangar Doors" intro: ~1.3s total, skippable with any key / click / scroll,
 * and shown only once per browser session.
 * The name rises in, a horizon line draws across, altitude counts to 35,000 ft,
 * then the screen splits open on the live hero.
 */
export default function PreFlightLoader({ onComplete }: PreFlightLoaderProps) {
  const [open, setOpen] = useState(false);
  const altRef = useRef<HTMLSpanElement | null>(null);
  const finishedRef = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  // Repeat visit in the same session: skip before first paint
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        finishedRef.current = true;
        completeRef.current();
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (finishedRef.current) return;

    let raf = 0;
    let doorTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      cancelAnimationFrame(raf);
      if (altRef.current) altRef.current.textContent = "35,000";
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
      setOpen(true);
      doorTimer = setTimeout(() => completeRef.current(), DOOR_MS);
    };

    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / COUNT_MS);
      const e = 1 - Math.pow(1 - p, 3);
      if (altRef.current) {
        altRef.current.textContent = Math.round(e * 35000).toLocaleString("en-US");
      }
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (doorTimer) clearTimeout(doorTimer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[90]" role="presentation" aria-hidden={open}>
      {/* TOP DOOR */}
      <div
        className="yh-door absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-[#04070f]"
        style={{ transform: open ? "translateY(-100%)" : "translateY(0)" }}
      >
        <div className="hud-grid-bg absolute inset-0 opacity-40" />
        <span className="absolute left-6 top-6 h-5 w-5 border-l border-t border-[#38bdf8]/50" />
        <span className="absolute right-6 top-6 h-5 w-5 border-r border-t border-[#38bdf8]/50" />
        <div className="font-mono-hud absolute left-12 top-6 text-[10px] tracking-[0.3em] text-[#8a99b5]/70">
          YH // SYS-00
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-6">
          <div
            className="yh-fade font-mono-hud text-[10px] tracking-[0.35em] text-[#38bdf8]"
            style={{ animationDelay: "40ms" }}
          >
            CLEARED FOR TAKEOFF · RWY 01
          </div>
          <div className="font-display mt-3 flex flex-wrap justify-center gap-x-[0.28em] text-4xl font-extrabold leading-none tracking-tight text-[#edf2fa] sm:text-6xl lg:text-7xl">
            <span className="yh-mask">
              <span className="yh-rise" style={{ animationDelay: "60ms" }}>
                YOUSSEF
              </span>
            </span>
            <span className="yh-mask">
              <span className="yh-rise text-[#38bdf8]" style={{ animationDelay: "140ms" }}>
                HEGAZY
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* HORIZON SEAM */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-1/2 transition-opacity duration-200"
        style={{ opacity: open ? 0 : 1 }}
      >
        <div className="yh-line h-full w-full bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />
        <span className="yh-glide absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#f59e0b] shadow-[0_0_14px_#f59e0b]" />
      </div>

      {/* BOTTOM DOOR */}
      <div
        className="yh-door absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-[#04070f]"
        style={{ transform: open ? "translateY(100%)" : "translateY(0)" }}
      >
        <div className="hud-grid-bg absolute inset-0 opacity-40" />
        <span className="absolute bottom-6 left-6 h-5 w-5 border-b border-l border-[#38bdf8]/50" />
        <span className="absolute bottom-6 right-6 h-5 w-5 border-b border-r border-[#38bdf8]/50" />

        <div className="absolute inset-x-0 top-0 flex justify-center px-6 pt-5">
          <div
            className="yh-fade font-mono-hud flex w-full max-w-xl items-center justify-between gap-4 text-[11px] text-[#8a99b5]"
            style={{ animationDelay: "180ms" }}
          >
            <span className="hidden sm:inline">AVIATION IS · REAL-TIME CFD · ROBOTICS</span>
            <span className="sm:hidden">V1 · ROTATE</span>
            <span className="text-[#edf2fa]">
              ALT <span ref={altRef}>0</span> FT
            </span>
          </div>
        </div>

        <div className="font-mono-hud absolute inset-x-0 bottom-7 text-center text-[10px] tracking-[0.25em] text-[#8a99b5]/60">
          PRESS ANY KEY TO SKIP
        </div>
      </div>
    </div>
  );
}
