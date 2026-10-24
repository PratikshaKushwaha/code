import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Wrench,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Copy,
  GraduationCap,
} from "lucide-react";
import { PROJECT_VISION_DATA } from "../utils/projectVisionData";
import cabinetRefImg from "../assets/cabinet-reference.jpg";

// Initial mini-library storage
const DEFAULT_CABINET_STORAGE = {
  resources: [
    {
      id: "res-1",
      title: "WebRTC DataChannel Mesh Topology",
      type: "Research Manuscript",
      source: "ShadowCast Relic",
      note: "P2P low-latency audio network documentation.",
    },
    {
      id: "res-2",
      title: "Uranometria 1603 Celestial Atlas",
      type: "Historical Reference",
      source: "MoonlightJournal Relic",
      note: "High-resolution copperplate star charts.",
    },
  ],
  tools: [
    {
      id: "tool-1",
      title: "CRT Phosphor Persistence Shader",
      type: "GLSL Shader",
      source: "ShadowCast Relic",
      note: "WebGL vertex & fragment shader for retro waveforms.",
    },
    {
      id: "tool-2",
      title: "A* Cellular Automata Pathfinder",
      type: "Algorithmic Engine",
      source: "PhantomGrid Relic",
      note: "Procedural labyrinth generator and obstacle solver.",
    },
  ],
  components: [
    {
      id: "comp-1",
      title: "Gothic Masonry 16-Bit Tilemap",
      type: "Sprite Sheet",
      source: "PhantomGrid Relic",
      note: "32x32 modular dungeon tiles with normal maps.",
    },
    {
      id: "comp-2",
      title: "Terminal ANSI Box-Drawing Toolkit",
      type: "UI Component",
      source: "CryptKeeper Relic",
      note: "Command-line ASCII border and epigraph parser.",
    },
  ],
};

