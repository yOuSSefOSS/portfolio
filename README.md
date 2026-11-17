# Youssef Hegazy — Portfolio

Interactive aerospace-themed portfolio built with Next.js 15, React 19, Tailwind CSS v4, GSAP ScrollTrigger, Lenis, and a custom WebGL2 Eulerian Navier-Stokes hero solver.

## Highlights

- **Real-Time WebGL2 Fluid Hero:** Ping-pong GPU Navier-Stokes solver reacting to cursor movement and Mach presets (`0.3M`, `0.85M`, `1.8M`), with solid-obstacle masking aligned to the hero typography and portrait.
- **Scroll-Scrubbed 3D Sequences:** Frame-accurate WebP `ImageBitmap` scrubbing via GSAP ScrollTrigger.
- **Interactive Multi-Mode CFD Stage:** Synced 60 FPS fluid shader tabs (`Smoke + Velocity`, `Vorticity`, `Schlieren`, `Pressure`, `Velocity`) preserving playback time across mode switches.
- **Bilingual EN / AR RTL & Easter Eggs:** Full Arabic RTL toggle, Web Audio cockpit synth, Mission Control Terminal (`/` or `~`), `vortex` fluid overdrive, and Konami afterburner mode.

## Local Development

```bash
npm install
npm run dev
```

For full production frame-rate verification:

```bash
npm run build
npm run start
```
