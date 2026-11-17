"use client";

import React, { useState } from "react";
import { COPY, Locale } from "@/lib/i18n";
import { QAMAR_SCREENS, ZNUTABLE_SCREENS } from "@/lib/portfolioData";
import { soundEngine } from "@/lib/soundEngine";
import { ArrowUpRight, ShieldAlert, Smartphone, Layers } from "lucide-react";

const DEPARTURE_ROWS = [
  {
    flight: "VG-01",
    name: "VORTEX-GEN",
    role: "Real-Time Browser CFD · F-16C & Turbofan 3D",
    status: "RESTRICTED CASE STUDY",
    statusColor: "text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10",
    targetId: "#vortex-gen",
    externalUrl: null,
  },
  {
    flight: "QM-02",
    name: "QAMAR LUXURY",
    role: "3D Lookbook · 3D Fabric View · 3D Visa Checkout",
    status: "LIVE · 11 SCREENS",
    statusColor: "text-[#38bdf8] border-[#38bdf8]/40 bg-[#38bdf8]/10",
    targetId: "#showcase-qamar",
    externalUrl: "https://qamar-store-main.vercel.app",
  },
  {
    flight: "ZN-03",
    name: "ZNUTABLE v4.0",
    role: "Offline-Capable Aviation Schedule PWA (Firebase)",
    status: "LIVE · 4 SCREENS",
    statusColor: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
    targetId: "#showcase-znutable",
    externalUrl: "https://znu-table.vercel.app",
  },
];

