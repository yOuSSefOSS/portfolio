"use client";

import React from "react";
import { useFlightAltitude } from "@/lib/useFlightAltitude";

export default function AltitudeRail({ rtl = false }: { rtl?: boolean }) {
  const { progress, altitudeLabel, phaseLabel } = useFlightAltitude();

  return (
    <aside
      aria-hidden="true"
      className={`pointer-events-none fixed top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex ${
        rtl ? "left-4 items-start" : "right-4 items-end"
      }`}
    >
      <div className="font-mono-hud text-[10px] tracking-widest text-[#38bdf8]">{phaseLabel}</div>
      <div className="relative h-56 w-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute bottom-0 w-full origin-bottom rounded-full bg-gradient-to-t from-[#38bdf8] via-[#7dd3fc] to-[#f59e0b]"
          style={{ height: "100%", transform: `scaleY(${Math.max(0.04, Math.min(1, progress))})` }}
        />
      </div>
      <div className="font-mono-hud text-[11px] font-bold text-[#edf2fa]">{altitudeLabel}</div>
    </aside>
  );
}
