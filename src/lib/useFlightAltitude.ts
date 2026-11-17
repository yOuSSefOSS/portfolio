"use client";

import { useEffect, useState } from "react";

export function getAltitudeMeta(p: number) {
  if (p < 0.16) return { alt: "0 FT", phase: "01 // TAKEOFF" };
  if (p < 0.34)
    return {
      alt: `${Math.round((p - 0.16) * 105000).toLocaleString("en-US")} FT`,
      phase: "02 // CLIMB",
    };
  if (p < 0.62) return { alt: "35,000 FT", phase: "03 // CRUISE" };
  if (p < 0.8) return { alt: "65,000 FT", phase: "04 // RESTRICTED" };
  if (p < 0.92) return { alt: "400 KM LEO", phase: "05 // ORBIT" };
  return { alt: "RUNWAY 01", phase: "06 // LANDING" };
}

/**
 * rAF-throttled scroll progress. Only the components that call this hook
 * re-render on scroll (not the whole page).
 */
export function useFlightAltitude() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const read = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const v = Math.round((window.scrollY / max) * 250) / 250;
      if (v !== last) {
        last = v;
        setProgress(v);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const meta = getAltitudeMeta(progress);
  return { progress, altitudeLabel: meta.alt, phaseLabel: meta.phase };
}
