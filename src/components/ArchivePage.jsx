import { useState } from "react";
import {
  RotateCcw,
  Play,
  Shuffle,
  Wrench,
  Archive,
  Trash2,
  Eye,
  PlusCircle,
  Clock,
  Filter,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export function ArchivePage({
  projects,
  onProjectStatusChange,
  onCreateProject,
  onDeleteProject,
  onInspectProject,
  onFlipToCover,
}) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeZone, setActiveZone] = useState(null);
  const [showInscribeDrawer, setShowInscribeDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New project draft form state
  const [newTitle, setNewTitle] = useState("");
  const [newVision, setNewVision] = useState("");
  const [newCompleted, setNewCompleted] = useState("");
  const [newUnfinished, setNewUnfinished] = useState("");
  const [newStopReason, setNewStopReason] = useState("");

  const zones = [
    {
      id: "revive",
      title: "Revive / Restart",
      subtitle: "Kindle new spark into the embers",
      icon: RotateCcw,
      borderColor: "border-emerald-500/40",
      textColor: "text-emerald-300",
      bgColor: "bg-emerald-950/30",
      glowColor: "hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.35)]",
    },
    {
      id: "continue",
      title: "Continue",
      subtitle: "Pick up the tools where they were left",
      icon: Play,
      borderColor: "border-sky-500/40",
      textColor: "text-sky-300",
      bgColor: "bg-sky-950/30",
      glowColor: "hover:border-sky-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]",
    },
    {
      id: "reimagine",
      title: "Reimagine / Change Idea",
      subtitle: "Pivot the thesis to a fresh concept",
      icon: Shuffle,
      borderColor: "border-indigo-400/40",
      textColor: "text-indigo-300",
      bgColor: "bg-indigo-950/30",
      glowColor: "hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(129,140,248,0.35)]",
    },
    {
      id: "repurpose",
      title: "Repurpose",
      subtitle: "Salvage parts or modules for another quest",
      icon: Wrench,
      borderColor: "border-amber-500/40",
      textColor: "text-amber-300",
      bgColor: "bg-amber-950/30",
      glowColor: "hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.35)]",
    },
    {
      id: "archive",
      title: "Let Go / Archive",
      subtitle: "Honor the lesson and lay in peaceful repose",
      icon: Archive,
      borderColor: "border-blue-400/40",
      textColor: "text-blue-200",
      bgColor: "bg-blue-950/40",
      glowColor: "hover:border-blue-300 hover:shadow-[0_0_25px_rgba(147,197,253,0.35)]",
    },
    {
      id: "oblivion",
      title: "Abyss / Permanent Purge",
      subtitle: "Disintegrate permanently from history",
      icon: Trash2,
      borderColor: "border-rose-500/40",
      textColor: "text-rose-300",
      bgColor: "bg-rose-950/30",
      glowColor: "hover:border-rose-400 hover:shadow-[0_0_25px_rgba(244,63,94,0.35)]",
    },
  ];

  // Drag handlers for Action Zones (Canvas Protocol)
  const handleZoneDragOver = (e, zoneId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeZone !== zoneId) setActiveZone(zoneId);
  };

  const handleZoneDragLeave = () => {
    setActiveZone(null);
  };

  const handleZoneDrop = (e, zoneId) => {
    e.preventDefault();
    setActiveZone(null);

    const projectId = e.dataTransfer.getData("text/plain");
    if (!projectId) return;

    const targetProject = projects.find((p) => p.id === projectId);
    if (!targetProject) return;

    if (zoneId === "oblivion") {
      // Permanent deletion strictly via drag-and-drop
      onDeleteProject(projectId);
      setToastMessage({
        type: "purge",
        title: targetProject.title,
        message: "was released into the Abyss (Permanently Deleted).",
      });
    } else {
      // Status mutation strictly via drag-and-drop
      onProjectStatusChange(projectId, zoneId);
      const zoneTitle = zones.find((z) => z.id === zoneId)?.title || zoneId;
      setToastMessage({
        type: "move",
        title: targetProject.title,
        message: `moved to ${zoneTitle}.`,
      });
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Inscription Altar drop (Creation execution strictly via Canvas Protocol drag-and-drop)
  const handleInscribeDrop = (e) => {
    e.preventDefault();
    setActiveZone(null);

    const isNewDraft = e.dataTransfer.getData("application/x-projectgrim-draft");
    if (!isNewDraft) return;

    if (!newTitle.trim()) {
      setToastMessage({
        type: "error",
        title: "Inscription Incomplete",
        message: "You must provide at least a Project Title before dropping into the Altar.",
      });
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    onCreateProject({
      title: newTitle.trim(),
      vision: newVision.trim() || "Unspecified initial dream.",
      completedWork: newCompleted.trim() || "Concept notes and architectural scaffold.",
      unfinishedWork: newUnfinished.trim() || "Polishing, edge cases, and deployment.",
      stopReason: newStopReason.trim() || "Priorities shifted or energy waned.",
    });

    setToastMessage({
      type: "create",
      title: newTitle.trim(),
      message: "inscribed and enshrined into The Archive ledger.",
    });
    setTimeout(() => setToastMessage(null), 4500);

    // Reset draft fields
    setNewTitle("");
    setNewVision("");
    setNewCompleted("");
    setNewUnfinished("");
    setNewStopReason("");
    setShowInscribeDrawer(false);
  };

  const isDraftReady = newTitle.trim().length > 0;

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === "all" ? true : p.status === filter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vision.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative w-full h-full min-h-[820px] rounded-3xl overflow-hidden border border-sky-900/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between bg-gradient-to-b from-[#081224] via-[#0b172e] to-[#050b16] text-slate-100 p-6 md:p-10 pl-10 md:pl-12 select-none">
      {/* Toast Notification for Canvas Protocol Operations */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-sky-400/50 bg-[#0d1d3a]/95 px-5 py-3 shadow-[0_0_30px_rgba(56,189,248,0.35)] backdrop-blur-md"
        >
          {toastMessage.type === "error" ? (
            <AlertTriangle size={18} className="text-amber-400" />
          ) : (
            <CheckCircle2 size={18} className="text-sky-400" />
          )}
          <div className="text-xs">
            <span className="font-bold text-white">{toastMessage.title} </span>
            <span className="text-slate-300">{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Book Binding Stitch on Left Edge */}
      <div className="absolute top-0 bottom-0 left-0 w-8 z-30 pointer-events-none bg-gradient-to-r from-black/90 via-black/40 to-transparent border-r border-sky-950/80 flex flex-col justify-around items-center py-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-6 rounded-full bg-sky-400/30 border border-sky-300/40 shadow-[0_0_8px_rgba(56,189,248,0.3)]"
          />
        ))}
      </div>

      <div>
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-900/30 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/60 px-3.5 py-1 text-xs text-sky-300 font-compact">
              <Sparkles size={13} className="text-sky-400" />
              <span>Canvas Protocol Interactive Realm</span>
            </div>
            <h2 className="mt-2 text-3xl md:text-5xl font-black font-display tracking-tight text-white drop-shadow-md">
              The Archive
            </h2>
            <p className="mt-1 text-sm text-sky-200/70 font-body max-w-xl">
              Drag any relic card into an Action Zone below to alter its fate. Click a card solely to inspect its epitaph and history.
            </p>
          </div>

          <button
            type="button"
            onClick={onFlipToCover}
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-[#0e2142]/80 px-4 py-2 text-xs font-compact text-sky-200 hover:border-sky-400 hover:text-white transition cursor-pointer shadow-lg"
          >
            <BookOpen size={14} />
            <span>&larr; Flip Back to Home</span>
          </button>
        </div>

        {/* ----------------- ACTION ZONES (Canvas Protocol Drop Targets) ----------------- */}
        <section aria-label="Action Zones" className="my-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase font-compact tracking-widest text-sky-300/80 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              Designated Action Zones — Drag Cards Here to Mutate
            </p>
            <span className="text-[11px] text-sky-300/60 font-script hidden sm:inline">
              "No click can alter fate; only deliberate physical placement."
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {zones.map((zone) => {
              const ZoneIcon = zone.icon;
              const isOver = activeZone === zone.id;
              const countInZone =
                zone.id === "oblivion"
                  ? 0
                  : projects.filter((p) => p.status === zone.id).length;

              return (
                <div
                  key={zone.id}
                  onDragOver={(e) => handleZoneDragOver(e, zone.id)}
                  onDragLeave={handleZoneDragLeave}
                  onDrop={(e) => handleZoneDrop(e, zone.id)}
                  className={`relative flex flex-col justify-between rounded-2xl border p-3.5 min-h-[125px] transition-all duration-300 ${
                    zone.borderColor
                  } ${zone.bgColor} ${zone.glowColor} ${
                    isOver
                      ? "scale-105 border-white bg-sky-900/40 ring-2 ring-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.5)]"
                      : "border-sky-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 border border-white/10 text-white">
                      <ZoneIcon size={16} className={zone.textColor} />
                    </div>
                    {zone.id !== "oblivion" && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 border border-white/5 text-slate-300">
                        {countInZone}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <h3 className="font-display font-bold text-xs tracking-tight text-white">
                      {zone.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {zone.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 text-[9px] font-compact tracking-wider uppercase text-sky-300/80 border-t border-white/5 pt-1 flex items-center justify-between">
                    <span>Drop Zone</span>
                    <span>&darr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ----------------- INSCRIBE NEW PROJECT ALTAR (Canvas Protocol Compliant) ----------------- */}
        <section
          aria-label="New Project Altar"
          className="mb-6 p-4 rounded-2xl border border-dashed border-sky-800/60 bg-[#0a162b]/70 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowInscribeDrawer((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-950/80 px-4 py-2 text-xs font-compact font-bold text-sky-300 shadow hover:border-sky-300 transition cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>{showInscribeDrawer ? "Close Drafting Tablet" : "Prepare New Relic Draft"}</span>
            </button>
            <span className="text-xs text-sky-300/70 hidden md:inline">
              &rarr; Fill draft, then drag the tablet seal into the altar to inscribe
            </span>
          </div>

          {/* Action Zone for Creation Submission: Drop Tablet Seal Here */}
          <div
            onDragOver={(e) => handleZoneDragOver(e, "inscribe-altar")}
            onDragLeave={handleZoneDragLeave}
            onDrop={handleInscribeDrop}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border text-xs font-compact uppercase tracking-wider transition-all duration-300 ${
              activeZone === "inscribe-altar"
                ? "border-sky-300 bg-sky-900/50 scale-105 ring-2 ring-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.5)]"
                : "border-sky-800/60 bg-[#0d203e]/80 text-sky-200"
            }`}
          >
            <Sparkles size={14} className="text-sky-300 animate-pulse" />
            <span>Drop Sealed Tablet Here to Inscribe</span>
          </div>
        </section>

        {/* ----------------- INSCRIBE DRAFTING DRAWER ----------------- */}
        {showInscribeDrawer && (
          <div className="mb-6 p-5 rounded-2xl border border-sky-500/30 bg-[#0b1b36] shadow-2xl">
            <div className="flex items-center justify-between border-b border-sky-800/40 pb-2 mb-3">
              <h3 className="font-display text-sm font-bold text-sky-200 uppercase tracking-wider">
                Draft New Abandoned Relic (Fill All 5 Dimensions)
              </h3>
              <span className="text-[11px] text-sky-400/80 font-mono">
                {isDraftReady ? "✓ Ready to Drag & Seal" : "Fill required fields"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  1. What the project was (Title / One-liner) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. StarMap — 3D procedural sky generator"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-sky-900 bg-[#061021] px-3 py-2 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  2. Original Vision (The grand dream) *
                </label>
                <input
                  type="text"
                  placeholder="What did you originally envision building?"
                  value={newVision}
                  onChange={(e) => setNewVision(e.target.value)}
                  className="w-full rounded-xl border border-sky-900 bg-[#061021] px-3 py-2 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  3. Completed Work (What was built)
                </label>
                <input
                  type="text"
                  placeholder="Working algorithms, APIs, UI mocks..."
                  value={newCompleted}
                  onChange={(e) => setNewCompleted(e.target.value)}
                  className="w-full rounded-xl border border-sky-900 bg-[#061021] px-3 py-2 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  4. Unfinished Work (What remains)
                </label>
                <input
                  type="text"
                  placeholder="Testing, payments, responsive polish..."
                  value={newUnfinished}
                  onChange={(e) => setNewUnfinished(e.target.value)}
                  className="w-full rounded-xl border border-sky-900 bg-[#061021] px-3 py-2 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">
                  5. Why Development Stopped (The obstacle) *
                </label>
                <input
                  type="text"
                  placeholder="Burnout, lack of time, tech hurdle, idea pivoted..."
                  value={newStopReason}
                  onChange={(e) => setNewStopReason(e.target.value)}
                  className="w-full rounded-xl border border-sky-900 bg-[#061021] px-3 py-2 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Draggable Tablet Seal to execute submission (Canvas Protocol compliant — NO click button!) */}
            <div className="mt-4 pt-3 border-t border-sky-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                To execute inscription, drag the seal below into the "Drop Sealed Tablet Here" altar above:
              </span>

              <div
                draggable={isDraftReady}
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/x-projectgrim-draft", "new-draft");
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-compact font-bold uppercase tracking-wider transition select-none ${
                  isDraftReady
                    ? "bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-lg shadow-sky-500/20 cursor-grab active:cursor-grabbing hover:scale-105"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
                title={isDraftReady ? "Drag this seal into the Altar to inscribe!" : "Fill title first"}
              >
                <Sparkles size={14} />
                <span>📜 Sealed Draft Tablet (Drag to Inscribe)</span>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- FILTER & SEARCH CONTROLS ----------------- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-compact">
            <span className="text-sky-300/80 mr-1 flex items-center gap-1">
              <Filter size={12} /> Filter:
            </span>
            {["all", "resting", "revive", "continue", "reimagine", "repurpose", "archive"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs transition cursor-pointer ${
                  filter === f
                    ? "bg-sky-400 text-slate-950 font-bold shadow"
                    : "bg-[#0c1a33] text-slate-400 hover:text-white border border-sky-900/40"
                }`}
              >
                {f === "all" ? "All Relics" : f.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400/60" />
            <input
              type="text"
              placeholder="Search title or vision..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-sky-900 bg-[#061021] pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
            />
          </div>
        </div>

        {/* ----------------- RELIC CARDS GRID (Draggable Data Cards) ----------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            return (
              <article
                key={project.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", project.id);
                }}
                className="group relative flex flex-col justify-between rounded-2xl border border-sky-900/40 bg-[#09152b]/80 p-4.5 shadow-lg transition-all duration-300 hover:border-sky-400/50 hover:-translate-y-1 cursor-grab active:cursor-grabbing backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-sky-950 pb-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400/70">
                      RELIC #{project.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold font-compact uppercase px-2 py-0.5 rounded-full border ${
                        project.status === "revive"
                          ? "border-emerald-400 text-emerald-300 bg-emerald-950/40"
                          : project.status === "continue"
                          ? "border-sky-400 text-sky-300 bg-sky-950/40"
                          : project.status === "reimagine"
                          ? "border-indigo-400 text-indigo-300 bg-indigo-950/40"
                          : project.status === "repurpose"
                          ? "border-amber-400 text-amber-300 bg-amber-950/40"
                          : project.status === "archive"
                          ? "border-blue-400 text-blue-300 bg-blue-950/40"
                          : "border-slate-500 text-slate-300 bg-slate-900/40"
                      }`}
                    >
                      {project.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="mt-2.5 font-display text-base font-bold text-white group-hover:text-sky-300 transition">
                    {project.title}
                  </h4>

                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300 line-clamp-2">
                    <span className="text-sky-300/80 font-medium">Vision: </span>
                    {project.vision}
                  </p>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-400 border-t border-sky-950 pt-2.5">
                    <div className="truncate">
                      <span className="text-slate-300 font-semibold">Done: </span>
                      {project.completedWork}
                    </div>
                    <div className="truncate">
                      <span className="text-amber-300/90 font-semibold">Unfinished: </span>
                      {project.unfinishedWork}
                    </div>
                    <div className="truncate italic text-rose-300/90">
                      <span>Stopped: </span>
                      {project.stopReason}
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-sky-950 pt-2.5">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock size={11} />
                    <span>{project.updatedAt}</span>
                  </div>

                  {/* Non-mutating inspect control allowed by Canvas Protocol */}
                  <button
                    type="button"
                    onClick={() => onInspectProject(project)}
                    className="flex items-center gap-1 text-xs text-sky-300 hover:text-white transition cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Inspect</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="my-8 text-center py-10 rounded-2xl border border-dashed border-sky-900/50 bg-[#061021]/60">
            <p className="text-sm text-sky-200 font-display">No relics found in this category.</p>
            <p className="text-xs text-slate-400 mt-1">Try switching the filter or inscribe a new idea.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-sky-900/30 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span className="font-script text-sm text-sky-300">
          "The graveyard is not an end, but the soil of future marvels."
        </span>
        <span className="font-mono text-sky-400/80">
          Canvas Protocol Enforced · Drag cards into zones to mutate fate
        </span>
      </footer>
    </div>
  );
}
