import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  RotateCcw,
  Play,
  Shuffle,
  Wrench,
  Archive as ArchiveIcon,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getProjectThumbnail } from "../utils/cardThumbnails";
import { VisionBoardModal } from "./VisionBoardModal";
import { CuriosityCabinet } from "./CuriosityCabinet";

// Default in-memory project relics adhering to ProjectGrim specifications
const DEFAULT_PROJECTS = [
  {
    id: "relic-1",
    title: "ShadowCast — Ephemeral Audio Rooms",
    vision: "A voice sanctuary where rooms self-destruct at dawn, leaving only faint echoes.",
    completedWork: "WebRTC peer-to-peer data channels and canvas audio visualizer.",
    unfinishedWork: "Offline notification queue and background audio service.",
    stopReason: "High server costs for TURN relays and solo burnout.",
    status: "resting",
    updatedAt: "2026-03-12",
    history: [
      { action: "Entombed in Graveyard", date: "2026-03-12", note: "Original idea laid to rest." },
    ],
  },
  {
    id: "relic-2",
    title: "PhantomGrid — 2D Dungeon Engine",
    vision: "A retro pixel procedural labyrinth game engine built in WebGL.",
    completedWork: "Tilemap parser, A* pathfinding, and basic physics collider.",
    unfinishedWork: "Particle emitters, boss AI behavior trees, and gamepad input.",
    stopReason: "Freelance work took over and creative momentum dissipated.",
    status: "resting",
    updatedAt: "2025-11-20",
    history: [
      { action: "Entombed in Graveyard", date: "2025-11-20", note: "Draft paused." },
    ],
  },
  {
    id: "relic-3",
    title: "MoonlightJournal — Dream Cartography",
    vision: "Night-mode ambient audio notes that map subconscious murmurings.",
    completedWork: "Waveform visualizer and dark OLED design tokens.",
    unfinishedWork: "Whisper speech-to-text pipeline and cloud sync.",
    stopReason: "API pricing spiked and privacy concerns arose.",
    status: "reimagine",
    updatedAt: "2026-01-08",
    history: [
      { action: "Entombed in Graveyard", date: "2025-08-14", note: "Paused on API costs." },
      { action: "Reimagined via Canvas Protocol", date: "2026-01-08", note: "Changing direction." },
    ],
  },
  {
    id: "relic-4",
    title: "CryptKeeper — Dormant Repo Archiver",
    vision: "A CLI tool that catalogs inactive repositories and drafts memorials.",
    completedWork: "GitHub GraphQL client and static markdown report generator.",
    unfinishedWork: "Interactive terminal UI dashboard and automated tagging.",
    stopReason: "GitHub API rate-limiting hurdles.",
    status: "continue",
    updatedAt: "2026-02-02",
    history: [
      { action: "Entombed in Graveyard", date: "2025-09-30", note: "Hit rate limits." },
      { action: "Resumed via Canvas Protocol", date: "2026-02-02", note: "Selected for continuation." },
    ],
  },
];

