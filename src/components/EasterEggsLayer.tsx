"use client";

import React, { useEffect, useRef, useState } from "react";
import { soundEngine } from "@/lib/soundEngine";
import { X, Terminal as TermIcon, Flame, Wind } from "lucide-react";

interface EasterEggsLayerProps {
  terminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  vortexMode: boolean;
  setVortexMode: React.Dispatch<React.SetStateAction<boolean>>;
  afterburner: boolean;
  setAfterburner: React.Dispatch<React.SetStateAction<boolean>>;
}

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function EasterEggsLayer({
  terminalOpen,
  setTerminalOpen,
  vortexMode,
  setVortexMode,
  afterburner,
  setAfterburner,
}: EasterEggsLayerProps) {
  const [cmdInput, setCmdInput] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "MISSION CONTROL TERMINAL v1.0 // TYPE 'help' FOR COMMANDS",
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const keyBufRef = useRef<string[]>([]);

  // DevTools ASCII aircraft briefing
  useEffect(() => {
    console.log(
      `%c
      __|__
--@--@--(_)--@--@--
YOUSSEF HEGAZY // FLIGHT CLEARANCE GRANTED
Type "vortex" on the page or press "/" for Mission Control.
      `,
      "color:#38bdf8;font-family:monospace;font-size:12px;"
    );
  }, []);

  // Global keyboard shortcuts: '/', '~', 'vortex', and Konami code
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "Escape" && terminalOpen) {
        setTerminalOpen(false);
        return;
      }

      if (!isInput && (e.key === "/" || e.key === "`" || e.key === "~")) {
        e.preventDefault();
        soundEngine.playTick(1400);
        setTerminalOpen(true);
        return;
      }

      if (isInput) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keyBufRef.current = [...keyBufRef.current.slice(-15), key];

      // Check "vortex"
      const last6 = keyBufRef.current.slice(-6).join("");
      if (last6 === "vortex") {
        soundEngine.playAfterburner();
        setVortexMode((v) => !v);
        keyBufRef.current = [];
        return;
      }

      // Check Konami code
      const last10 = keyBufRef.current.slice(-10);
      if (
        last10.length === 10 &&
        KONAMI.every((k, idx) => k.toLowerCase() === String(last10[idx]).toLowerCase())
      ) {
        soundEngine.playAfterburner();
        setAfterburner((a) => !a);
        keyBufRef.current = [];
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [terminalOpen, setTerminalOpen, setVortexMode, setAfterburner]);

  // Apply body class for Afterburner Overdrive
  useEffect(() => {
    document.body.classList.toggle("afterburner-overdrive", afterburner);
  }, [afterburner]);

  useEffect(() => {
    if (terminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [terminalOpen]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    soundEngine.playTick(1100);
    const out: string[] = [`> ${raw}`];

    switch (cmd) {
      case "help":
        out.push(
          "COMMANDS: whoami | podiums | egsa | ls hangar | vortex | afterburner | sudo fly | clear"
        );
        break;
      case "whoami":
        out.push(
          "Youssef Hegazy — Aviation IS @ ZNU (2028) · ZNU Robotics Vice Chairman · Co-Founder @ TUT Cafe"
        );
        break;
      case "podiums":
        out.push(
          "1st in Egypt (500g Sumobot, TITANS) · 2x 3rd Place (incl. Creativa Zag Hub) · 1x 2nd Place"
        );
        break;
      case "egsa":
        out.push("Egyptian Space Agency: Remote Sensing Certified · NTI: Machine Learning Track");
        break;
      case "ls hangar":
        out.push("VG-01 VORTEX-GEN [STEALTH]  |  QM-02 QAMAR [LIVE]  |  ZN-03 ZNUTABLE [LIVE]");
        break;
      case "vortex":
        setVortexMode((v) => !v);
        out.push("Toggled Hero Fluid Wind Tunnel Overdrive.");
        break;
      case "afterburner":
      case "sudo fly":
        soundEngine.playAfterburner();
        setAfterburner((a) => !a);
        out.push("AFTERBURNER OVERDRIVE ENGAGED.");
        break;
      case "clear":
        setLogs([]);
        return;
      default:
        out.push(`Unknown command '${cmd}'. Type 'help'.`);
    }
    setLogs((prev) => [...prev.slice(-14), ...out]);
  };

  return (
    <>
      {/* Active Easter Egg Status Pills */}
      {(vortexMode || afterburner) && (
        <div className="fixed bottom-4 left-4 z-50 flex flex-wrap gap-2">
          {vortexMode && (
            <button
              type="button"
              onClick={() => setVortexMode(false)}
              className="font-mono-hud inline-flex items-center gap-1.5 rounded-full border border-[#38bdf8] bg-[#04070f]/90 px-3 py-1.5 text-[11px] font-bold text-[#38bdf8] shadow-lg cursor-pointer"
            >
              <Wind className="h-3.5 w-3.5" />
              FLUID OVERDRIVE ON (CLICK TO EXIT)
            </button>
          )}
          {afterburner && (
            <button
              type="button"
              onClick={() => setAfterburner(false)}
              className="font-mono-hud inline-flex items-center gap-1.5 rounded-full border border-[#f59e0b] bg-[#04070f]/90 px-3 py-1.5 text-[11px] font-bold text-[#f59e0b] shadow-lg cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5" />
              AFTERBURNER OVERDRIVE ON
            </button>
          )}
        </div>
      )}

      {/* Slide-down Mission Control Terminal */}
      {terminalOpen && (
        <div
          className="fixed inset-0 z-[88] flex items-start justify-center bg-black/65 px-4 pt-20 backdrop-blur-sm"
          onClick={() => setTerminalOpen(false)}
        >
          <div
            className="hud-glass w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="font-mono-hud flex items-center gap-2 text-xs font-bold text-[#38bdf8]">
                <TermIcon className="h-4 w-4" />
                MISSION CONTROL // FLIGHT TERMINAL
              </div>
              <button
                type="button"
                onClick={() => setTerminalOpen(false)}
                className="rounded p-1 text-[#8a99b5] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="font-mono-hud max-h-64 space-y-1.5 overflow-y-auto bg-[#03060c]/85 p-4 text-xs text-[#edf2fa]">
              {logs.map((line, i) => (
                <div
                  key={i}
                  className={line.startsWith(">") ? "text-[#38bdf8]" : "text-[#cbd5e1]"}
                >
                  {line}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runCommand(cmdInput);
                setCmdInput("");
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-[#04070f] px-4 py-3"
            >
              <span className="font-mono-hud text-xs font-bold text-[#38bdf8]">pilot@znu:~$</span>
              <input
                ref={inputRef}
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="Type 'help', 'podiums', 'vortex', or 'sudo fly'..."
                className="font-mono-hud w-full bg-transparent text-xs text-white outline-none placeholder:text-[#64748b]"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
