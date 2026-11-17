"use client";

import React, { useEffect, useRef, useState } from "react";
import { COPY, Locale } from "@/lib/i18n";
import { CFD_MODES } from "@/lib/portfolioData";
import { soundEngine } from "@/lib/soundEngine";
import ScrollScrubCanvas from "./ScrollScrubCanvas";
import InViewVideo from "./InViewVideo";
import { Lock, Play, X, Wind, Cpu, Layers } from "lucide-react";

export default function VortexCaseStudy({ locale }: { locale: Locale }) {
  const t = COPY[locale].vortex;
  const [cfdMode, setCfdMode] = useState<(typeof CFD_MODES)[number]["id"]>("smoke");
  const [theaterOpen, setTheaterOpen] = useState(false);
  const [cfdVisible, setCfdVisible] = useState(false);
  const cfdWrapRef = useRef<HTMLDivElement | null>(null);
  const cfdVideoRef = useRef<HTMLVideoElement | null>(null);
  const lastSyncTimeRef = useRef(0);

  useEffect(() => {
    const el = cfdWrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setCfdVisible(entry.isIntersecting);
        if (cfdVideoRef.current) {
          if (entry.isIntersecting) cfdVideoRef.current.play().catch(() => {});
          else cfdVideoRef.current.pause();
        }
      },
      { rootMargin: "250px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const activeCfd = CFD_MODES.find((m) => m.id === cfdMode) || CFD_MODES[0];

  const handleSwitchCfd = (nextId: (typeof CFD_MODES)[number]["id"]) => {
    if (nextId === cfdMode) return;
    soundEngine.playTick(1450);
    if (cfdVideoRef.current) {
      lastSyncTimeRef.current = cfdVideoRef.current.currentTime || 0;
    }
    setCfdMode(nextId);
  };

  return (
    <section
      id="vortex-gen"
      className="relative border-t border-[#f59e0b]/20 bg-[#04070f] px-4 py-28 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Stealth Dossier Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono-hud inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-3 py-1 text-[11px] font-bold tracking-widest text-[#f59e0b]">
              <Lock className="h-3 w-3" />
              {t.eyebrow}
            </div>
            <h2 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-[#edf2fa] sm:text-6xl">
              {t.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#8a99b5]">{t.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playAfterburner();
              setTheaterOpen(true);
            }}
            className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] px-5 py-3 text-xs font-bold tracking-wider text-[#04070f] shadow-lg shadow-[#38bdf8]/20 transition hover:brightness-110 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-current" />
            {t.theaterBtn}
          </button>
        </div>

        {/* Key Architecture Telemetry Strip (High-level, zero secrets/code) */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "SOLVER GRID", v: "220×110 MAC · 60 FPS", Icon: Wind },
            { k: "AI INFERENCE", v: "Neural Airfoil Surrogate", Icon: Cpu },
            { k: "3D ENGINE", v: "12-Part F-16 · 8-Stage Turbofan", Icon: Layers },
            { k: "STEALTH STATUS", v: "Solo Architecture · Private Build", Icon: Lock },
          ].map(({ k, v, Icon }) => (
            <div key={k} className="hud-glass rounded-xl p-4">
              <div className="font-mono-hud flex items-center justify-between text-[10px] tracking-widest text-[#8a99b5]">
                <span>{k}</span>
                <Icon className="h-3.5 w-3.5 text-[#38bdf8]" />
              </div>
              <div className="mt-1.5 text-sm font-bold text-[#edf2fa]">{v}</div>
            </div>
          ))}
        </div>

        {/* MODULE 1: Scroll-Scrubbed 12-Part F-16C Disassembly */}
        <div className="mt-14">
          <ScrollScrubCanvas
            folder="/media/scrub/f16"
            frameCount={72}
            title={t.scrubF16Title}
            description={t.scrubF16Desc}
            accent="cyan"
            callouts={[
              { at: 0.2, label: "F16-01", sub: "Sears-Haack Radome" },
              { at: 0.42, label: "F16-02", sub: "ACES II Bubble Canopy" },
              { at: 0.65, label: "F16-03", sub: "BWB Fuselage + LERX" },
              { at: 0.85, label: "F16-10", sub: "F110-GE-129 Iris Nozzle" },
            ]}
          />
        </div>

        {/* MODULE 2: Interactive Synced 5-Mode Navier-Stokes Wind Tunnel */}
        <div className="mt-12 rounded-2xl border border-[#38bdf8]/20 bg-[#04070f] p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono-hud text-xs tracking-widest text-[#38bdf8]">
                {t.cfdTitle}
              </div>
              <p className="mt-1 max-w-2xl text-sm text-[#8a99b5]">{t.cfdDesc}</p>
            </div>
            <div className="font-mono-hud rounded-lg border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-1 text-xs text-[#38bdf8]">
              {activeCfd.formula}
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
            {CFD_MODES.map((m) => {
              const active = m.id === cfdMode;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSwitchCfd(m.id)}
                  className={`font-mono-hud rounded-lg border px-3.5 py-2 text-[11px] font-semibold tracking-wider transition cursor-pointer ${
                    active
                      ? "border-[#38bdf8] bg-[#38bdf8] text-[#04070f]"
                      : "border-white/10 bg-white/[0.02] text-[#8a99b5] hover:border-white/25 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Borderless Synced CFD Video Stage */}
          <div ref={cfdWrapRef} className="relative mt-4 aspect-[2/1] w-full overflow-hidden rounded-xl bg-[#04070f]">
            <video
              ref={cfdVideoRef}
              key={activeCfd.src}
              src={cfdVisible ? activeCfd.src : undefined}
              autoPlay={cfdVisible}
              loop
              muted
              playsInline
              preload="none"
              onLoadedMetadata={() => {
                if (cfdVideoRef.current && lastSyncTimeRef.current > 0) {
                  const dur = cfdVideoRef.current.duration || 5;
                  cfdVideoRef.current.currentTime = lastSyncTimeRef.current % dur;
                }
              }}
              className="video-edge-mask h-full w-full object-cover"
            />
            <div className="hud-glass pointer-events-none absolute bottom-3 left-3 rounded-lg px-3 py-1.5 text-xs text-[#edf2fa]">
              {activeCfd.desc}
            </div>
          </div>
        </div>

        {/* MODULE 3: Scroll-Scrubbed 8-Stage Turbofan */}
        <div className="mt-12">
          <ScrollScrubCanvas
            folder="/media/scrub/turbofan"
            frameCount={75}
            title={t.scrubTfTitle}
            description={t.scrubTfDesc}
            accent="amber"
            callouts={[
              { at: 0.15, label: "SUCK", sub: "Clamshell Cowling & 22-Blade Fan" },
              { at: 0.42, label: "SQUEEZE", sub: "Concentric LP / HP Compressors" },
              { at: 0.68, label: "BANG", sub: "1,720 K Annular Combustor" },
              { at: 0.88, label: "BLOW", sub: "8-Stage Axial Separation" },
            ]}
          />
        </div>

        {/* MODULE 4: Dual Borderless Loop Cards (Afterburner + Polar Telemetry) */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#04070f] p-4">
            <div className="font-mono-hud mb-2 text-[11px] tracking-widest text-[#f59e0b]">
              MACH SHOCK DIAMONDS // LAUNCH FLIGHT
            </div>
            <InViewVideo
              src="/media/vortex/f16_afterburner_loop.mp4"
              className="video-edge-mask aspect-video w-full rounded-xl object-cover"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#04070f] p-4">
            <div className="font-mono-hud mb-2 text-[11px] tracking-widest text-[#38bdf8]">
              COCKPIT POLAR TELEMETRY // CL vs ALPHA
            </div>
            <InViewVideo
              src="/media/vortex/cockpit_hud_ui.mp4"
              className="aspect-video w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>

      {/* Cinema Edit Fullscreen Theater Modal */}
      {theaterOpen && (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setTheaterOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-[#38bdf8]/35 bg-[#04070f] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="font-mono-hud text-xs font-bold tracking-widest text-[#38bdf8]">
                VORTEX-GEN // 26S DIRECTOR&apos;S CUT (60 FPS)
              </span>
              <button
                type="button"
                onClick={() => setTheaterOpen(false)}
                className="rounded-lg p-1 text-[#8a99b5] hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <video
              src="/media/vortex/vortex_cinema_edit.mp4"
              controls
              autoPlay
              playsInline
              className="aspect-video w-full bg-black"
            />
          </div>
        </div>
      )}
    </section>
  );
}
