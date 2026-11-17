"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COPY, Locale } from "@/lib/i18n";
import { soundEngine } from "@/lib/soundEngine";

import PreFlightLoader from "@/components/PreFlightLoader";
import TopCockpitNav from "@/components/TopCockpitNav";
import AltitudeRail from "@/components/AltitudeRail";
import FluidHeroCanvas from "@/components/FluidHeroCanvas";
import ClimbSection from "@/components/ClimbSection";
import DepartureBoard from "@/components/DepartureBoard";
import VortexCaseStudy from "@/components/VortexCaseStudy";
import OrbitSection from "@/components/OrbitSection";
import ArchiveAndContact from "@/components/ArchiveAndContact";
import EasterEggsLayer from "@/components/EasterEggsLayer";
import { RotateCcw, ArrowDown, Terminal } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [booted, setBooted] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [mach, setMach] = useState(0.85);
  const [resetSignal, setResetSignal] = useState(0);
  const cursorSpdRef = useRef<HTMLSpanElement | null>(null);

  const [terminalOpen, setTerminalOpen] = useState(false);
  const [vortexMode, setVortexMode] = useState(false);
  const [afterburner, setAfterburner] = useState(false);

  const t = COPY[locale];

  // Sync HTML lang/dir when toggling EN <-> AR
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  // Lenis smooth scroll + ScrollTrigger integration
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  const handleToggleAudio = () => {
    const next = soundEngine.toggle();
    setAudioOn(next);
  };

  return (
    <main className="relative min-h-screen bg-[#04070f]">
      {!booted && <PreFlightLoader onComplete={() => setBooted(true)} />}

      <TopCockpitNav
        locale={locale}
        onToggleLocale={() => setLocale((l) => (l === "en" ? "ar" : "en"))}
        audioOn={audioOn}
        onToggleAudio={handleToggleAudio}
        onOpenTerminal={() => setTerminalOpen(true)}
      />

      <AltitudeRail rtl={locale === "ar"} />

      {/* ================================================================= */}
      {/* PHASE 01 // TAKEOFF — REAL-TIME GPU FLUID WIND-TUNNEL HERO        */}
      {/* ================================================================= */}
      <section
        id="takeoff"
        className="relative flex min-h-screen items-center overflow-hidden pt-20 pb-12"
      >
        {/* Live WebGL2 Navier-Stokes Canvas */}
        <div className="absolute inset-0 z-0">
          <FluidHeroCanvas
            mach={mach}
            afterburner={afterburner}
            vortexMode={vortexMode}
            resetSignal={resetSignal}
            onCursorTelemetry={(speed) => {
              if (cursorSpdRef.current) {
                cursorSpdRef.current.textContent = `${speed.toFixed(2)}M`;
              }
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#04070f]/45 via-transparent to-[#04070f]" />
        </div>

        {/* Hero Typography + Cutout Portrait Layered Inside Airflow */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-8 xl:pe-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="font-mono-hud inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/35 bg-[#04070f]/70 px-3 py-1 text-[11px] font-semibold tracking-widest text-[#38bdf8] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
              {t.hero.eyebrow}
            </div>

            <h1
              data-fluid-obstacle="headline"
              className="font-display mt-5 text-[2.5rem] font-extrabold leading-[0.94] tracking-tight text-[#edf2fa] sm:text-7xl lg:text-8xl"
            >
              <span className="block">{t.hero.firstName}</span>
              <span className="block bg-gradient-to-r from-[#edf2fa] via-[#7dd3fc] to-[#38bdf8] bg-clip-text text-transparent">
                {t.hero.lastName}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#cbd5e1] sm:text-lg">
              {t.hero.subtitle}
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(1280);
                  document.querySelector("#vortex-gen")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#38bdf8] px-5 py-3 text-xs font-bold tracking-wider text-[#04070f] shadow-lg shadow-[#38bdf8]/20 transition hover:bg-[#7dd3fc] cursor-pointer"
              >
                {t.hero.ctaPrimary}
                <ArrowDown className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(1400);
                  setTerminalOpen(true);
                }}
                className="hud-glass inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-[#edf2fa] transition hover:border-[#38bdf8]/60 cursor-pointer"
              >
                <Terminal className="h-4 w-4 text-[#38bdf8]" />
                {t.hero.ctaSecondary}
              </button>
            </div>

            {/* Interactive Wind-Tunnel Control Bar */}
            <div className="hud-glass mt-8 inline-flex flex-wrap items-center gap-3 rounded-2xl px-4 py-2.5">
              <span className="font-mono-hud text-[10px] tracking-widest text-[#8a99b5]">
                {t.hero.machLabel}
              </span>
              {[
                { label: "0.3M", val: 0.3 },
                { label: "0.85M", val: 0.85 },
                { label: "1.8M", val: 1.8 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    soundEngine.playTick(1100 + preset.val * 200);
                    setMach(preset.val);
                  }}
                  className={`font-mono-hud rounded-md px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    mach === preset.val
                      ? "bg-[#38bdf8] text-[#04070f]"
                      : "text-[#8a99b5] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playFlap();
                  setResetSignal((n) => n + 1);
                }}
                className="font-mono-hud inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1 text-[10px] text-[#8a99b5] transition hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                {t.hero.resetWake}
              </button>
            </div>
            <div className="font-mono-hud mt-2 text-[11px] text-[#8a99b5]">
              {t.hero.hint} · V_LOCAL <span ref={cursorSpdRef}>0.85M</span>
            </div>
          </div>

          {/* Right Column: Cutout Portrait Standing Inside Live Flow */}
          <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-72 sm:w-80 lg:w-96">
              <div className="pointer-events-none absolute -inset-6 rounded-full bg-radial from-[#38bdf8]/15 via-transparent to-transparent blur-2xl" />
              <img
                data-fluid-obstacle="portrait"
                src="/media/profile/youssef-cutout.png"
                alt="Youssef Hegazy"
                className="relative z-10 w-full select-none object-contain drop-shadow-[0_24px_48px_rgba(4,7,15,0.9)]"
              />
              {/* Bottom gradient dissolve */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-[#04070f] to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <ClimbSection locale={locale} />
      <DepartureBoard locale={locale} />
      <VortexCaseStudy locale={locale} />
      <OrbitSection locale={locale} />
      <ArchiveAndContact locale={locale} />

      <EasterEggsLayer
        terminalOpen={terminalOpen}
        setTerminalOpen={setTerminalOpen}
        vortexMode={vortexMode}
        setVortexMode={setVortexMode}
        afterburner={afterburner}
        setAfterburner={setAfterburner}
      />
    </main>
  );
}
