"use client";

import React, { useState } from "react";
import { COPY, Locale } from "@/lib/i18n";
import { FIELD_EVIDENCE_PHOTOS } from "@/lib/portfolioData";
import { Trophy, Award, Users, Satellite, X, ZoomIn } from "lucide-react";
import { soundEngine } from "@/lib/soundEngine";

export default function ClimbSection({ locale }: { locale: Locale }) {
  const t = COPY[locale].climb;
  const [lightboxSrc, setLightboxSrc] = useState<{ src: string; caption: string } | null>(null);

  const icons = [Trophy, Award, Users, Satellite];

  return (
    <section
      id="climb"
      className="relative border-t border-white/5 bg-gradient-to-b from-[#04070f] via-[#071124] to-[#060c1a] px-4 py-24 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="font-mono-hud text-xs tracking-widest text-[#38bdf8]">{t.eyebrow}</div>
        <h2 className="font-display mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#edf2fa] sm:text-5xl">
          {t.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-[#8a99b5]">{t.subtitle}</p>

        {/* Verified Podium & Telemetry Stats */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            const isGold = idx < 2;
            return (
              <div
                key={item.k}
                className="hud-glass group rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-[#38bdf8]/40"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono-hud text-xs font-bold tracking-wider ${
                      isGold ? "text-[#f59e0b]" : "text-[#38bdf8]"
                    }`}
                  >
                    {item.k}
                  </span>
                  <Icon
                    className={`h-4 w-4 ${isGold ? "text-[#f59e0b]" : "text-[#38bdf8]"}`}
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#edf2fa]">{item.v}</p>
              </div>
            );
          })}
        </div>

        {/* Field Evidence Photo Deck */}
        <div className="mt-16">
          <div className="font-mono-hud mb-5 flex items-center justify-between text-xs tracking-widest text-[#8a99b5]">
            <span>{t.photosTitle} // VERIFIED PHOTO LOG</span>
            <span>CLICK ANY FRAME TO INSPECT</span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FIELD_EVIDENCE_PHOTOS.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => {
                  soundEngine.playTick(1300);
                  setLightboxSrc({ src: photo.src, caption: photo.caption });
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#091020] text-left transition duration-300 hover:-translate-y-1 hover:border-[#38bdf8]/50 cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04070f] via-transparent to-transparent opacity-80" />
                  <div className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-mono-hud text-[10px] font-bold tracking-wider text-[#f59e0b]">
                    {photo.badge}
                  </div>
                  <div className="mt-1 text-sm font-medium text-[#edf2fa]">{photo.caption}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setLightboxSrc(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#091020] p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black cursor-pointer"
              aria-label="Close photo"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={lightboxSrc.src}
              alt={lightboxSrc.caption}
              className="max-h-[78vh] w-auto rounded-xl object-contain"
            />
            <div className="font-mono-hud px-3 py-2 text-xs text-[#edf2fa]">
              {lightboxSrc.caption}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
