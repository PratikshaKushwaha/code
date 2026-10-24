import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, BookOpen, Heart, Compass, Shield, Feather } from "lucide-react";

export function Us() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-dvh w-full bg-[#070d18] text-slate-100 flex flex-col justify-between overflow-x-hidden select-none p-[0.75rem] sm:p-[1.25rem] md:p-[1.75rem]">
      {/* ===================================================================
          1. FULLSCREEN AMBIENT BACKGROUND
          =================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          src="/background-sparks.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter blur-[0.35rem] brightness-[0.35] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b172a]/85 via-[#060c16]/90 to-[#02050b]/95" />
      </div>

      {/* ===================================================================
          2. HEADER BAR (Navigation back to Cabinet / Archive)
          =================================================================== */}
      <header className="relative z-20 flex items-center justify-between pb-[1rem] border-b border-sky-900/40">
        <button
          type="button"
          onClick={() => navigate("/cabinet")}
          className="flex items-center gap-[0.5rem] px-[1.15rem] py-[0.45rem] rounded-full border border-sky-600/50 bg-[#091830]/85 text-sky-200 hover:text-white hover:border-amber-400 transition-all cursor-pointer shadow-lg backdrop-blur-md text-[0.75rem] font-cinzel uppercase tracking-wider"
        >
          <ArrowLeft className="w-[0.9rem] h-[0.9rem]" />
          <span>Return to Cabinet</span>
        </button>

        <div className="text-right">
          <span className="font-cinzel text-[0.65rem] uppercase tracking-[0.25em] text-[#d69a62] font-bold block">
            The Keepers of the Folio
          </span>
          <span className="font-snell text-[1.15rem] text-sky-300 italic">
            "We who honor the uncompleted."
          </span>
        </div>
      </header>

      {/* ===================================================================
          3. MAIN SANCTUARY CONTENT: THE STORY OF "US"
          =================================================================== */}
      <main className="relative z-10 flex-1 w-full max-w-[65rem] mx-auto my-[1.5rem] space-y-[2rem]">
        
        {/* HERO TITLE */}
        <div className="text-center space-y-[0.5rem]">
          <div className="inline-flex items-center gap-[0.5rem] px-[1rem] py-[0.35rem] rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[0.7rem] font-cinzel uppercase tracking-widest font-bold">
            <Sparkles className="w-[0.8rem] h-[0.8rem] text-amber-400" />
            Sanctuary Manifesto
          </div>
          <h1 className="font-cinzel text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-black text-white tracking-wide leading-none drop-shadow-2xl">
            US & PROJECTGRIM
          </h1>
          <p className="font-snell text-[1.5rem] sm:text-[1.8rem] text-amber-200 italic max-w-[42rem] mx-auto leading-snug">
            "Every abandoned creation carries a spark that simply awaits its rightful destination."
          </p>
        </div>

        {/* ===================================================================
            THE MANIFESTO & WHY WE BUILT THIS
            =================================================================== */}
        <section className="p-[1.25rem] sm:p-[1.75rem] rounded-3xl border border-sky-800/50 bg-[#07162d]/85 shadow-2xl backdrop-blur-md space-y-[1.25rem]">
          <div className="flex items-center gap-[0.6rem] text-sky-300 font-cinzel text-[0.8rem] uppercase tracking-widest font-bold">
            <Feather className="w-[1rem] h-[1rem] text-amber-400" />
            <span>The Origin of the Sanctuary</span>
          </div>

          <div className="space-y-[1rem] text-[0.85rem] sm:text-[0.95rem] text-slate-200 leading-relaxed font-body">
            <p>
              We built <strong className="text-white font-cinzel">ProjectGrim</strong> because the digital world treats unfinished projects as embarrassments. In developer culture, dormant repositories are swept under rugs, half-composed symphonies gather digital dust, and dream cartography notebooks end up in forgotten drawers.
            </p>
            <p className="font-cormorant italic text-[1.1rem] text-amber-100/95 border-l-2 border-[#d69a62] pl-[1rem]">
              "Yet it is often our abandoned ideas that hold our most daring, unfiltered creative honesty — the moments where we dared to build without corporate constraints or commercial fear."
            </p>
            <p>
              ProjectGrim is not a graveyard of mourning; it is a sacred conservatory. Here, you hang your polaroid relics along warm fairy lights, inspect their sparks in the Vision Board, store modular discoveries in the Curiosity Cabinet with Professor Grim, and grant each creation one of the Five Destinies.
            </p>
          </div>
        </section>

        {/* ===================================================================
            THE FIVE SACRED DESTINIES
            =================================================================== */}
        <section className="space-y-[1rem]">
          <h2 className="font-cinzel text-[1.1rem] uppercase tracking-[0.2em] text-amber-300 font-bold text-center">
            The Five Destinies of Creative Work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[0.85rem]">
            {/* 1. Revive */}
            <div className="p-[1rem] rounded-2xl border border-emerald-500/40 bg-emerald-950/30 text-center flex flex-col justify-between">
              <span className="font-cinzel text-[0.8rem] font-bold text-emerald-300 uppercase block mb-[0.25rem]">
                I. Revive
              </span>
              <p className="text-[0.72rem] text-slate-300 italic">
                When the world has caught up and the ember still pulses with heat.
              </p>
            </div>

            {/* 2. Continue */}
            <div className="p-[1rem] rounded-2xl border border-sky-500/40 bg-sky-950/30 text-center flex flex-col justify-between">
              <span className="font-cinzel text-[0.8rem] font-bold text-sky-300 uppercase block mb-[0.25rem]">
                II. Continue
              </span>
              <p className="text-[0.72rem] text-slate-300 italic">
                When courage returns and the tools lie exactly where you laid them.
              </p>
            </div>

            {/* 3. Reimagine */}
            <div className="p-[1rem] rounded-2xl border border-indigo-500/40 bg-indigo-950/30 text-center flex flex-col justify-between">
              <span className="font-cinzel text-[0.8rem] font-bold text-indigo-300 uppercase block mb-[0.25rem]">
                III. Reimagine
              </span>
              <p className="text-[0.72rem] text-slate-300 italic">
                When the thesis was sound, but the vessel must be completely recast.
              </p>
            </div>

            {/* 4. Repurpose */}
            <div className="p-[1rem] rounded-2xl border border-amber-500/40 bg-amber-950/30 text-center flex flex-col justify-between">
              <span className="font-cinzel text-[0.8rem] font-bold text-amber-300 uppercase block mb-[0.25rem]">
                IV. Repurpose
              </span>
              <p className="text-[0.72rem] text-slate-300 italic">
                When the whole must fall, but the components are priceless gems.
              </p>
            </div>

            {/* 5. Let Go */}
            <div className="p-[1rem] rounded-2xl border border-blue-400/40 bg-blue-950/30 text-center flex flex-col justify-between">
              <span className="font-cinzel text-[0.8rem] font-bold text-blue-200 uppercase block mb-[0.25rem]">
                V. Rest in Peace
              </span>
              <p className="text-[0.72rem] text-slate-300 italic">
                When the lesson has been absorbed, and peace is the true completion.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================
            THE KEEPERS CARD
            =================================================================== */}
        <section className="p-[1.5rem] rounded-3xl border border-[#d69a62]/40 bg-gradient-to-r from-[#101820]/90 via-[#182333]/85 to-[#0b1320]/90 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-[1.25rem]">
          <div className="space-y-[0.35rem] text-center sm:text-left">
            <span className="font-cinzel text-[0.65rem] uppercase tracking-widest text-[#d69a62] font-bold">
              Archivists & Architects
            </span>
            <h3 className="font-cinzel text-[1.4rem] font-bold text-white">
              The Keepers of the Folio
            </h3>
            <p className="font-cormorant italic text-[0.95rem] text-slate-300">
              Forged with WebGL shaders, Three.js page curvature, Snell script calligraphy, and deep reverence for the creator's soul.
            </p>
          </div>

          <div className="flex items-center gap-[0.75rem] shrink-0">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-[1.25rem] py-[0.5rem] rounded-full border border-amber-500/60 bg-amber-950/70 text-amber-200 hover:text-white hover:border-amber-300 transition cursor-pointer text-[0.75rem] font-cinzel uppercase tracking-wider shadow-lg"
            >
              Sanctuary Gates ⟵
            </button>
            <button
              type="button"
              onClick={() => navigate("/archive")}
              className="px-[1.25rem] py-[0.5rem] rounded-full border border-sky-500/60 bg-sky-950/70 text-sky-200 hover:text-white hover:border-sky-300 transition cursor-pointer text-[0.75rem] font-cinzel uppercase tracking-wider shadow-lg"
            >
              The Archive ⟶
            </button>
          </div>
        </section>

      </main>

      {/* ===================================================================
          4. FOOTER CUE
          =================================================================== */}
      <footer className="relative z-20 pt-[0.75rem] border-t border-sky-900/30 flex items-center justify-between text-[0.7rem] text-slate-400">
        <span className="font-cinzel uppercase tracking-widest text-sky-300/70">
          PROJECTGRIM · LIBER RELIQUIARUM
        </span>
        <span className="font-snell text-[1rem] text-[#d69a62] italic">
          "Memoriae aeternae operum inceptorum."
        </span>
      </footer>
    </div>
  );
}

export default Us;