// Canvas Protocol Action Altars (Primary mutations executed strictly by dragging cards)
const ACTION_ZONES = [
  {
    id: "revive",
    title: "Revive / Restart",
    subtitle: "Breathe fresh spark into dormant embers",
    icon: RotateCcw,
    borderColor: "border-emerald-500/50",
    activeColor: "bg-emerald-950/85 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400 shadow-[0_0_1.5rem_rgba(16,185,129,0.5)]",
    textColor: "text-emerald-300",
    bgColor: "bg-emerald-950/40",
  },
  {
    id: "continue",
    title: "Continue",
    subtitle: "Pick up the tools where they fell",
    icon: Play,
    borderColor: "border-sky-500/50",
    activeColor: "bg-sky-950/85 border-sky-400 text-sky-200 ring-2 ring-sky-400 shadow-[0_0_1.5rem_rgba(56,189,248,0.5)]",
    textColor: "text-sky-300",
    bgColor: "bg-sky-950/40",
  },
  {
    id: "reimagine",
    title: "Reimagine",
    subtitle: "Pivot thesis to an altered concept",
    icon: Shuffle,
    borderColor: "border-indigo-500/50",
    activeColor: "bg-indigo-950/85 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400 shadow-[0_0_1.5rem_rgba(129,140,248,0.5)]",
    textColor: "text-indigo-300",
    bgColor: "bg-indigo-950/40",
  },
  {
    id: "repurpose",
    title: "Repurpose",
    subtitle: "Salvage parts for another quest",
    icon: Wrench,
    borderColor: "border-amber-500/50",
    activeColor: "bg-amber-950/85 border-amber-400 text-amber-200 ring-2 ring-amber-400 shadow-[0_0_1.5rem_rgba(245,158,11,0.5)]",
    textColor: "text-amber-300",
    bgColor: "bg-amber-950/40",
  },
  {
    id: "archive",
    title: "Let Go / Rest",
    subtitle: "Honor the lesson and lay in peace",
    icon: ArchiveIcon,
    borderColor: "border-blue-400/50",
    activeColor: "bg-blue-950/85 border-blue-300 text-blue-100 ring-2 ring-blue-400 shadow-[0_0_1.5rem_rgba(96,165,250,0.5)]",
    textColor: "text-blue-200",
    bgColor: "bg-blue-950/40",
  },
  {
    id: "oblivion",
    title: "Abyss / Purge",
    subtitle: "Disintegrate permanently from record",
    icon: Trash2,
    borderColor: "border-rose-500/50",
    activeColor: "bg-rose-950/85 border-rose-400 text-rose-200 ring-2 ring-rose-400 shadow-[0_0_1.5rem_rgba(244,63,94,0.5)]",
    textColor: "text-rose-300",
    bgColor: "bg-rose-950/40",
  },
];

