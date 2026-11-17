export type Locale = "en" | "ar";

export const COPY = {
  en: {
    nav: {
      takeoff: "01 Takeoff",
      climb: "02 Telemetry",
      cruise: "03 Hangar",
      vortex: "04 Vortex-Gen",
      orbit: "05 Orbit",
      land: "06 Contact",
      cmdHint: "Terminal [ / ]",
      audioOn: "AUDIO ON",
      audioOff: "AUDIO MUTED",
    },
    preloader: {
      badge: "PRE-FLIGHT CHECKLIST // SYS-00",
      title: "CLEARING RUNWAY",
      lines: [
        "AVIONICS & INSTRUMENTATION ....... CHECK",
        "GLSL NAVIER-STOKES TUNNEL ......... ARMED",
        "12-PART CAD & TURBOFAN CACHE ...... WARM",
        "FLIGHT TELEMETRY STREAM ........... ONLINE",
      ],
      cta: "ENGAGE & LAUNCH",
      skip: "Skip intro",
    },
    hero: {
      eyebrow: "AVIATION INFORMATION SYSTEMS · REAL-TIME PHYSICS · ROBOTICS",
      firstName: "YOUSSEF",
      lastName: "HEGAZY",
      subtitle:
        "I engineer real-time browser fluid solvers, procedural 3D aerospace simulators, and full-stack products — from Egypt's Sumobot podium to orbital telemetry.",
      ctaPrimary: "Inspect Flagship Case Study",
      ctaSecondary: "Open Flight Terminal [ / ]",
      machLabel: "TUNNEL MACH",
      resetWake: "RESET WAKE",
      hint: "Move cursor across the airflow — letters & silhouette shed live vortices",
    },
    climb: {
      eyebrow: "PHASE 02 // CLIMB · FIELD PROOF & PODIUMS",
      title: "Built in the lab, tested on the competition floor.",
      subtitle:
        "Verified competition results, space-agency remote sensing training, and hands-on engineering leadership.",
      stats: [
        { k: "1ST IN EGYPT", v: "500g Sumobot · TITANS / ZNU Robotics" },
        { k: "3× PODIUMS", v: "2× 3rd (Creativa Zag Hub) · 1× 2nd Place" },
        { k: "VICE CHAIRMAN", v: "ZNU Robotics Community (2026–Present)" },
        { k: "EGSA + NTI", v: "Remote Sensing & Machine Learning Certified" },
      ],
      photosTitle: "FIELD EVIDENCE",
    },
    cruise: {
      eyebrow: "PHASE 03 // CRUISE · DEPARTURE MANIFEST",
      title: "Selected Flight Operations",
      subtitle:
        "Every featured craft here is backed by live deployments or captured real-time builds.",
      viewLive: "Visit Live Deployment",
      openCase: "Enter Restricted Case Study",
    },
    vortex: {
      eyebrow: "PHASE 04 // SOLO FLAGSHIP CASE STUDY · STEALTH BUILD",
      title: "VORTEX-GEN",
      subtitle:
        "An entire wind tunnel, dual-spool jet engine cutaway, and procedural supersonic airframe engineered solo in the browser — instant aerodynamics without million-dollar CFD hardware.",
      scrubF16Title: "01 // SCROLL-DRIVEN 12-PART F-16C DISASSEMBLY",
      scrubF16Desc:
        "Scroll smoothly to scrub the procedural Sears-Haack nosecone, frameless bubble canopy, blended wing-body fuselage, and F110 exhaust nozzle.",
      cfdTitle: "02 // LIVE 5-MODE EULERIAN NAVIER-STOKES TUNNEL",
      cfdDesc:
        "220×110 MAC grid with Gauss-Seidel pressure projection, semi-Lagrangian advection, and 750 tracer particles at 60 FPS. Switch shader passes mid-stream without losing wake sync.",
      scrubTfTitle: "03 // DUAL-SPOOL TURBOFAN & POLAR TELEMETRY",
      scrubTfDesc:
        "Scroll to unlatch the clamshell cowlings and separate all 8 axial stages along concentric LP/HP shafts — paired with neural-surrogate CL/CD sweep curves.",
      theaterBtn: "Watch 26s Cinema Cut (With Sound)",
    },
    orbit: {
      eyebrow: "PHASE 05 // LEO ORBIT · 400 KM · STACK & SENSING",
      title: "From low-altitude airflow to orbital telemetry.",
      subtitle:
        "Trained in satellite remote sensing at the Egyptian Space Agency (EgSA) and Machine Learning at NTI — connecting real-time graphics with production engineering.",
    },
    contact: {
      eyebrow: "PHASE 06 // APPROACH & ARCHIVE",
      archiveTitle: "Ground Ops & Technical Log",
      title: "Cleared to land.",
      subtitle:
        "Open to high-impact engineering roles, technical founding collaborations, and ambitious interactive builds.",
      send: "Transmit Signal",
      copied: "Email copied to clipboard",
    },
  },
  ar: {
    nav: {
      takeoff: "01 الإقلاع",
      climb: "02 القياسات",
      cruise: "03 المشاريع",
      vortex: "04 فورتكس",
      orbit: "05 المدار",
      land: "06 التواصل",
      cmdHint: "الطرفية [ / ]",
      audioOn: "الصوت مفعل",
      audioOff: "الصوت صامت",
    },
    preloader: {
      badge: "قائمة ما قبل الإقلاع // SYS-00",
      title: "تجهيز الممر",
      lines: [
        "أنظمة الطيران والأجهزة .......... جاهز",
        "نفق نافييه-ستوكس الرسومي ......... مسلح",
        "ذاكرة النماذج ثلاثية الأبعاد ...... محملة",
        "بث القياسات اللحظية ............. متصل",
      ],
      cta: "بدء الإقلاع",
      skip: "تخطي",
    },
    hero: {
      eyebrow: "نظم معلومات الطيران · فيزياء لحظية · هندسة الروبوتات",
      firstName: "يوسف",
      lastName: "حجازي",
      subtitle:
        "أبني محاكيات ديناميكا هوائية لحظية داخل المتصفح، ومجسمات طيران ثلاثية الأبعاد، ومنصات برمجية متكاملة — من منصة التتويج في الروبوتات إلى تقنيات الفضاء.",
      ctaPrimary: "استعراض المشروع الرئيسي",
      ctaSecondary: "فتح طرفية التحكم [ / ]",
      machLabel: "سرعة الماخ",
      resetWake: "تصفير التدفق",
      hint: "حرّك المؤشر داخل الهواء — الحروف والصورة تولّد دوامات حقيقية",
    },
    climb: {
      eyebrow: "المرحلة 02 // الصعود · إنجازات موثقة",
      title: "تم التطوير في المعمل، واثبت الجدارة على أرض المنافسة.",
      subtitle: "نتائج بطولات موثقة، تدريب الاستشعار عن بعد بوكالة الفضاء المصرية، وقيادة تقنية.",
      stats: [
        { k: "الأول على مصر", v: "سوموبوت 500 جم · TITANS / ZNU" },
        { k: "3 مراكز هاكاثون", v: "المركز الثالث مرتين (كريتيفا زقازيق) · الثاني مرة" },
        { k: "نائب رئيس", v: "مجتمع ZNU للروبوتات (2026–الآن)" },
        { k: "EGSA + NTI", v: "شهادات الاستشعار عن بعد وتعلم الآلة" },
      ],
      photosTitle: "توثيق ميداني",
    },
    cruise: {
      eyebrow: "المرحلة 03 // التحليق · سجل الرحلات",
      title: "أبرز المشاريع الموثقة",
      subtitle: "كل مشروع معروض هنا مدعوم بلقطات حقيقية أو نشر مباشر فعّال.",
      viewLive: "فتح الموقع المباشر",
      openCase: "الدخول لدراسة الحالة",
    },
    vortex: {
      eyebrow: "المرحلة 04 // دراسة حالة فردية · وضع التخفي",
      title: "VORTEX-GEN",
      subtitle:
        "نفق رياح لحظي ومحرك تيربوفان ومقاتلة مفككة بالكامل داخل المتصفح — فيزياء طيران فورية بدون أجهزة محاكاة عملاقة.",
      scrubF16Title: "01 // تفكيك مقاتلة F-16C من 12 جزءاً بالتمرير",
      scrubF16Desc: "مرّر الصفحة لفصل القمع الراداري والهيكل والقمرة والمحرك بسلاسة كاملة.",
      cfdTitle: "02 // نفق رياح نافييه-ستوكس بـ 5 أوضاع بصرية",
      cfdDesc: "شبكة 220×110 بسرعة 60 إطار/ثانية مع 750 جسيماً — بدّل أوضاع التحليل لحظياً دون انقطاع.",
      scrubTfTitle: "03 // محرك التيربوفان والقياسات الديناميكية",
      scrubTfDesc: "مرّر لفتح الأغطية وفصل المراحل المحورية الثمانية مع منحنيات الرفع والسحب.",
      theaterBtn: "مشاهدة المونتاج السينمائي (26 ثانية)",
    },
    orbit: {
      eyebrow: "المرحلة 05 // المدار الأرضي المنخفض · 400 كم",
      title: "من تدفق الهواء إلى قياسات المدار.",
      subtitle: "تدريب الاستشعار عن بُعد في وكالة الفضاء المصرية وتعلم الآلة في NTI.",
    },
    contact: {
      eyebrow: "المرحلة 06 // الهبوط والتواصل",
      archiveTitle: "سجل العمليات الأرضية",
      title: "تم التصريح بالهبوط.",
      subtitle: "متاح لفرص الهندسة المتقدمة، الشراكات التقنية، وبناء التجارب التفاعلية.",
      send: "إرسال الإشارة",
      copied: "تم نسخ البريد الإلكتروني",
    },
  },
} as const;
