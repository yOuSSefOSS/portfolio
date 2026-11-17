"use client";

import React, { useEffect, useRef } from "react";

interface InViewVideoProps {
  src: string;
  className?: string;
}

/** Muted loop that only downloads/decodes while near the viewport. */
export default function InViewVideo({ src, className }: InViewVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.getAttribute("src")) v.setAttribute("src", src);
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return <video ref={ref} muted loop playsInline preload="none" className={className} />;
}