export function Archive() {
  const navigate = useNavigate();

  // Relic items state
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem("projectgrim_relics");
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  // Focus & Drag States
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [activeVisionProject, setActiveVisionProject] = useState(null);
  const [activeCabinetProject, setActiveCabinetProject] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState(null);
  const [toast, setToast] = useState(null);

  const hoverDwellTimerRef = useRef(null);

  // User requirement: "once user hovers over the one specific project it then opens another modal magnify the and open Vision Board"
  const handleCardMouseEnter = (project) => {
    setHoveredCardId(project.id);
    if (isDragging) return;
    if (hoverDwellTimerRef.current) clearTimeout(hoverDwellTimerRef.current);
    // Dwell delay allows smooth 3D zoom inspection, then smoothly expands into full Vision Board modal
    hoverDwellTimerRef.current = setTimeout(() => {
      setActiveVisionProject(project);
    }, 600);
  };

  const handleCardMouseLeave = () => {
    setHoveredCardId(null);
    if (hoverDwellTimerRef.current) {
      clearTimeout(hoverDwellTimerRef.current);
      hoverDwellTimerRef.current = null;
    }
  };

  const handleCardClick = (project) => {
    if (isDragging) return;
    if (hoverDwellTimerRef.current) clearTimeout(hoverDwellTimerRef.current);
    setActiveVisionProject(project);
  };

  // Gesture page curl back tracking
  const [isPeelingBack, setIsPeelingBack] = useState(false);
  const [peelProgress, setPeelProgress] = useState(0);
  const peelStartRef = useRef({ x: 0, active: false });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("projectgrim_relics", JSON.stringify(projects));
    } catch {
      // Fallback
    }
  }, [projects]);

  // Keyboard navigation for page flip back (No Buttons)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        triggerTurnBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerTurnBack = () => {
    setIsPeelingBack(true);
    setPeelProgress(1);
    setTimeout(() => {
      navigate("/");
    }, 450);
  };

  // Canvas Protocol: Primary actions executed exclusively by dragging cards into Action Zones
  const handleStatusChange = (projectId, newStatus) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const now = new Date().toISOString().split("T")[0];
        const labels = {
          revive: "Revived / Restarted",
          continue: "Resumed / Continued",
          reimagine: "Reimagined",
          repurpose: "Repurposed",
          archive: "Laid to Peace in Archive",
        };
        const actionName = labels[newStatus] || `Moved to ${newStatus}`;

        return {
          ...p,
          status: newStatus,
          updatedAt: now,
          history: [
            ...(p.history || []),
            {
              action: `${actionName} (Canvas Protocol)`,
              date: now,
              note: `Card dropped into ${newStatus.toUpperCase()} altar.`,
            },
          ],
        };
      })
    );
  };

  const handleDeleteProject = (projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  // Drag Handlers for Hanging Cards
  const handleCardDragStart = (e, project) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", project.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCardDragEnd = () => {
    setIsDragging(false);
    setActiveDropZone(null);
  };

  const handleZoneDragOver = (e, zoneId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeDropZone !== zoneId) setActiveDropZone(zoneId);
  };

  const handleZoneDragLeave = () => {
    setActiveDropZone(null);
  };

  const handleZoneDrop = (e, zoneId) => {
    e.preventDefault();
    setActiveDropZone(null);
    setIsDragging(false);

    const projectId = e.dataTransfer.getData("text/plain");
    if (!projectId) return;

    const targetProject = projects.find((p) => p.id === projectId);
    if (!targetProject) return;

    if (zoneId === "oblivion") {
      handleDeleteProject(projectId);
      setToast({
        type: "purge",
        title: targetProject.title,
        message: "cast into the Abyss (Permanently Purged).",
      });
    } else {
      handleStatusChange(projectId, zoneId);
      const zoneTitle = ACTION_ZONES.find((z) => z.id === zoneId)?.title || zoneId;
      setToast({
        type: "move",
        title: targetProject.title,
        message: `enshrined into ${zoneTitle} via Canvas Protocol.`,
      });
    }

    setTimeout(() => setToast(null), 3500);
  };

  // Gesture Peel Back Handlers (Drag Left Margin to Flip Folio Back)
  const handlePeelPointerDown = (e) => {
    peelStartRef.current = { x: e.clientX, active: true };
    setIsPeelingBack(true);
  };

  const handlePeelPointerMove = (e) => {
    if (!peelStartRef.current.active) return;
    const deltaX = e.clientX - peelStartRef.current.x;
    const progress = Math.min(1, Math.max(0, deltaX / (window.innerWidth * 0.4)));
    setPeelProgress(progress);
  };

  const handlePeelPointerUp = () => {
    if (!peelStartRef.current.active) return;
    peelStartRef.current.active = false;
    if (peelProgress > 0.35) {
      setPeelProgress(1);
      setTimeout(() => {
        navigate("/");
      }, 400);
    } else {
      setPeelProgress(0);
      setIsPeelingBack(false);
    }
  };

  const isFocused = hoveredCardId !== null || isDragging;

  return (
    <div
      onPointerMove={handlePeelPointerMove}
      onPointerUp={handlePeelPointerUp}
      className="relative w-screen h-dvh max-h-dvh bg-[#050e1f] text-slate-100 flex flex-col justify-between overflow-hidden select-none p-[0.75rem] sm:p-[1rem]"
    >
      {/* ===================================================================
          1. FULLSCREEN 3D CINEMATIC BACKGROUND VIDEO (User Sparks Asset)
          =================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          src="/background-sparks.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-all duration-700 ${
            isFocused
              ? "scale-105 filter blur-[0.65rem] brightness-[0.55] opacity-60"
              : "scale-100 filter blur-0 brightness-100 opacity-85"
          }`}
        />
        {/* Deep Sapphire Atmospheric Vignette */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#061325]/75 via-[#081a38]/60 to-[#020713]/85 transition-all duration-700 ${
            isFocused ? "backdrop-blur-[0.35rem] bg-black/55" : "backdrop-blur-none"
          }`}
        />
      </div>

      {/* 3D Page Peel Back Overlay (Animated book flip when dragging spine) */}
      <div
        className="fixed top-0 bottom-0 left-0 pointer-events-none z-50 transition-all duration-300"
        style={{
          width: `${peelProgress * 100}vw`,
          background: "linear-gradient(to right, rgba(16,24,32,0.95), rgba(16,24,32,0.6) 80%, rgba(214,154,98,0.3) 100%)",
          boxShadow: peelProgress > 0 ? "0 0 3rem rgba(0,0,0,0.9)" : "none",
        }}
      />

      {/* ===================================================================
          2. FOLIO SPINE & PAGE-TURN RIBBON (NO BUTTONS — DRAG TO TURN)
          =================================================================== */}
      <div
        onPointerDown={handlePeelPointerDown}
        className="fixed top-0 bottom-0 left-0 w-[2.5rem] sm:w-[3.25rem] z-40 flex flex-col justify-center items-center cursor-ew-resize bg-gradient-to-r from-[#101820]/95 via-[#101820]/80 to-transparent border-r border-[#d69a62]/30 hover:border-[#d69a62]/80 transition-all group"
        title="Drag right to flip page back to Sanctuary Gates"
      >
        <div className="flex flex-col items-center gap-[0.75rem] py-[1rem]">
          <span className="w-[0.35rem] h-[0.35rem] rounded-full bg-[#d69a62] shadow-[0_0_0.5rem_#d69a62]" />
          <div className="[writing-mode:vertical-rl] rotate-180 flex items-center gap-[0.5rem] tracking-[0.25em] text-[#d69a62] font-cinzel text-[0.65rem] uppercase">
            <span>⟵ Folio Spine</span>
            <span className="font-snell text-[0.95rem] tracking-normal lowercase not-italic text-[#d8d0c4]/70">
              drag to turn back
            </span>
          </div>
          <span className="w-[0.35rem] h-[0.35rem] rounded-full bg-[#d69a62] shadow-[0_0_0.5rem_#d69a62]" />
        </div>
      </div>

      {/* ===================================================================
          3. MINIMALIST ATMOSPHERIC HEADER (Archive Name strictly, No AI Slop)
          =================================================================== */}
      <header className="relative z-20 flex items-center justify-between pl-[1.75rem] pr-[1rem] pt-[0.25rem]">
        <div className="flex items-baseline gap-[0.75rem]">
          <h1 className="font-cinzel text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-black text-white tracking-wider drop-shadow-[0_0.2rem_1rem_rgba(0,0,0,0.95)] leading-none">
            ARCHIVE
          </h1>
          <span className="font-snell text-[1.25rem] sm:text-[1.45rem] text-[#38bdf8] italic drop-shadow-md hidden sm:inline">
            Vault of Dormant Relics
          </span>
        </div>

        {/* Tactical Interaction Hint (No Buttons) */}
        <div className="flex items-center gap-[0.5rem] text-[0.75rem] text-sky-200/80 bg-[#081a38]/85 px-[1rem] py-[0.35rem] rounded-full border border-sky-400/30 backdrop-blur-md">
          <span className="w-[0.45rem] h-[0.45rem] rounded-full bg-amber-400 animate-pulse shadow-[0_0_0.5rem_#fbbf24]" />
          <span className="font-cormorant italic text-[0.85rem] text-slate-200">
            Hover to zoom · Drag polaroids to Altars
          </span>
        </div>
      </header>

      {/* Toast Feedback for Canvas Protocol Mutations */}
      {toast && (
        <div
          role="status"
          className="fixed top-[1.25rem] right-[1.25rem] z-50 flex items-center gap-[0.75rem] rounded-2xl border border-sky-400/60 bg-[#07162d]/95 px-[1.25rem] py-[0.65rem] shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2"
        >
          {toast.type === "purge" ? (
            <AlertTriangle className="w-[1.125rem] h-[1.125rem] text-rose-400" />
          ) : (
            <CheckCircle2 className="w-[1.125rem] h-[1.125rem] text-emerald-400" />
          )}
          <div className="text-[0.75rem]">
            <span className="font-bold text-white">{toast.title} </span>
            <span className="text-sky-200">{toast.message}</span>
          </div>
        </div>
      )}

      {/* ===================================================================
          4. 3D FAIRY LIGHTS & HANGING POLAROIDS (Pin Reference Aesthetic)
          =================================================================== */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center w-full pl-[2.5rem] sm:pl-[3.5rem] pr-[0.75rem] overflow-visible my-auto">
        <div className="relative w-full max-w-[85rem] flex flex-col items-center">
          
          {/* Continuous Swaying Fairy Light String Wires (SVG Curves) */}
          <div className="w-full relative h-[3.5rem] overflow-visible pointer-events-none">
            <svg
              className="w-full h-[3.5rem] overflow-visible"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Primary Golden Fairy Wire with organic continuous breeze */}
              <path
                d="M 0 15 Q 150 45, 300 20 T 600 22 T 900 18 T 1200 20"
                stroke="rgba(251, 191, 36, 0.75)"
                strokeWidth="1.8"
                className="animate-[wireBreeze_8s_ease-in-out_infinite_alternate]"
              />
              {/* Secondary Sapphire Wire */}
              <path
                d="M 0 25 Q 150 52, 300 30 T 600 32 T 900 26 T 1200 28"
                stroke="rgba(56, 189, 248, 0.55)"
                strokeWidth="1.2"
                className="animate-[wireBreeze_10s_ease-in-out_infinite_alternate]"
              />
            </svg>

            {/* Glowing Fairy Light Bulbs Spaced along the Wire */}
            <div className="absolute top-[0.65rem] left-0 right-0 flex justify-around pointer-events-none px-[1rem]">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-[0.75rem] h-[0.75rem] rounded-full bg-amber-300 shadow-[0_0_0.75rem_#fbbf24] shadow-[0_0_1.5rem_#f59e0b] animate-[fairyBulbGlow_3s_ease-in-out_infinite]"
                    style={{ animationDelay: `${(i * 0.4) % 3}s` }}
                  />
                  {/* Subtle downward light beam */}
                  <div className="w-[0.1rem] h-[0.5rem] bg-gradient-to-b from-amber-300/60 to-transparent" />
                </div>
              ))}
            </div>
          </div>

          {/* =================================================================
              HANGING POLAROID CARDS (Pure 3D Game / Cinematic Photo Aesthetic)
              ================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.25rem] w-full pt-[0.25rem]">
            {projects.map((project, index) => {
              const isHovered = hoveredCardId === project.id;
              const thumbnail = getProjectThumbnail(project.id);
              const swayAnimation = index % 2 === 0 ? "animate-[hangingCardSway1_7s_ease-in-out_infinite]" : "animate-[hangingCardSway2_8s_ease-in-out_infinite]";

              return (
                <div
                  key={project.id}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => handleCardMouseEnter(project)}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => handleCardClick(project)}
                >
                  {/* Hanging cord from fairy light down to clothespin */}
                  <div className="w-[0.125rem] h-[2rem] bg-gradient-to-b from-amber-400/90 via-amber-200/60 to-slate-200/50" />

                  {/* Golden Glowing Clothespin / Clip (matching Pinterest pin) */}
                  <div className="w-[1.35rem] h-[0.75rem] rounded-t-sm bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#78350f] border border-amber-200 shadow-[0_0_0.5rem_#fbbf24] z-30" />

                  {/* =========================================================
                      THE POLAROID CARD (Zooms on hover, authentic photo frame)
                      ========================================================= */}
                  <article
                    draggable
                    onDragStart={(e) => handleCardDragStart(e, project)}
                    onDragEnd={handleCardDragEnd}
                    className={`relative w-full rounded-xl transition-all duration-500 cursor-grab active:cursor-grabbing ${
                      isHovered
                        ? "scale-[1.25] -translate-y-[0.75rem] z-40 shadow-[0_2rem_4rem_rgba(0,0,0,0.98)] ring-2 ring-amber-300"
                        : `${swayAnimation} shadow-[0_0.75rem_2rem_rgba(0,0,0,0.85)] hover:border-amber-300/80`
                    }`}
                    style={{
                      transformOrigin: "top center",
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      animationPlayState: isHovered ? "paused" : "running",
                    }}
                  >
                    {/* Authentic Polaroid Paper Container */}
                    <div className="bg-[#faf8f4] text-[#1a2332] p-[0.65rem] pb-[0.85rem] rounded-xl border border-stone-300/70 flex flex-col justify-between">
                      
                      {/* Photo Window */}
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-black shadow-inner">
                        <img
                          src={thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover filter brightness-105 contrast-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                        {/* Status Wax Seal Badge in Corner */}
                        <div className="absolute top-[0.45rem] right-[0.45rem]">
                          <span
                            className={`text-[0.6rem] font-bold uppercase tracking-wider px-[0.45rem] py-[0.1rem] rounded-full border shadow-md backdrop-blur-md ${
                              project.status === "revive"
                                ? "border-emerald-600 text-emerald-800 bg-emerald-100/90"
                                : project.status === "continue"
                                ? "border-sky-600 text-sky-800 bg-sky-100/90"
                                : project.status === "reimagine"
                                ? "border-indigo-600 text-indigo-800 bg-indigo-100/90"
                                : project.status === "repurpose"
                                ? "border-amber-600 text-amber-800 bg-amber-100/90"
                                : project.status === "archive"
                                ? "border-blue-600 text-blue-800 bg-blue-100/90"
                                : "border-stone-500 text-stone-700 bg-stone-200/90"
                            }`}
                          >
                            {project.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Polaroid Title Inscription (Snell Roundhand Font) */}
                      <div className="pt-[0.5rem] px-[0.25rem] text-center">
                        <h2 className="font-snell text-[1.35rem] sm:text-[1.45rem] font-bold text-[#1a2332] leading-tight tracking-wide line-clamp-1">
                          {project.title}
                        </h2>
                      </div>

                      {/* Revealed Project Story on Zoom / Hover (No Slop, Pure Core History) */}
                      {isHovered && (
                        <div className="mt-[0.5rem] pt-[0.5rem] border-t border-stone-300 text-[0.72rem] text-[#2d3748] space-y-[0.35rem] animate-in fade-in duration-300 leading-snug">
                          <div>
                            <span className="font-snell text-[0.95rem] text-[#b45309] font-bold mr-[0.25rem]">
                              Vision:
                            </span>
                            <span className="italic">{project.vision}</span>
                          </div>
                          <div className="text-[0.68rem] space-y-[0.15rem] pt-[0.25rem] border-t border-stone-200">
                            <div>
                              <strong className="text-emerald-800 font-semibold">Done: </strong>
                              {project.completedWork}
                            </div>
                            <div>
                              <strong className="text-amber-800 font-semibold">Unfinished: </strong>
                              {project.unfinishedWork}
                            </div>
                            <div className="text-rose-800 italic">
                              <strong>Why Stopped: </strong>
                              {project.stopReason}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tactile Dwell / Magnify Instruction */}
                      <div className="mt-[0.35rem] pt-[0.25rem] border-t border-stone-200 flex items-center justify-between text-[0.6rem] font-mono text-stone-600">
                        <span>RELIC #{project.id}</span>
                        <span className="text-[#0284c7] font-bold">✦ Hover to Magnify</span>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ===================================================================
          5. CLEAN MINIMALIST FOOTER (Altars bar removed per user instructions)
          =================================================================== */}
      <footer className="relative z-20 pb-[0.75rem] pl-[1.75rem] pr-[1rem] flex items-center justify-between text-[0.75rem] text-sky-200/60">
        <span className="font-cormorant italic text-[0.9rem] text-sky-200/80">
          Hover any hanging card to magnify full-screen origins, vision & resources
        </span>
        <span className="font-snell text-[1.1rem] text-[#d69a62] italic hidden sm:inline">
          "Where ideas live forever in light."
        </span>
      </footer>

      {/* ===================================================================
          6. VISION BOARD MAGNIFIED MODAL
          =================================================================== */}
      {activeVisionProject && (
        <VisionBoardModal
          project={activeVisionProject}
          onClose={() => setActiveVisionProject(null)}
          onOpenCabinet={(proj) => {
            setActiveVisionProject(null);
            setActiveCabinetProject(proj);
          }}
        />
      )}

      {/* ===================================================================
          7. IMMERSIVE CURIOSITY CABINET DIRECTLY ON ARCHIVE
          =================================================================== */}
      {activeCabinetProject && (
        <div className="fixed inset-0 z-50 animate-in fade-in zoom-in-95 duration-500">
          <CuriosityCabinet
            project={activeCabinetProject}
            onBackToArchive={() => setActiveCabinetProject(null)}
          />
        </div>
      )}
    </div>
  );
}

export default Archive;