export default function DepartureBoard({ locale }: { locale: Locale }) {
  const t = COPY[locale].cruise;
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [qamarIdx, setQamarIdx] = useState(0);
  const [znuIdx, setZnuIdx] = useState(0);

  const activeQamar = QAMAR_SCREENS[qamarIdx];
  const activeZnu = ZNUTABLE_SCREENS[znuIdx];

  return (
    <section
      id="cruise"
      className="relative border-t border-white/5 bg-[#04070f] px-4 py-24 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="font-mono-hud text-xs tracking-widest text-[#38bdf8]">{t.eyebrow}</div>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#edf2fa] sm:text-5xl">
          {t.title}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[#8a99b5]">{t.subtitle}</p>

        {/* Split-Flap Aerospace Departure Board */}
        <div className="hud-glass mt-10 overflow-hidden rounded-2xl">
          <div className="font-mono-hud grid grid-cols-12 border-b border-white/10 bg-white/[0.02] px-5 py-3 text-[10px] tracking-widest text-[#8a99b5]">
            <span className="col-span-2">FLIGHT</span>
            <span className="col-span-4 sm:col-span-3">CRAFT</span>
            <span className="hidden sm:col-span-4 sm:inline">ARCHITECTURE</span>
            <span className="col-span-6 text-right sm:col-span-3">CLEARANCE</span>
          </div>

          <div className="divide-y divide-white/5">
            {DEPARTURE_ROWS.map((row) => {
              const isHover = hoveredRow === row.flight;
              return (
                <div
                  key={row.flight}
                  onMouseEnter={() => {
                    setHoveredRow(row.flight);
                    soundEngine.playFlap();
                  }}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => {
                    soundEngine.playTick(1280);
                    document.querySelector(row.targetId)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="grid cursor-pointer grid-cols-12 items-center px-5 py-5 transition hover:bg-[#38bdf8]/[0.05]"
                >
                  <div className="font-mono-hud col-span-2 text-xs font-bold text-[#38bdf8]">
                    <span className={isHover ? "animate-flap inline-block" : "inline-block"}>
                      {row.flight}
                    </span>
                  </div>
                  <div className="font-display col-span-4 text-lg font-bold tracking-tight text-[#edf2fa] sm:col-span-3 sm:text-xl">
                    {row.name}
                  </div>
                  <div className="hidden text-sm text-[#8a99b5] sm:col-span-4 sm:block">
                    {row.role}
                  </div>
                  <div className="col-span-6 flex items-center justify-end gap-2 sm:col-span-3">
                    <span
                      className={`font-mono-hud rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider ${row.statusColor}`}
                    >
                      {row.status}
                    </span>
                    {row.externalUrl ? (
                      <a
                        href={row.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg border border-white/10 p-1.5 text-[#edf2fa] transition hover:border-[#38bdf8] hover:text-[#38bdf8]"
                        title={t.viewLive}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="rounded-lg border border-[#f59e0b]/30 p-1.5 text-[#f59e0b]">
                        <ShieldAlert className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verified Showcase 02: QAMAR Interactive Multi-Screen Gallery */}
        <div
          id="showcase-qamar"
          className="mt-16 grid items-center gap-8 rounded-2xl border border-white/10 bg-[#070d1b] p-6 lg:grid-cols-12 lg:p-8"
        >
          <div className="lg:col-span-5">
            <div className="font-mono-hud flex items-center gap-2 text-xs tracking-widest text-[#f59e0b]">
              <Layers className="h-3.5 w-3.5" />
              FLIGHT QM-02 // E-COMMERCE & 3D INTERACTION
            </div>
            <h3 className="font-display mt-2 text-3xl font-bold text-[#edf2fa]">
              QAMAR — Cairo Luxury Streetwear
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#8a99b5]">
              Built with a spatial 3D drag lookbook carousel, interactive 3D fabric sheen viewer,
              and a real-time 3D Visa checkout card alongside dual dark/light editorial modes.
            </p>

            {/* Screen Switcher Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {QAMAR_SCREENS.map((scr, idx) => (
                <button
                  key={scr.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playTick(1200);
                    setQamarIdx(idx);
                  }}
                  className={`font-mono-hud rounded-lg border px-3 py-1.5 text-[11px] transition cursor-pointer ${
                    idx === qamarIdx
                      ? "border-[#f59e0b] bg-[#f59e0b]/15 text-[#f59e0b]"
                      : "border-white/10 text-[#8a99b5] hover:border-white/25 hover:text-white"
                  }`}
                >
                  {scr.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://qamar-store-main.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#edf2fa] px-4 py-2 text-xs font-bold text-[#04070f] transition hover:bg-[#38bdf8]"
              >
                {t.viewLive}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <span className="font-mono-hud text-xs text-[#8a99b5]">{activeQamar.note}</span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#04070f] shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="font-mono-hud ml-3 text-[10px] text-[#8a99b5]">
                  qamar-store-main.vercel.app — {activeQamar.label}
                </span>
              </div>
              <img
                src={activeQamar.src}
                alt={activeQamar.note}
                className="aspect-[16/9] w-full object-cover object-top transition duration-300"
              />
            </div>
          </div>
        </div>

        {/* Verified Showcase 03: ZNUTABLE v4.0 Interactive Mobile Rig */}
        <div
          id="showcase-znutable"
          className="mt-10 grid items-center gap-8 rounded-2xl border border-white/10 bg-[#070d1b] p-6 lg:grid-cols-12 lg:p-8"
        >
          <div className="order-2 flex justify-center lg:order-1 lg:col-span-5">
            <div className="relative w-64 rounded-[2.2rem] border-4 border-white/15 bg-[#04070f] p-2.5 shadow-2xl">
              <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-white/20" />
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                <img
                  src={activeZnu.src}
                  alt={activeZnu.caption}
                  className="aspect-[9/17] w-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="font-mono-hud flex items-center gap-2 text-xs tracking-widest text-emerald-400">
              <Smartphone className="h-3.5 w-3.5" />
              FLIGHT ZN-03 // OFFLINE AVIATION PWA · v4.0
            </div>
            <h3 className="font-display mt-2 text-3xl font-bold text-[#edf2fa]">
              znutable — Smart Aviation Lecture Hub
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#8a99b5]">
              Offline-capable Progressive Web App engineered for Zagazig National University
              Aviation Information Systems students — powered by Firebase Firestore with live
              countdowns, exam tracking, and shared peer resources.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {ZNUTABLE_SCREENS.map((scr, idx) => (
                <button
                  key={scr.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playTick(1350);
                    setZnuIdx(idx);
                  }}
                  className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                    idx === znuIdx
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="font-mono-hud text-[10px] font-bold text-emerald-400">
                    0{idx + 1}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[#edf2fa]">{scr.label}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://znu-table.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-[#04070f] transition hover:bg-emerald-300"
              >
                {t.viewLive}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <span className="font-mono-hud text-xs text-[#8a99b5]">{activeZnu.caption}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
