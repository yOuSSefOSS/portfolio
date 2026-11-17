export interface QamarScreen {
  id: string;
  label: string;
  src: string;
  note: string;
}

export const QAMAR_SCREENS: QamarScreen[] = [
  {
    id: "hero-dark",
    label: "3D Lookbook · Dark",
    src: "/media/qamar/hero_dark.webp",
    note: "Wear the Night — interactive 3D drag lookbook stage",
  },
  {
    id: "hero-spin",
    label: "Carousel Rotation",
    src: "/media/qamar/hero_carousel_spin.webp",
    note: "Real-time spatial perspective carousel with live pricing",
  },
  {
    id: "drawer-3d",
    label: "3D Fabric Sheen",
    src: "/media/qamar/product_drawer_3d.webp",
    note: "Interactive 3D fabric sheen viewer inside product quick-drawer",
  },
  {
    id: "checkout-3d",
    label: "3D Visa Checkout",
    src: "/media/qamar/checkout_3d_card.webp",
    note: "Live interactive 3D payment card binding inputs in real time",
  },
  {
    id: "collection",
    label: "Drop 01 Grid",
    src: "/media/qamar/collection_grid.webp",
    note: "Egyptian 500gsm heavyweight apparel editorial catalog",
  },
  {
    id: "shop-look",
    label: "Shop The Look",
    src: "/media/qamar/shop_the_look.webp",
    note: "Styled outfit breakdown with instant bundle add-to-bag",
  },
  {
    id: "hero-light",
    label: "Light Polarity",
    src: "/media/qamar/hero_light.webp",
    note: "Dual nocturnal / daylight editorial theme support",
  },
];

export const ZNUTABLE_SCREENS = [
  {
    id: "z1",
    label: "Materials Hub",
    src: "/media/znutable/screen_01.webp",
    caption: "Cloud lecture folders & peer notes hub",
  },
  {
    id: "z2",
    label: "Daily Schedule",
    src: "/media/znutable/screen_02.webp",
    caption: "Color-coded Aviation IS lectures & lab rooms",
  },
  {
    id: "z3",
    label: "Groups & Sections",
    src: "/media/znutable/screen_03.webp",
    caption: "Per-section filtering across OS & Computer Arch",
  },
  {
    id: "z4",
    label: "PWA v4.0 Core",
    src: "/media/znutable/screen_04.webp",
    caption: "Firebase Firestore sync + offline-capable PWA v4.0",
  },
];

export const FIELD_EVIDENCE_PHOTOS = [
  {
    id: "hackathon-check",
    src: "/media/profile/hackathon-check.webp",
    badge: "3RD PLACE AI · 5,000 EGP",
    caption: "Creativa Zag Hub Hackathon Podium (MoreDev / ITI / ZNU)",
  },
  {
    id: "cafe-mentorship",
    src: "/media/profile/cafe-mentorship.webp",
    badge: "TECHNICAL MENTORSHIP",
    caption: "Live architecture walkthrough with engineering peers",
  },
  {
    id: "event-hall",
    src: "/media/profile/event-hall.webp",
    badge: "ITI / ZNU SUMMIT",
    caption: "On-site competition build & technical briefing",
  },
];

export const GROUND_OPS_LOG = [
  {
    code: "OPS-01",
    name: "TITANS · 500g Sumobot & EV Digital Twin",
    role: "Software Lead · 1st in Egypt (Sumobot)",
    period: "Jan – Mar 2026",
    summary:
      "National 1st place 500g Sumobot campaign plus WebGL 3D EV digital twin mirroring dashboard and Node.js sensor telemetry.",
    tags: ["WebGL", "Node.js", "Embedded Telemetry"],
    url: null,
  },
  {
    code: "OPS-02",
    name: "TUT Cafe Ecosystem (POS + Menu Brand)",
    role: "Co-Founder & Operations Lead",
    period: "Jul 2026 – Present",
    summary:
      "Built the live custom point-of-sale system and bilingual brand experience powering daily beverage operations.",
    tags: ["React", "POS Operations", "Bilingual UI"],
    url: "https://tutsystems-kappa.vercel.app",
    secondaryUrl: "https://tutcafe.vercel.app",
  },
  {
    code: "OPS-03",
    name: "FarmaBot / AgriBot",
    role: "IoT Backend Engineer",
    period: "Dec 2025",
    summary:
      "Node.js control server synchronized with Firebase Realtime Database for autonomous agricultural sensor tracking.",
    tags: ["Node.js", "Firebase RTDB", "IoT"],
    url: null,
  },
  {
    code: "OPS-04",
    name: "Karta Task Manager",
    role: "Creator · Offline-First Web & Android",
    period: "Nov 2025",
    summary:
      "Dark-mode keyboard-accessible Kanban application packaged for both offline web use and Android compilation.",
    tags: ["Offline-First", "CRUD", "Android"],
    url: null,
  },
  {
    code: "OPS-05",
    name: "NACA Airfoil Geometry Generator",
    role: "Python Aerodynamics Utility",
    period: "2026",
    summary:
      "Parametric 4-digit airfoil coordinate generator feeding aerodynamic visualization pipelines.",
    tags: ["Python", "Aerodynamics"],
    url: null,
  },
];

export const CFD_MODES = [
  {
    id: "smoke",
    label: "SMOKE + VELOCITY",
    src: "/media/vortex/cfd_smoke.mp4",
    formula: "u · ∇s + ν∇²s",
    desc: "Semi-Lagrangian tracer advection visualizing laminar attachment & separation.",
  },
  {
    id: "vorticity",
    label: "VORTICITY (CURL)",
    src: "/media/vortex/cfd_vorticity.mp4",
    formula: "ω = ∇ × u",
    desc: "Alternating counter-rotating von Kármán vortex street shed behind stall.",
  },
  {
    id: "schlieren",
    label: "SCHLIEREN |∇ω|",
    src: "/media/vortex/cfd_schlieren.mp4",
    formula: "|∇ω|²",
    desc: "Optical shear-layer gradient isolating boundary layer roll-up.",
  },
  {
    id: "pressure",
    label: "PRESSURE FIELD",
    src: "/media/vortex/cfd_pressure.mp4",
    formula: "∇²p = ∇·u*",
    desc: "Gauss-Seidel SOR Poisson projection resolving upper-camber suction peaks.",
  },
  {
    id: "velocity",
    label: "VELOCITY JET",
    src: "/media/vortex/cfd_velocity.mp4",
    formula: "‖u‖ / V∞",
    desc: "Local speed magnitude field with live CL/CD aerodynamic vector overlay.",
  },
] as const;
