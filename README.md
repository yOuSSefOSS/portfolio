<a href="https://youssev.vercel.app">
  <img src="docs/social-preview.png" alt="Youssef Hegazy portfolio: WebGL2 fluid hero" width="100%">
</a>

<h1 align="center">Youssef Hegazy · Portfolio</h1>

<p align="center">
  An aerospace-themed portfolio where the hero is a <b>real-time GPU Navier-Stokes wind tunnel</b>.<br>
  My name and portrait are solid obstacles in the flow. Move the cursor and they shed vortices at 60 FPS.
</p>

<p align="center">
  <a href="https://youssev.vercel.app"><img alt="Live" src="https://img.shields.io/badge/Live-youssev.vercel.app-38BDF8?style=for-the-badge&labelColor=04070F&logo=vercel&logoColor=38BDF8"></a>
  <img alt="Next.js 15" src="https://img.shields.io/badge/Next.js-15-38BDF8?style=for-the-badge&labelColor=04070F&logo=nextdotjs&logoColor=38BDF8">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-38BDF8?style=for-the-badge&labelColor=04070F&logo=react&logoColor=38BDF8">
  <img alt="WebGL2" src="https://img.shields.io/badge/WebGL2-GLSL-38BDF8?style=for-the-badge&labelColor=04070F&logo=webgl&logoColor=38BDF8">
</p>

---

## How the fluid hero works

```mermaid
flowchart LR
    A["Cursor velocity"] --> B["Splat force + dye"]
    M["DOM text + portrait<br/>rasterized to offscreen mask"] --> O["Obstacle texture"]
    B --> C["Advect<br/>semi-Lagrangian"]
    O --> C
    C --> D["Vorticity confinement"]
    D --> E["Divergence"]
    E --> F["Jacobi pressure solve<br/>ping-pong FBOs"]
    F --> G["Gradient subtract<br/>no-slip at obstacles"]
    G --> H["Display shader<br/>Nocturnal Mach palette"]
    G -.-> C
```

- **Ping-pong framebuffers.** Velocity, pressure, and dye each live in two half-float textures that swap every pass, so the whole Eulerian step runs on the GPU.
- **DOM obstacles.** The hero headline and portrait silhouette are drawn to an isolated offscreen canvas and uploaded as an obstacle mask. Cells inside the mask have zero velocity, which is what makes the letters shed a wake.
- **Mach presets.** `0.3M`, `0.85M`, and `1.8M` retune the freestream inflow speed and cursor splat strength live.

## Highlights

| | |
|---|---|
| 🌊 **WebGL2 fluid hero** | GPU Navier-Stokes solver with DOM-shaped obstacles and Mach presets |
| 🎞️ **Scroll-scrubbed 3D sequences** | Frame-accurate WebP `ImageBitmap` scrubbing driven by GSAP ScrollTrigger |
| 🌀 **Vortex-Gen CFD stage** | Synced 60 FPS render modes (Smoke, Vorticity, Schlieren, Pressure, Velocity) that keep playback time when you switch |
| 🛬 **Hangar-door pre-flight loader** | 1.35s intro, skipped instantly on key or scroll, and cached per session |
| 🌍 **EN / AR** | Full Arabic RTL layout toggle |
| 🎛️ **Easter eggs** | `/` or `~` opens Mission Control terminal · type `vortex` for fluid overdrive · Konami code for afterburner · Web Audio cockpit synth |

## Performance notes

- The scroll altitude readout uses a ref plus an isolated hook (`useFlightAltitude`), so scrolling never re-renders the page tree.
- The fluid sim and videos pause when off-screen (`IntersectionObserver`).
- Lenis smooth scroll and GSAP ScrollTrigger share one RAF loop.

## Project structure

```
src/
├─ app/                # layout, page, global styles (Tailwind v4)
├─ components/
│  ├─ FluidHeroCanvas.tsx     # WebGL2 Navier-Stokes solver + obstacle mask
│  ├─ PreFlightLoader.tsx     # hangar-door intro
│  ├─ ScrollScrubCanvas.tsx   # WebP frame scrubbing
│  ├─ VortexCaseStudy.tsx     # multi-mode CFD stage
│  ├─ EasterEggsLayer.tsx     # terminal, vortex mode, Konami
│  └─ ...
└─ lib/                # i18n, sound engine, portfolio data, hooks
```

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000

# real frame-rate check (dev mode is slower)
npm run build && npm run start
```

---

<p align="center"><sub>Designed and built by <a href="https://github.com/yOuSSefOSS">Youssef Hegazy</a> · <a href="https://youssev.vercel.app/Youssef_Hegazy_CV_Resume.pdf">CV</a></sub></p>