export function CuriosityCabinet({ project: propProject, onBackToArchive }) {
  const navigate = useNavigate();
  const location = useLocation();
  const project = propProject || location.state?.project || null;

  // Stored items in mini-library
  const [cabinetItems, setCabinetItems] = useState(() => {
    try {
      const saved = localStorage.getItem("projectgrim_cabinet_library");
      return saved ? JSON.parse(saved) : DEFAULT_CABINET_STORAGE;
    } catch {
      return DEFAULT_CABINET_STORAGE;
    }
  });

  // Slider door open state (0.0 = closed, 1.0 = fully open)
  const [doorProgress, setDoorProgress] = useState({
    resources: 0.65,
    tools: 0.2,
    components: 0.15,
  });

  // Mascot Teacher State
  const [mascotDialogue, setMascotDialogue] = useState(
    "Welcome, apprentice! I am Professor Grim. This is our Curiosity Cabinet — slide each wooden door with your mouse to inspect our mini-library!"
  );
  const [mascotChalkRune, setMascotChalkRune] = useState("✧ 𝔖𝔠𝔦𝔢𝔫𝔱𝔦𝔞 𝔈𝔱𝔢𝔯𝔫𝔞 ✧");
  const [activeDragDrawer, setActiveDragDrawer] = useState(null);
  const [toast, setToast] = useState(null);

  // 3D Door to "Us" State
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isEnteringDoor, setIsEnteringDoor] = useState(false);

  // Dragging slider tracking
  const draggingSliderRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("projectgrim_cabinet_library", JSON.stringify(cabinetItems));
    } catch {
      // Fallback
    }
  }, [cabinetItems]);

  const handleSliderDragStart = (e, drawerId) => {
    e.stopPropagation();
    draggingSliderRef.current = {
      drawerId,
      startX: e.clientX,
      startProgress: doorProgress[drawerId],
    };

    if (drawerId === "resources") {
      setMascotDialogue(
        "Bay I: Resources! Here we enshrine the ancient manuscripts, research blueprints, and philosophical palettes that ignited the original spark."
      );
      setMascotChalkRune("📖 I. 𝕽𝖊𝖘𝖔𝖚𝖗𝖈𝖊𝖘: 𝕾𝖈𝖗𝖔𝖑𝖑𝖘 & 𝕻𝖆𝖑𝖊𝖙𝖙𝖊𝖘");
    } else if (drawerId === "tools") {
      setMascotDialogue(
        "Bay II: Tools! The compilers, audio relays, and WebGL shaders forged to build the foundation. Slide it wide to inspect the instruments."
      );
      setMascotChalkRune("⚙ II. 𝕿𝖔𝖔𝖑𝖘: 𝕰𝖓𝖌𝖎𝖓𝖊𝖘 & 𝕾𝖍𝖆𝖉𝖊𝖗𝖘");
    } else {
      setMascotDialogue(
        "And Bay III: Components & Assets! Modular UI widgets, pixel sprites, and sound palettes ready to be transplanted into new creations."
      );
      setMascotChalkRune("🧩 III. 𝕮𝖔𝖒𝖕𝖔𝖓𝖊𝖓𝖙𝖘 & 𝕬𝖘𝖘𝖊𝖙𝖘");
    }
  };

  const handleGlobalPointerMove = (e) => {
    if (!draggingSliderRef.current) return;
    const { drawerId, startX, startProgress } = draggingSliderRef.current;
    const deltaX = e.clientX - startX;
    const progressDelta = deltaX / (window.innerWidth * 0.16);
    const newProgress = Math.max(0, Math.min(1, startProgress + progressDelta));

    setDoorProgress((prev) => ({
      ...prev,
      [drawerId]: newProgress,
    }));
  };

  const handleGlobalPointerUp = () => {
    draggingSliderRef.current = null;
  };

  const handleItemDragStart = (e, item) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.setData("text/plain", item.title);
    setMascotDialogue(
      `Splendid, apprentice! Now drag "${item.title}" into any open cabinet shelf to store it as your permanent mini-library copy!`
    );
  };

  const handleDrawerDragOver = (e, drawerId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (activeDragDrawer !== drawerId) setActiveDragDrawer(drawerId);
  };

  const handleDrawerDragLeave = () => {
    setActiveDragDrawer(null);
  };

  const handleDrawerDrop = (e, drawerId) => {
    e.preventDefault();
    setActiveDragDrawer(null);

    let droppedData = null;
    try {
      const raw = e.dataTransfer.getData("application/json");
      if (raw) droppedData = JSON.parse(raw);
    } catch {
      // Fallback
    }

    const title = droppedData?.title || e.dataTransfer.getData("text/plain") || "Archived Artifact";
    const newItem = {
      id: `stored-${Date.now()}`,
      title: title,
      type: droppedData?.type || "Preserved Relic",
      source: project?.title || "Vision Board",
      note: droppedData?.note || "Copied from Project Vision Board into mini-library.",
    };

    setCabinetItems((prev) => ({
      ...prev,
      [drawerId]: [...prev[drawerId], newItem],
    }));

    setDoorProgress((prev) => ({
      ...prev,
      [drawerId]: Math.max(0.65, prev[drawerId]),
    }));

    setMascotDialogue(
      `Masterful! "${title}" has been successfully cataloged into the ${drawerId.toUpperCase()} cabinet! Touch and motion preserve what clicks forget.`
    );
    setMascotChalkRune(`✓ +1 𝕬𝖗𝖈𝖍𝖎𝖛𝖊𝖉 𝖙𝖔 ${drawerId.toUpperCase()}`);

    setToast({
      title: title,
      drawer: drawerId.toUpperCase(),
    });
    setTimeout(() => setToast(null), 3500);
  };

  // 3D Door Entrance to "Us"
  const handleEnterDoor = () => {
    if (isEnteringDoor) return;
    setIsDoorOpen(true);
    setIsEnteringDoor(true);
    setMascotDialogue("Farewell for now, apprentice! Step boldly through the 3D Sanctum Door to meet Us.");
    setMascotChalkRune("✦ 𝕰𝖓𝖙𝖊𝖗𝖎𝖓𝖌 𝖙𝖍𝖊 𝕾𝖆𝖓𝖈𝖙𝖚𝖒 𝖔𝖋 𝖀𝖘 ✦");

    setTimeout(() => {
      navigate("/us");
    }, 850);
  };

  const currentRelicData = PROJECT_VISION_DATA[project?.id || "relic-1"] || PROJECT_VISION_DATA["relic-1"];

  return (
    <div
      onPointerMove={handleGlobalPointerMove}
      onPointerUp={handleGlobalPointerUp}
      className="relative w-screen h-dvh max-h-dvh bg-[#070b14] text-slate-100 flex flex-col justify-between overflow-hidden select-none p-[0.75rem] sm:p-[1rem]"
    >
      {/* ===================================================================
          1. FULLSCREEN AMBIENT BACKGROUND (Sparks Video + Crimson Ambiance)
          =================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          src="/background-sparks.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter blur-[0.4rem] brightness-[0.35] opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#18080a]/90 via-[#0d101d]/85 to-[#04060c]/95" />
      </div>

      {/* Floating Dust Motes */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[0.25rem] h-[0.25rem] rounded-full bg-amber-300/40 animate-[dustFloat_6s_ease-in-out_infinite]"
            style={{
              top: `${(i * 8.5 + 10) % 90}%`,
              left: `${(i * 12.3 + 5) % 95}%`,
              animationDelay: `${(i * 0.7) % 5}s`,
            }}
          />
        ))}
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          className="fixed top-[1.25rem] right-[1.25rem] z-50 flex items-center gap-[0.75rem] rounded-2xl border border-amber-400/60 bg-[#160d07]/95 px-[1.25rem] py-[0.65rem] shadow-2xl backdrop-blur-md animate-in fade-in"
        >
          <CheckCircle2 className="w-[1.2rem] h-[1.2rem] text-amber-400" />
          <div className="text-[0.75rem]">
            <span className="font-bold text-white">{toast.title} </span>
            <span className="text-amber-200">stored in {toast.drawer} Mini-Library!</span>
          </div>
        </div>
      )}

      {/* ===================================================================
          2. HEADER BAR
          =================================================================== */}
      <header className="relative z-20 flex items-center justify-between pb-[0.5rem] border-b border-amber-900/40">
        <div className="flex items-center gap-[1rem]">
          <button
            type="button"
            onClick={() => {
              if (onBackToArchive) onBackToArchive();
              else navigate("/archive");
            }}
            className="flex items-center gap-[0.5rem] px-[1rem] py-[0.4rem] rounded-full border border-amber-600/50 bg-[#1a0f08]/85 text-amber-300 hover:text-white hover:border-amber-300 transition-all cursor-pointer shadow-lg backdrop-blur-md text-[0.75rem] font-cinzel uppercase tracking-wider"
          >
            <ArrowLeft className="w-[0.9rem] h-[0.9rem]" />
            <span>Return to Archive</span>
          </button>

          <div>
            <span className="font-cinzel text-[0.65rem] uppercase tracking-[0.25em] text-[#d69a62] font-bold">
              Immersive 2D Relic Sanctuary
            </span>
            <h1 className="font-cinzel text-[1.4rem] sm:text-[1.8rem] font-black text-white leading-none">
              THE CURIOSITY CABINET
            </h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-[0.5rem] text-[0.75rem] text-amber-200/80 bg-[#140b06]/85 px-[1rem] py-[0.35rem] rounded-full border border-amber-500/30">
          <span className="w-[0.45rem] h-[0.45rem] rounded-full bg-amber-400 animate-pulse shadow-[0_0_0.5rem_#fbbf24]" />
          <span className="font-cormorant italic text-[0.85rem]">
            Slide 3 doors with mouse · Drag relics to store · 3D door on right
          </span>
        </div>
      </header>

      {/* ===================================================================
          3. MAIN INTERACTION: 3-BAY CLASSICAL CABINET + PROFESSOR GRIM + 3D DOOR
          =================================================================== */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-[1.25rem] w-full max-w-[88rem] mx-auto my-auto overflow-y-auto py-[0.5rem]">

        {/* -----------------------------------------------------------------
            A. THE 3-BAY CLASSICAL MAHOGANY CABINET (media_1792857689562_cc70f99d.jpg)
            ----------------------------------------------------------------- */}
        <section className="relative flex-1 w-full max-w-[48rem] flex flex-col items-center">
          
          {/* Ornate Classical Frieze Top Header with Reference Woodwork */}
          <div className="w-full relative flex items-center justify-between px-[1.5rem] py-[0.6rem] bg-gradient-to-r from-[#3b0d11] via-[#5c161c] to-[#3b0d11] border-2 border-b-0 border-[#d69a62]/60 rounded-t-2xl shadow-2xl">
            <div className="flex items-center gap-[0.5rem]">
              <span className="w-[0.6rem] h-[0.6rem] rounded-full bg-[#d69a62] border border-amber-200" />
              <span className="font-cinzel text-[0.75rem] tracking-[0.25em] uppercase text-amber-200 font-bold">
                Classical Apothecary of Relics · Anno MMXXVI
              </span>
            </div>
            <span className="font-snell text-[1.1rem] text-[#d69a62] italic hidden sm:inline">
              "Curiosity preserved forever."
            </span>
          </div>

          {/* Continuous Classical Architrave Rail */}
          <div className="w-full h-[0.45rem] bg-gradient-to-r from-[#4a1216] via-[#d69a62] to-[#4a1216] border-y border-amber-200/50 shadow-inner" />

          {/* Cabinet Main Body: 3 Classical Bays (Left, Center, Right) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-[0.5rem] p-[0.65rem] bg-[#1a0709] border-2 border-y-0 border-[#d69a62]/60 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.95)]">
            
            {/* -------------------- BAY 1: RESOURCES -------------------- */}
            <div
              onDragOver={(e) => handleDrawerDragOver(e, "resources")}
              onDragLeave={handleDrawerDragLeave}
              onDrop={(e) => handleDrawerDrop(e, "resources")}
              className={`relative h-[19rem] rounded-xl border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                activeDragDrawer === "resources"
                  ? "border-amber-400 bg-amber-950/70 ring-2 ring-amber-300"
                  : "border-[#5c161c] bg-[#120406]"
              }`}
            >
              {/* Classical Fluted Pilaster Cap Header */}
              <div className="relative z-10 flex items-center justify-between px-[0.75rem] py-[0.4rem] bg-gradient-to-b from-[#4a1216] to-[#2b0a0d] border-b border-[#d69a62]/40">
                <div className="flex items-center gap-[0.35rem]">
                  <BookOpen className="w-[0.8rem] h-[0.8rem] text-amber-400" />
                  <span className="font-cinzel text-[0.7rem] uppercase tracking-wider font-bold text-amber-200">
                    I. Resources
                  </span>
                </div>
                <span className="font-mono text-[0.6rem] px-[0.4rem] py-[0.05rem] rounded-full bg-black/60 text-amber-300 border border-amber-600/40">
                  {cabinetItems.resources.length} items
                </span>
              </div>

              {/* Upper & Middle Shelves (Illuminated Interior) */}
              <div className="relative flex-1 p-[0.65rem] overflow-y-auto space-y-[0.45rem] bg-[radial-gradient(ellipse_at_top,_#4a1216_0%,_#150406_90%)]">
                {cabinetItems.resources.map((item) => (
                  <div
                    key={item.id}
                    className="p-[0.5rem] rounded-lg border border-amber-500/30 bg-[#290a0d]/85 text-[0.7rem] shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-100 font-cinzel truncate">
                        {item.title}
                      </span>
                      <span className="text-[0.55rem] font-mono text-amber-400/80">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[0.65rem] text-stone-300 mt-[0.15rem] line-clamp-2 italic">
                      {item.note}
                    </p>
                  </div>
                ))}
                <div className="text-center pt-[0.25rem] text-[0.58rem] font-mono text-amber-400/60 uppercase">
                  ↓ Drop Manuscripts to Store Here
                </div>
              </div>

              {/* SLIDING MAHOGANY LOWER CUPBOARD DOOR (Mouse Dragged) */}
              <div
                className="absolute inset-y-[1.8rem] inset-x-0 bg-gradient-to-r from-[#380e12] via-[#52151b] to-[#26090c] border-2 border-amber-600/60 shadow-2xl flex flex-col justify-between p-[0.75rem] transition-transform duration-75 cursor-grab active:cursor-grabbing select-none"
                style={{
                  transform: `translateX(-${doorProgress.resources * 82}%)`,
                }}
                onPointerDown={(e) => handleSliderDragStart(e, "resources")}
              >
                <div className="flex-1 rounded-lg border border-amber-600/30 bg-[#1c0608]/70 p-[0.5rem] flex flex-col justify-between">
                  <div className="text-center font-cinzel text-[0.65rem] uppercase tracking-widest text-amber-300 font-bold">
                    Mahogany Panel Door
                  </div>

                  <div className="self-end my-auto flex flex-col items-center gap-[0.25rem] bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 p-[0.25rem] px-[0.45rem] rounded-md shadow-lg border border-amber-200">
                    <span className="w-[0.25rem] h-[0.75rem] bg-amber-950 rounded-full" />
                    <span className="text-[0.55rem] font-mono text-amber-950 font-bold uppercase">
                      Slide ⇄
                    </span>
                  </div>

                  <div className="text-right text-[0.55rem] font-mono text-amber-400/70">
                    {Math.round(doorProgress.resources * 100)}% Open
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------- BAY 2: TOOLS -------------------- */}
            <div
              onDragOver={(e) => handleDrawerDragOver(e, "tools")}
              onDragLeave={handleDrawerDragLeave}
              onDrop={(e) => handleDrawerDrop(e, "tools")}
              className={`relative h-[19rem] rounded-xl border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                activeDragDrawer === "tools"
                  ? "border-sky-400 bg-sky-950/70 ring-2 ring-sky-300"
                  : "border-[#5c161c] bg-[#120406]"
              }`}
            >
              <div className="relative z-10 flex items-center justify-between px-[0.75rem] py-[0.4rem] bg-gradient-to-b from-[#18263e] to-[#0c1422] border-b border-sky-400/40">
                <div className="flex items-center gap-[0.35rem]">
                  <Wrench className="w-[0.8rem] h-[0.8rem] text-sky-400" />
                  <span className="font-cinzel text-[0.7rem] uppercase tracking-wider font-bold text-sky-200">
                    II. Tools
                  </span>
                </div>
                <span className="font-mono text-[0.6rem] px-[0.4rem] py-[0.05rem] rounded-full bg-black/60 text-sky-300 border border-sky-600/40">
                  {cabinetItems.tools.length} items
                </span>
              </div>

              <div className="relative flex-1 p-[0.65rem] overflow-y-auto space-y-[0.45rem] bg-[radial-gradient(ellipse_at_top,_#082f49_0%,_#091724_90%)]">
                {cabinetItems.tools.map((item) => (
                  <div
                    key={item.id}
                    className="p-[0.5rem] rounded-lg border border-sky-500/30 bg-[#0d1f35]/85 text-[0.7rem] shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-100 font-cinzel truncate">
                        {item.title}
                      </span>
                      <span className="text-[0.55rem] font-mono text-sky-400/80">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[0.65rem] text-slate-300 mt-[0.15rem] line-clamp-2 italic">
                      {item.note}
                    </p>
                  </div>
                ))}
                <div className="text-center pt-[0.25rem] text-[0.58rem] font-mono text-sky-400/60 uppercase">
                  ↓ Drop Engines & Tools Here
                </div>
              </div>

              {/* SLIDING MAHOGANY LOWER CUPBOARD DOOR */}
              <div
                className="absolute inset-y-[1.8rem] inset-x-0 bg-gradient-to-r from-[#172338] via-[#213554] to-[#121c2e] border-2 border-sky-600/60 shadow-2xl flex flex-col justify-between p-[0.75rem] transition-transform duration-75 cursor-grab active:cursor-grabbing select-none"
                style={{
                  transform: `translateX(-${doorProgress.tools * 82}%)`,
                }}
                onPointerDown={(e) => handleSliderDragStart(e, "tools")}
              >
                <div className="flex-1 rounded-lg border border-sky-500/30 bg-[#0d1624]/70 p-[0.5rem] flex flex-col justify-between">
                  <div className="text-center font-cinzel text-[0.65rem] uppercase tracking-widest text-sky-300 font-bold">
                    Steel & Walnut Shutter
                  </div>

                  <div className="self-end my-auto flex flex-col items-center gap-[0.25rem] bg-gradient-to-b from-sky-200 via-sky-400 to-sky-700 p-[0.25rem] px-[0.45rem] rounded-md shadow-lg border border-sky-200">
                    <span className="w-[0.25rem] h-[0.75rem] bg-sky-950 rounded-full" />
                    <span className="text-[0.55rem] font-mono text-sky-950 font-bold uppercase">
                      Slide ⇄
                    </span>
                  </div>

                  <div className="text-right text-[0.55rem] font-mono text-sky-300/70">
                    {Math.round(doorProgress.tools * 100)}% Open
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- BAY 3: COMPONENTS & ASSETS ---------------- */}
            <div
              onDragOver={(e) => handleDrawerDragOver(e, "components")}
              onDragLeave={handleDrawerDragLeave}
              onDrop={(e) => handleDrawerDrop(e, "components")}
              className={`relative h-[19rem] rounded-xl border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                activeDragDrawer === "components"
                  ? "border-emerald-400 bg-emerald-950/70 ring-2 ring-emerald-300"
                  : "border-[#5c161c] bg-[#120406]"
              }`}
            >
              <div className="relative z-10 flex items-center justify-between px-[0.75rem] py-[0.4rem] bg-gradient-to-b from-[#12281e] to-[#0a1711] border-b border-emerald-400/40">
                <div className="flex items-center gap-[0.35rem]">
                  <Layers className="w-[0.8rem] h-[0.8rem] text-emerald-400" />
                  <span className="font-cinzel text-[0.7rem] uppercase tracking-wider font-bold text-emerald-200">
                    III. Components
                  </span>
                </div>
                <span className="font-mono text-[0.6rem] px-[0.4rem] py-[0.05rem] rounded-full bg-black/60 text-emerald-300 border border-emerald-600/40">
                  {cabinetItems.components.length} items
                </span>
              </div>

              <div className="relative flex-1 p-[0.65rem] overflow-y-auto space-y-[0.45rem] bg-[radial-gradient(ellipse_at_top,_#064e3b_0%,_#062319_90%)]">
                {cabinetItems.components.map((item) => (
                  <div
                    key={item.id}
                    className="p-[0.5rem] rounded-lg border border-emerald-500/30 bg-[#082317]/85 text-[0.7rem] shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-100 font-cinzel truncate">
                        {item.title}
                      </span>
                      <span className="text-[0.55rem] font-mono text-emerald-400/80">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[0.65rem] text-emerald-200 mt-[0.15rem] line-clamp-2 italic">
                      {item.note}
                    </p>
                  </div>
                ))}
                <div className="text-center pt-[0.25rem] text-[0.58rem] font-mono text-emerald-400/60 uppercase">
                  ↓ Drop Sprites & Widgets Here
                </div>
              </div>

              {/* SLIDING MAHOGANY LOWER CUPBOARD DOOR */}
              <div
                className="absolute inset-y-[1.8rem] inset-x-0 bg-gradient-to-r from-[#11241a] via-[#1b3a2a] to-[#0c1c14] border-2 border-emerald-600/60 shadow-2xl flex flex-col justify-between p-[0.75rem] transition-transform duration-75 cursor-grab active:cursor-grabbing select-none"
                style={{
                  transform: `translateX(-${doorProgress.components * 82}%)`,
                }}
                onPointerDown={(e) => handleSliderDragStart(e, "components")}
              >
                <div className="flex-1 rounded-lg border border-emerald-500/30 bg-[#0a1811]/70 p-[0.5rem] flex flex-col justify-between">
                  <div className="text-center font-cinzel text-[0.65rem] uppercase tracking-widest text-emerald-300 font-bold">
                    Pine & Malachite Shutter
                  </div>

                  <div className="self-end my-auto flex flex-col items-center gap-[0.25rem] bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-700 p-[0.25rem] px-[0.45rem] rounded-md shadow-lg border border-emerald-200">
                    <span className="w-[0.25rem] h-[0.75rem] bg-emerald-950 rounded-full" />
                    <span className="text-[0.55rem] font-mono text-emerald-950 font-bold uppercase">
                      Slide ⇄
                    </span>
                  </div>

                  <div className="text-right text-[0.55rem] font-mono text-emerald-300/70">
                    {Math.round(doorProgress.components * 100)}% Open
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Classical Cabinet Plinth Base */}
          <div className="w-full h-[0.5rem] bg-gradient-to-r from-[#4a1216] via-[#d69a62] to-[#4a1216] border-b-2 border-[#d69a62]" />
          <div className="w-full flex justify-between px-[1.5rem]">
            <div className="w-[3rem] h-[0.8rem] bg-[#2b0a0d] rounded-b-lg border border-amber-900 shadow-lg" />
            <div className="w-[3rem] h-[0.8rem] bg-[#2b0a0d] rounded-b-lg border border-amber-900 shadow-lg" />
          </div>
        </section>

        {/* -----------------------------------------------------------------
            B. THE MASCOT TEACHER (PROFESSOR GRIM WITH CHALK & BLACKBOARD)
            ----------------------------------------------------------------- */}
        <aside className="w-full lg:w-[22rem] flex flex-col items-center">
          
          {/* Slate Chalkboard Frame */}
          <div className="w-full rounded-2xl border-4 border-[#5c161c] bg-[#0c1a14] shadow-[0_1rem_3rem_rgba(0,0,0,0.9)] p-[1rem] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#122b20_0%,_#091711_90%)] pointer-events-none opacity-90" />
            
            <div className="relative z-10 flex items-center gap-[0.75rem] border-b border-emerald-800/40 pb-[0.5rem]">
              <div className="relative w-[3rem] h-[3rem] rounded-full bg-gradient-to-tr from-[#132d22] to-[#1e4434] border-2 border-emerald-400 shadow-[0_0_1rem_#34d399] flex items-center justify-center">
                <GraduationCap className="w-[1.6rem] h-[1.6rem] text-emerald-300 animate-bounce" />
                <span className="absolute -bottom-1 -right-1 w-[0.9rem] h-[0.35rem] bg-white rounded-full shadow-sm" title="Chalk" />
              </div>

              <div>
                <div className="flex items-center gap-[0.35rem]">
                  <span className="font-cinzel text-[0.85rem] font-black text-amber-200">
                    PROFESSOR GRIM
                  </span>
                  <span className="text-[0.6rem] font-mono px-[0.35rem] py-[0.05rem] rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                    Archivist Tutor
                  </span>
                </div>
                <div className="font-snell text-[0.95rem] text-emerald-300 italic">
                  "Lectio Reliquiarum"
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-[0.75rem] space-y-[0.5rem]">
              <div className="font-mono text-[0.7rem] text-amber-300/90 tracking-widest text-center border-b border-white/10 pb-[0.25rem]">
                {mascotChalkRune}
              </div>

              <p className="font-snell text-[1.25rem] text-white leading-snug italic drop-shadow-sm min-h-[4rem]">
                "{mascotDialogue}"
              </p>

              <div className="pt-[0.5rem] border-t border-emerald-900/50 flex items-center justify-between text-[0.65rem] font-mono text-emerald-300/80">
                <span>Rule:</span>
                <span className="text-amber-300 font-bold">Drag to slide & store</span>
              </div>
            </div>
          </div>

          {/* Vision Board Relics Tray to Drag into Cabinet */}
          <div className="w-full mt-[0.85rem] p-[0.75rem] rounded-2xl border border-amber-600/35 bg-[#140b07]/90 backdrop-blur-md">
            <div className="flex items-center justify-between mb-[0.35rem]">
              <span className="font-cinzel text-[0.65rem] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-[0.35rem]">
                <Copy className="w-[0.75rem] h-[0.75rem] text-amber-400" />
                Vision Board Relics (Drag to Bays)
              </span>
              <span className="text-[0.55rem] font-mono text-stone-400">
                {currentRelicData.inspirations.length} Available
              </span>
            </div>

            <div className="flex flex-col gap-[0.35rem]">
              {currentRelicData.inspirations.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, item)}
                  className="p-[0.45rem] px-[0.65rem] rounded-lg border border-amber-700/40 bg-[#221008]/80 hover:border-amber-400 hover:bg-[#32170c] transition cursor-grab active:cursor-grabbing flex items-center justify-between text-[0.7rem] shadow-sm"
                >
                  <div className="truncate mr-[0.5rem]">
                    <span className="font-cinzel font-bold text-amber-100 truncate">
                      {item.title}
                    </span>
                    <span className="text-[0.55rem] text-amber-400/80 font-mono ml-[0.35rem]">
                      [{item.category}]
                    </span>
                  </div>
                  <span className="text-[0.55rem] font-mono text-amber-300 uppercase shrink-0">
                    ⇄ Drag
                  </span>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* -----------------------------------------------------------------
            C. THE 3D SANCTUM DOOR TO "US" (User: "a door option in the right-hand side.
               You enter through the door in a 3D way. Then you have a page called us.")
            ----------------------------------------------------------------- */}
        <section className="w-full lg:w-[14rem] flex flex-col items-center justify-center p-[0.75rem] rounded-2xl border-2 border-amber-600/40 bg-gradient-to-b from-[#180d07]/90 to-[#0a0503]/90 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-[0.5rem]">
            <span className="font-snell text-[1.1rem] text-amber-300 italic block">
              Sanctum Passage
            </span>
            <span className="font-cinzel text-[0.65rem] tracking-widest uppercase text-white font-bold">
              Door to "Us"
            </span>
          </div>

          {/* 3D Perspective Door Frame Container */}
          <div
            onClick={handleEnterDoor}
            className="relative w-[9rem] h-[15.5rem] rounded-t-full border-4 border-[#5c161c] bg-[#030201] shadow-[0_1rem_2.5rem_rgba(0,0,0,0.95)] cursor-pointer overflow-hidden group"
            style={{
              perspective: "62.5rem",
            }}
            title="Click or pull to enter through the 3D Door to Us"
          >
            {/* Luminous Interior Beyond Door */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#fde047] via-[#38bdf8] to-[#ffffff] p-[0.5rem] text-center pointer-events-none shadow-inner">
              <Sparkles className="w-[1.75rem] h-[1.75rem] text-amber-900 animate-spin" />
              <span className="font-cinzel text-[0.75rem] font-black text-amber-950 uppercase tracking-widest mt-[0.5rem]">
                Enter Us
              </span>
            </div>

            {/* THE 3D WOODEN DOOR PANEL (Swings inward on 3D Y-Axis) */}
            <div
              className={`absolute inset-0 rounded-t-full bg-gradient-to-r from-[#2c0f12] via-[#43161a] to-[#1c080a] border-2 border-amber-600/70 shadow-2xl flex flex-col justify-between p-[0.75rem] transition-transform duration-700 ease-out select-none ${
                isDoorOpen ? "-rotate-y-[85deg]" : "group-hover:-rotate-y-[22deg]"
              }`}
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                transform: isDoorOpen ? "perspective(56.25rem) rotateY(-82deg)" : undefined,
              }}
            >
              <div className="absolute top-[3rem] left-0 w-[1.5rem] h-[0.35rem] bg-stone-900 border-y border-amber-400" />
              <div className="absolute bottom-[3rem] left-0 w-[1.5rem] h-[0.35rem] bg-stone-900 border-y border-amber-400" />

              <div className="mt-[2.5rem] text-center">
                <div className="w-[1.5rem] h-[1.5rem] mx-auto rounded-full border border-amber-400/60 flex items-center justify-center">
                  <span className="w-[0.45rem] h-[0.45rem] rounded-full bg-amber-400" />
                </div>
                <span className="font-cinzel text-[0.6rem] font-bold uppercase tracking-wider text-amber-200 block mt-[0.35rem]">
                  The Threshold
                </span>
              </div>

              <div className="my-auto self-end mr-[0.5rem] flex flex-col items-center">
                <div className="w-[1rem] h-[1rem] rounded-full border-2 border-amber-300 shadow-md group-hover:scale-110 transition-transform" />
                <div className="w-[0.25rem] h-[0.5rem] bg-amber-400 -mt-[0.2rem] rounded-sm" />
              </div>

              <div className="text-center pb-[0.25rem]">
                <span className="text-[0.55rem] font-mono text-amber-300/80 uppercase tracking-widest">
                  Pull to Open ⟶
                </span>
              </div>
            </div>
          </div>

          <p className="mt-[0.5rem] text-[0.6rem] font-cormorant italic text-amber-200/80 text-center">
            "Step through into the haven of Us."
          </p>
        </section>

      </main>

      {/* 3D Door Transit White-out Flash */}
      {isEnteringDoor && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-gradient-to-tr from-[#fef08a] via-amber-200 to-white animate-in fade-in duration-700">
          <div className="text-center space-y-[0.5rem]">
            <Sparkles className="w-[3rem] h-[3rem] text-amber-900 mx-auto animate-bounce" />
            <h2 className="font-cinzel text-[2rem] font-black text-stone-950 uppercase tracking-[0.2em]">
              Entering "Us"...
            </h2>
            <p className="font-snell text-[1.25rem] text-amber-900 italic">
              Opening the threshold of creators.
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================
          4. FOOTER
          =================================================================== */}
      <footer className="relative z-20 pt-[0.25rem] border-t border-amber-900/30 flex items-center justify-between text-[0.7rem] text-stone-400">
        <div className="flex items-center gap-[0.5rem]">
          <span className="w-[0.35rem] h-[0.35rem] rounded-full bg-amber-400" />
          <span className="font-cinzel text-[0.65rem] uppercase tracking-widest text-[#d69a62]">
            Curiosity Cabinet Mini-Library
          </span>
        </div>
        <span className="font-snell text-[0.95rem] text-amber-200/70 italic hidden sm:inline">
          "Archived for future reincarnations."
        </span>
      </footer>

    </div>
  );
}

export default CuriosityCabinet;
