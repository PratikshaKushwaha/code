import { BookOpen, ArrowRight, ShieldCheck, Sparkles, Moon } from "lucide-react";
import heroBg from "../assets/graveyard-hero.jpg";

export function CoverPage({ onFlipToArchive }) {
  return (
    <div className="relative w-full h-full min-h-[820px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between bg-black select-none">
      {/* Background artwork: Haunted Graveyard with Full Moon & Manor */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Haunted Graveyard under Full Moon"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
        />
        {/* Deep atmospheric gradients for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(14,31,61,0.6)_0%,transparent_70%)]" />
      </div>

      {/* Creeping ground mist animation */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-10" />

      {/* Book Binding Stitch on Left Edge (Physical Tome effect) */}
      <div className="absolute top-0 bottom-0 left-0 w-8 z-30 pointer-events-none bg-gradient-to-r from-black/90 via-black/40 to-transparent border-r border-white/5 flex flex-col justify-around items-center py-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-6 rounded-full bg-amber-400/30 border border-amber-300/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
          />
        ))}
      </div>

      {/* Top Header metadata */}
      <header className="relative z-20 p-6 md:p-10 pl-12 md:pl-14 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-black/60 px-4 py-1.5 backdrop-blur-md shadow-lg">
          <Moon size={15} className="text-sky-300 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] text-sky-200 font-compact font-bold">
            ProjectGrim · Tome of Rest
          </span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-black/65 border border-white/10 px-4 py-1.5 text-xs text-ash backdrop-blur-md shadow-lg">
          <ShieldCheck size={14} className="text-sky-400" />
          <span className="font-compact uppercase tracking-wider text-[11px] text-sky-100">
            Canvas Protocol Verified
          </span>
        </div>
      </header>

      {/* Main Center Hero Content */}
      <div className="relative z-20 px-6 md:px-16 pl-12 md:pl-16 max-w-3xl py-8 md:py-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/60 px-3.5 py-1 text-xs text-sky-300 font-compact backdrop-blur-sm">
          <Sparkles size={13} className="text-sky-300" />
          <span>Home — Sanctuary for Abandoned Dreams</span>
        </div>

        <p className="font-compact text-xs md:text-sm uppercase tracking-[0.45em] text-sky-300/80 mb-2">
          P R O J E C T
        </p>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_5px_30px_rgba(0,0,0,1)]">
          GRAVEYARD
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-200 max-w-xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] font-body">
          A quiet haven where unfinished projects, paused prototypes, and abandoned code
          find dignity. Review the past, reflect on what was built, and decide what rises again.
        </p>

        {/* Poetic quote */}
        <div className="mt-6 border-l-2 border-sky-400/60 pl-4 py-2 bg-black/40 rounded-r-2xl max-w-lg backdrop-blur-md border border-white/5">
          <p className="font-script text-2xl sm:text-3xl text-sky-200 drop-shadow">
            "Every abandoned dream leaves a quiet phantom waiting for courage."
          </p>
        </div>

        {/* Mouse Drag / Flip Instruction & Action */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onFlipToArchive}
            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-sky-400 to-blue-500 px-7 py-3.5 font-compact text-sm font-bold text-slate-950 shadow-[0_0_35px_rgba(56,189,248,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(56,189,248,0.7)] cursor-pointer"
          >
            <BookOpen size={18} className="group-hover:rotate-12 transition duration-300 text-slate-950" />
            <span>Turn to Archive (Page 2)</span>
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition duration-300 text-slate-950" />
          </button>

          <span className="text-xs text-slate-300 font-compact tracking-wide bg-black/50 px-3.5 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            💡 Or click and drag mouse to flip page &rarr;
          </span>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="relative z-20 p-6 md:p-8 pl-12 md:pl-16 border-t border-white/10 bg-black/75 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
          <span className="font-compact uppercase tracking-wider text-sky-200">
            Page 1: The Gates
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
          <span>Grab right edge or swipe to peel page</span>
          <span className="text-sky-400">&rarr;</span>
        </div>
      </footer>
    </div>
  );
}
