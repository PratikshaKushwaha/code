import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, X, Compass, Lightbulb, Target, BookOpen, Quote } from "lucide-react";
import { PROJECT_VISION_DATA } from "../utils/projectVisionData";
import { getProjectThumbnail } from "../utils/cardThumbnails";

export function VisionBoardModal({ project, onClose, onOpenCabinet }) {
  if (!project) return null;

  const visionData = PROJECT_VISION_DATA[project.id] || {
    id: project.id,
    title: project.title,
    sparkSubtitle: "Original Relic Inspiration",
    curiosityOrigin: project.vision,
    moodboardAtmosphere: "A profound creative ember awaiting preservation.",
    inspirations: [
      {
        id: `insp-${project.id}-1`,
        title: "Initial Architectural Sparks",
        category: "resource",
        type: "Concept Sketch",
        note: project.completedWork,
        tags: ["Concept", "Draft"],
        badgeColor: "text-amber-400 border-amber-500/50 bg-amber-950/40",
      },
      {
        id: `insp-${project.id}-2`,
        title: "Unfinished Milestones",
        category: "tool",
        type: "Engine Blueprint",
        note: project.unfinishedWork,
        tags: ["Blueprint", "Unfinished"],
        badgeColor: "text-sky-400 border-sky-500/50 bg-sky-950/40",
      },
    ],
    resources: {
      title: "Archive Resources Portal",
      description: "Manuscripts and design tokens ready for the Curiosity Cabinet.",
      itemCount: 2,
      preview: "Architecture blueprints · Design tokens · Modular components",
    },
  };

  const thumbnail = getProjectThumbnail(project.id);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [iconHovered, setIconHovered] = useState(false);
  const resourcePortalRef = useRef(null);

  // Scroll detection: when user scrolls towards the resource icon, activate transmission glow
  useEffect(() => {
    const el = resourcePortalRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            setIconHovered(true);
          }
        });
      },
      { threshold: [0.65] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const triggerTransmission = () => {
    if (isTransmitting) return;
    setIsTransmitting(true);
    setIconHovered(true);

    setTimeout(() => {
      onOpenCabinet?.(project);
    }, 850);
  };

  return (
    <dialog
      open
      aria-modal="true"
      className="fixed inset-0 z-50 w-screen h-dvh max-h-dvh flex flex-col bg-[#050b16]/95 backdrop-blur-2xl text-slate-100 select-none overflow-y-auto border-none p-0 m-0"
      style={{
        overscrollBehavior: "contain",
      }}
    >
      {/* ===================================================================
          TRANSMISSION PORTAL SURGE OVERLAY
          =================================================================== */}
      {isTransmitting && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-gradient-to-tr from-[#020610] via-[#091b36] to-[#451a03] animate-in fade-in duration-600">
          <div className="relative flex flex-col items-center gap-[1.25rem] text-center">
            <div className="relative w-[5.5rem] h-[5.5rem]">
              <div className="absolute inset-0 rounded-full border-2 border-amber-300 border-dashed animate-spin shadow-[0_0_2rem_#fbbf24]" />
              <div className="absolute inset-[0.45rem] rounded-full border-2 border-sky-400 border-t-transparent animate-[spin_2s_linear_infinite_reverse]" />
              <div className="absolute inset-[1.15rem] rounded-full bg-gradient-to-tr from-amber-400 to-sky-400 animate-ping opacity-75" />
            </div>
            <h2 className="font-cinzel text-[1.65rem] sm:text-[2.15rem] text-amber-200 tracking-[0.25em] uppercase font-black drop-shadow-lg">
              Transmitting to Curiosity Cabinet...
            </h2>
            <p className="font-snell text-[1.35rem] text-sky-200 italic">
              "Professor Grim prepares the chalk and classical shelves."
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================
          1. HEADER BAR
          =================================================================== */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-between px-[1rem] sm:px-[1.75rem] py-[0.75rem] bg-[#050b16]/90 backdrop-blur-md border-b border-sky-900/40">
        <div>
          <div className="flex items-center gap-[0.5rem]">
            <span className="w-[0.45rem] h-[0.45rem] rounded-full bg-amber-400 animate-pulse shadow-[0_0_0.5rem_#fbbf24]" />
            <span className="font-cinzel text-[0.65rem] uppercase tracking-[0.25em] text-[#d69a62] font-bold">
              Magnified Vision Board · Collage of Sparks
            </span>
            <span className="text-sky-900">|</span>
            <span className="font-mono text-[0.6rem] text-sky-300/80 uppercase">
              RELIC #{project.id}
            </span>
          </div>
          <h1 className="mt-[0.2rem] font-cinzel text-[1.6rem] sm:text-[2.2rem] font-black text-white tracking-wide leading-none">
            {project.title}
          </h1>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Vision Board"
          className="rounded-full w-[2rem] h-[2rem] flex items-center justify-center border border-sky-700/60 bg-[#091830]/80 text-sky-200 hover:text-white hover:border-amber-400 transition cursor-pointer backdrop-blur-md shadow-lg"
        >
          <X className="w-[1.15rem] h-[1.15rem]" />
        </button>
      </header>

      {/* ===================================================================
          2. WASHI-TAPED COLLAGE VISION BOARD (Reference: media_1792857927453_72276cbd.png)
          =================================================================== */}
      <main className="flex-1 w-full max-w-[85rem] mx-auto px-[1rem] sm:px-[1.5rem] py-[1.25rem] space-y-[1.5rem]">

        {/* TOP CALLIGRAPHIC PROLOGUE (Snell Roundhand Script) */}
        <div className="text-center pt-[0.25rem]">
          <span className="font-snell text-[2rem] sm:text-[2.6rem] text-amber-200/90 leading-none italic block drop-shadow-md">
            This is the vision & why we chose it
          </span>
          <span className="font-cormorant italic text-[0.85rem] text-sky-200/70">
            Taped ideas, reference fragments, and the raw spark of creation
          </span>
        </div>

        {/* COLLAGE BOARD GRID (Pinned photos, washi tape, torn notes) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[1.25rem] items-start">
          
          {/* Card 1: Pinned Project Hero Photo with Washi Tape */}
          <div className="md:col-span-5 relative p-[0.75rem] bg-[#fbf9f4] text-[#1a2332] rounded-2xl shadow-[0_1rem_2.5rem_rgba(0,0,0,0.85)] border border-stone-300 transform -rotate-[1.5deg] hover:rotate-0 transition-transform duration-300">
            {/* Washi Tape Strip on Top */}
            <div className="absolute -top-[0.55rem] left-[25%] w-[4.5rem] h-[1.15rem] bg-amber-100/70 border border-amber-300/40 shadow-sm rotate-[-3deg] backdrop-blur-sm z-20 pointer-events-none" />
            
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black shadow-inner">
              <img
                src={thumbnail}
                alt={project.title}
                className="w-full h-full object-cover filter brightness-105 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-[0.5rem] left-[0.5rem] right-[0.5rem] p-[0.5rem] rounded-lg bg-black/75 backdrop-blur-md text-[0.65rem] text-amber-200 font-cinzel font-bold">
                Classification: {project.status.toUpperCase()} Relic
              </div>
            </div>

            <div className="pt-[0.5rem] text-center">
              <span className="font-snell text-[1.35rem] font-bold text-stone-900 leading-tight block">
                {project.title}
              </span>
              <span className="font-cormorant italic text-[0.75rem] text-stone-600">
                Archived in the Graveyard Chamber
              </span>
            </div>
          </div>

          {/* Card 2: Pinned Torn Paper Note with Why We Actually Chose That Project */}
          <div className="md:col-span-7 relative p-[1.25rem] bg-[#101c30] rounded-2xl border-2 border-amber-400/40 shadow-[0_1rem_3rem_rgba(0,0,0,0.85)] transform rotate-[1deg] hover:rotate-0 transition-transform duration-300 space-y-[0.75rem]">
            {/* Washi Tape on Top Right */}
            <div className="absolute -top-[0.6rem] right-[2rem] w-[5rem] h-[1.15rem] bg-amber-200/60 border border-amber-300/50 shadow-sm rotate-[4deg] backdrop-blur-sm z-20 pointer-events-none" />

            <div className="flex items-center gap-[0.5rem] text-amber-300 font-cinzel text-[0.75rem] uppercase tracking-widest font-bold">
              <Compass className="w-[0.95rem] h-[0.95rem] text-amber-400" />
              <span>Why Did We Actually Choose This Project?</span>
            </div>

            <p className="font-snell text-[1.45rem] sm:text-[1.75rem] text-amber-100 font-semibold leading-snug italic">
              "{visionData.curiosityOrigin}"
            </p>

            <div className="p-[0.75rem] rounded-xl bg-black/40 border border-sky-900/60 text-[0.8rem] text-slate-200 leading-relaxed font-body">
              <strong className="text-sky-300 font-cinzel text-[0.7rem] uppercase tracking-wider block mb-[0.25rem]">
                Our Original Creative Vision:
              </strong>
              {project.vision}
            </div>

            <div className="text-[0.7rem] font-cormorant italic text-sky-200/75">
              Atmosphere & Resonance: {visionData.moodboardAtmosphere}
            </div>
          </div>

        </div>

        {/* ===================================================================
            COLLAGE ROW 2: WHATEVER IDEAS WE HAD KEPT THERE (Notes & Milestones)
            =================================================================== */}
        <div>
          <div className="flex items-center justify-between mb-[0.65rem]">
            <h3 className="font-cinzel text-[0.85rem] uppercase tracking-[0.2em] text-sky-300 font-bold flex items-center gap-[0.45rem]">
              <Lightbulb className="w-[0.85rem] h-[0.85rem] text-amber-400" />
              <span>Whatever Ideas We Had Kept There</span>
            </h3>
            <span className="font-snell text-[1.15rem] text-[#d69a62] italic">
              "Be True to the Work"
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1rem]">
            {/* Pinned Note A: Completed */}
            <div className="relative p-[1rem] bg-[#0c221a] rounded-2xl border border-emerald-500/40 shadow-lg transform rotate-[-1deg] hover:rotate-0 transition-transform">
              <div className="absolute -top-[0.5rem] left-[1.5rem] w-[3.5rem] h-[0.95rem] bg-emerald-200/50 border border-emerald-400/40 rotate-[2deg] pointer-events-none" />
              <span className="font-cinzel text-[0.7rem] uppercase font-bold text-emerald-300 block mb-[0.25rem]">
                ✓ Completed Work
              </span>
              <p className="text-[0.75rem] text-emerald-100/90 leading-relaxed font-body">
                {project.completedWork}
              </p>
            </div>

            {/* Pinned Note B: Unfinished */}
            <div className="relative p-[1rem] bg-[#221708] rounded-2xl border border-amber-500/40 shadow-lg transform rotate-[1.5deg] hover:rotate-0 transition-transform">
              <div className="absolute -top-[0.5rem] left-[1.5rem] w-[3.5rem] h-[0.95rem] bg-amber-200/50 border border-amber-400/40 rotate-[-3deg] pointer-events-none" />
              <span className="font-cinzel text-[0.7rem] uppercase font-bold text-amber-300 block mb-[0.25rem]">
                ⏳ Unfinished Blueprints
              </span>
              <p className="text-[0.75rem] text-amber-100/90 leading-relaxed font-body">
                {project.unfinishedWork}
              </p>
            </div>

            {/* Pinned Note C: Stopped */}
            <div className="relative p-[1rem] bg-[#220a0d] rounded-2xl border border-rose-500/40 shadow-lg transform rotate-[-0.8deg] hover:rotate-0 transition-transform">
              <div className="absolute -top-[0.5rem] left-[1.5rem] w-[3.5rem] h-[0.95rem] bg-rose-200/50 border border-rose-400/40 rotate-[1deg] pointer-events-none" />
              <span className="font-cinzel text-[0.7rem] uppercase font-bold text-rose-300 block mb-[0.25rem]">
                ⚔ Why Development Paused
              </span>
              <p className="text-[0.75rem] text-rose-100/90 leading-relaxed font-body">
                {project.stopReason}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================
            COLLAGE ROW 3: INSPIRATIONS & REFERENCE CARDS
            =================================================================== */}
        <div>
          <div className="flex items-center justify-between mb-[0.65rem]">
            <h3 className="font-cinzel text-[0.85rem] uppercase tracking-[0.2em] text-sky-300 font-bold flex items-center gap-[0.45rem]">
              <Sparkles className="w-[0.85rem] h-[0.85rem] text-sky-400" />
              <span>Inspiration Fragments & Moodboard</span>
            </h3>
            <span className="font-mono text-[0.65rem] text-slate-400">
              {visionData.inspirations.length} Pinned Artifacts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[0.85rem]">
            {visionData.inspirations.map((item, idx) => (
              <div
                key={item.id}
                className={`relative p-[0.85rem] rounded-xl border border-sky-900/60 bg-[#08152c]/85 shadow-md flex flex-col justify-between hover:border-amber-400/70 transition-all ${
                  idx % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
                }`}
              >
                <div>
                  <span className={`text-[0.58rem] font-mono uppercase tracking-widest px-[0.4rem] py-[0.08rem] rounded-full border ${item.badgeColor}`}>
                    {item.type}
                  </span>
                  <h4 className="mt-[0.4rem] font-cinzel text-[0.88rem] font-bold text-white group-hover:text-amber-200">
                    {item.title}
                  </h4>
                  <p className="mt-[0.25rem] text-[0.72rem] text-slate-300 leading-snug">
                    {item.note}
                  </p>
                </div>
                <div className="mt-[0.6rem] pt-[0.4rem] border-t border-sky-950 flex flex-wrap gap-[0.25rem]">
                  {item.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[0.58rem] font-mono text-sky-300/80 bg-sky-950/70 px-[0.35rem] py-[0.05rem] rounded border border-sky-900/40"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            SECTION 4: THE RESOURCE PANEL WITH BEAUTIFUL TRANSMITTING ICON
            (Hover or scroll towards this icon transmits to Curiosity Cabinet!)
            =================================================================== */}
        <section
          ref={resourcePortalRef}
          onMouseEnter={triggerTransmission}
          className={`relative p-[1.25rem] sm:p-[1.75rem] rounded-3xl border-2 transition-all duration-700 cursor-pointer overflow-hidden ${
            iconHovered || isTransmitting
              ? "border-amber-400 bg-gradient-to-r from-amber-950/95 via-[#0c244c] to-sky-950/95 shadow-[0_0_3.5rem_rgba(245,158,11,0.7)] scale-[1.01]"
              : "border-sky-500/50 bg-gradient-to-r from-[#07162d]/90 via-[#0a1e3d]/85 to-[#061224]/90 hover:border-amber-300 shadow-2xl"
          }`}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-[1.25rem]">
            
            <div className="space-y-[0.35rem] text-center md:text-left">
              <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.25rem] rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[0.7rem] font-cinzel uppercase tracking-widest font-bold">
                <span className="w-[0.4rem] h-[0.4rem] rounded-full bg-amber-400 animate-ping" />
                Curiosity Cabinet Gateway
              </div>
              <h2 className="font-cinzel text-[1.6rem] sm:text-[2rem] font-black text-white">
                The Resources Chamber
              </h2>
              <p className="font-cormorant italic text-[1rem] text-sky-200/90 max-w-[42rem] leading-snug">
                Hover or scroll towards the Astrolabe Icon to transmit directly into the Curiosity Cabinet, where your resources, tools, and components await interactively.
              </p>
              <div className="font-mono text-[0.68rem] text-amber-300/80 pt-[0.2rem]">
                Archive Contents: {visionData.resources.preview}
              </div>
            </div>

            {/* THE BEAUTIFUL RESOURCE ICON (Animated Astrolabe Celestial Orb) */}
            <div
              onClick={triggerTransmission}
              className={`relative flex flex-col items-center justify-center p-[1.25rem] rounded-2xl bg-black/60 border-2 transition-all duration-500 cursor-pointer ${
                iconHovered
                  ? "border-amber-300 scale-110 shadow-[0_0_2.5rem_#fbbf24] bg-amber-950/60"
                  : "border-amber-500/50 hover:border-amber-300 shadow-xl"
              }`}
            >
              <div className="relative w-[5rem] h-[5rem] flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full border-2 border-amber-300/70 border-dashed transition-all duration-300 ${
                    iconHovered ? "animate-[spin_3s_linear_infinite]" : "animate-[spin_10s_linear_infinite]"
                  }`}
                />
                <div
                  className={`absolute inset-[0.45rem] rounded-full border border-sky-300/80 border-dotted transition-all duration-300 ${
                    iconHovered ? "animate-[spin_2s_linear_infinite_reverse]" : "animate-[spin_7s_linear_infinite_reverse]"
                  }`}
                />
                <div className="relative w-[2.5rem] h-[2.5rem] rounded-full bg-gradient-to-tr from-[#78350f] via-[#d97706] to-[#fde047] shadow-[0_0_1.5rem_#fbbf24] flex items-center justify-center">
                  <Sparkles className="w-[1.25rem] h-[1.25rem] text-stone-950 animate-pulse" />
                </div>
              </div>

              <span className="font-snell text-[1.1rem] text-amber-200 italic mt-[0.4rem] text-center">
                Transmit to Cabinet ⟶
              </span>
              <span className="font-cinzel text-[0.58rem] tracking-widest uppercase text-sky-300 font-bold">
                Tap or Hover Icon
              </span>
            </div>

          </div>
        </section>

      </main>
    </dialog>
  );
}

export default VisionBoardModal;
