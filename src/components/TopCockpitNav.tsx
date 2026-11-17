"use client";

import React from "react";
import { COPY, Locale } from "@/lib/i18n";
import { soundEngine } from "@/lib/soundEngine";
import { useFlightAltitude } from "@/lib/useFlightAltitude";
import { Terminal, Volume2, VolumeX, Languages } from "lucide-react";

interface TopCockpitNavProps {
  locale: Locale;
  onToggleLocale: () => void;
  audioOn: boolean;
  onToggleAudio: () => void;
  onOpenTerminal: () => void;
}

export default function TopCockpitNav({
  locale,
  onToggleLocale,
  audioOn,
  onToggleAudio,
  onOpenTerminal,
}: TopCockpitNavProps) {
  const t = COPY[locale].nav;
  const { altitudeLabel } = useFlightAltitude();

  const links = [
    { href: "#takeoff", label: t.takeoff },
    { href: "#climb", label: t.climb },
    { href: "#cruise", label: t.cruise },
    { href: "#vortex-gen", label: t.vortex },
    { href: "#orbit", label: t.orbit },
    { href: "#contact", label: t.land },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    soundEngine.playTick(1180);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6">
      <div className="hud-glass mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5">
        {/* Callsign */}
        <a
          href="#takeoff"
          onClick={(e) => handleNavClick(e, "#takeoff")}
          className="flex items-center gap-2.5"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#38bdf8]/15 font-mono-hud text-xs font-bold text-[#38bdf8] border border-[#38bdf8]/40">
            YH
          </span>
          <span className="font-mono-hud hidden text-xs font-semibold tracking-wider text-[#edf2fa] sm:inline">
            ALT {altitudeLabel}
          </span>
        </a>

        {/* Section Flight Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="font-mono-hud rounded-lg px-2.5 py-1.5 text-[11px] text-[#8a99b5] transition hover:bg-white/5 hover:text-[#38bdf8]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTick(1400);
              onOpenTerminal();
            }}
            className="font-mono-hud inline-flex items-center gap-1.5 rounded-lg border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-2.5 py-1.5 text-[11px] text-[#38bdf8] transition hover:bg-[#38bdf8]/20 cursor-pointer"
            title="Mission Control Terminal"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.cmdHint}</span>
          </button>

          <button
            type="button"
            onClick={onToggleAudio}
            className={`font-mono-hud inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition cursor-pointer ${
              audioOn
                ? "border-[#f59e0b]/45 bg-[#f59e0b]/15 text-[#f59e0b]"
                : "border-white/10 text-[#8a99b5] hover:text-white"
            }`}
            aria-label="Toggle cockpit audio"
          >
            {audioOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{audioOn ? t.audioOn : t.audioOff}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playTick(980);
              onToggleLocale();
            }}
            className="font-mono-hud inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-[11px] text-[#edf2fa] transition hover:border-[#38bdf8]/50 cursor-pointer"
            aria-label="Switch language"
          >
            <Languages className="h-3.5 w-3.5 text-[#38bdf8]" />
            <span>{locale === "en" ? "AR" : "EN"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
