"use client";

import React, { useEffect, useState } from "react";
import { COPY, Locale } from "@/lib/i18n";
import { GROUND_OPS_LOG } from "@/lib/portfolioData";
import { soundEngine } from "@/lib/soundEngine";
import { ArrowUpRight, Copy, Check, Mail, Phone, FileDown, Linkedin } from "lucide-react";

export default function ArchiveAndContact({ locale }: { locale: Locale }) {
  const t = COPY[locale].contact;
  const [copied, setCopied] = useState(false);
  const [cairoTime, setCairoTime] = useState("--:--:--");

  useEffect(() => {
    const updateClock = () => {
      try {
        setCairoTime(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: "Africa/Cairo",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date())
        );
      } catch {
        setCairoTime("EET");
      }
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  const copyEmail = async () => {
    soundEngine.playTick(1400);
    try {
      await navigator.clipboard.writeText("youssefossoss21@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = "mailto:youssefossoss21@gmail.com";
    }
  };

  return (
    <section
      id="contact"
      className="relative border-t border-white/5 bg-gradient-to-b from-[#03060c] to-[#04070f] px-4 py-24 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Compact Ground Ops / Secondary Archive */}
        <div className="font-mono-hud text-xs tracking-widest text-[#38bdf8]">{t.eyebrow}</div>
        <h3 className="font-display mt-2 text-2xl font-bold text-[#edf2fa] sm:text-3xl">
          {t.archiveTitle}
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GROUND_OPS_LOG.map((op) => (
            <div key={op.code} className="hud-glass flex flex-col justify-between rounded-xl p-5">
              <div>
                <div className="font-mono-hud flex items-center justify-between text-[10px] text-[#8a99b5]">
                  <span className="text-[#38bdf8]">{op.code}</span>
                  <span>{op.period}</span>
                </div>
                <h4 className="font-display mt-2 text-base font-bold text-[#edf2fa]">{op.name}</h4>
                <div className="font-mono-hud mt-0.5 text-[11px] text-[#f59e0b]">{op.role}</div>
                <p className="mt-2.5 text-xs leading-relaxed text-[#8a99b5]">{op.summary}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {op.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-hud rounded bg-white/5 px-2 py-0.5 text-[10px] text-[#8a99b5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {op.url && (
                  <a
                    href={op.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono-hud inline-flex items-center gap-1 text-[11px] font-semibold text-[#38bdf8] hover:underline"
                  >
                    Live
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Landing Contact Deck */}
        <div className="hud-glass mt-20 rounded-3xl p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="font-mono-hud text-xs tracking-widest text-emerald-400">
                RUNWAY CLEAR · 10TH OF RAMADAN / CAIRO · {cairoTime} EET
              </div>
              <h2 className="font-display mt-3 text-4xl font-extrabold tracking-tight text-[#edf2fa] sm:text-5xl">
                {t.title}
              </h2>
              <p className="mt-4 max-w-xl text-base text-[#8a99b5]">{t.subtitle}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#38bdf8] px-5 py-3 text-xs font-bold tracking-wider text-[#04070f] transition hover:bg-[#7dd3fc] cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? t.copied : "youssefossoss21@gmail.com"}
                </button>

                <a
                  href="mailto:youssefossoss21@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-semibold text-[#edf2fa] transition hover:border-[#38bdf8]"
                >
                  <Mail className="h-4 w-4 text-[#38bdf8]" />
                  {t.send}
                </a>

                <a
                  href="/Youssef_Hegazy_CV_Resume.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-3 text-xs font-semibold text-[#f59e0b] transition hover:bg-[#f59e0b]/20"
                >
                  <FileDown className="h-4 w-4" />
                  CV / Resume (PDF)
                </a>
              </div>
            </div>

            <div className="space-y-3 lg:col-span-5">
              <a
                href="https://www.linkedin.com/in/youssef-hegazy-0b0900374/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-[#38bdf8]/50"
              >
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-[#38bdf8]" />
                  <div>
                    <div className="text-sm font-bold text-[#edf2fa]">LinkedIn</div>
                    <div className="font-mono-hud text-xs text-[#8a99b5]">
                      /in/youssef-hegazy-0b0900374
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#8a99b5]" />
              </a>

              <a
                href="tel:+201028099176"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-[#38bdf8]/50"
              >
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-[#edf2fa]">Direct Line</div>
                    <div className="font-mono-hud text-xs text-[#8a99b5]">+20 102 809 9176</div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#8a99b5]" />
              </a>
            </div>
          </div>
        </div>

        <footer className="font-mono-hud mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 text-[11px] text-[#8a99b5]">
          <span>© 2026 YOUSSEF HEGAZY // NOCTURNAL MACH</span>
          <span>PRESS [ / ] FOR TERMINAL · TYPE &quot;vortex&quot; FOR FLUID OVERRIDE</span>
        </footer>
      </div>
    </section>
  );
}
