import { Clock, History, X } from "lucide-react";

export function EpitaphDetailModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-sky-500/30 bg-[#09152b] p-6 md:p-8 shadow-2xl text-slate-100">
        <div className="flex items-start justify-between border-b border-sky-900/50 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400">
              RELIC EPITAPH #{project.id}
            </span>
            <h3 className="mt-1 font-display text-2xl font-black text-white">
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full h-8 w-8 flex items-center justify-center border border-sky-900 text-slate-400 hover:text-white hover:border-sky-400 transition cursor-pointer"
            title="Close epitaph"
          >
            <X size={16} />
          </button>
        </div>

        {/* Current status pill */}
        <div className="my-4 flex items-center justify-between bg-[#061021]/80 rounded-xl p-3 border border-sky-950">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ledger Status:</span>
            <span className="text-xs font-bold uppercase font-compact px-2.5 py-0.5 rounded-full border border-sky-400 text-sky-300 bg-sky-950/40">
              {project.status.toUpperCase()}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Clock size={12} /> Last recorded: {project.updatedAt}
          </span>
        </div>

        {/* The 5 mandatory dimensions */}
        <div className="space-y-3.5 my-5 text-xs leading-relaxed text-slate-200">
          <div className="rounded-2xl border border-sky-900/40 bg-[#061021]/50 p-4">
            <h4 className="font-compact uppercase font-bold tracking-wider text-sky-300 mb-1 text-[11px]">
              1. Original Vision
            </h4>
            <p className="text-sm text-slate-100">{project.vision}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-sky-900/40 bg-[#061021]/50 p-4">
              <h4 className="font-compact uppercase font-bold tracking-wider text-sky-400 mb-1 text-[11px]">
                2. Completed Work
              </h4>
              <p className="text-slate-300">{project.completedWork}</p>
            </div>

            <div className="rounded-2xl border border-sky-900/40 bg-[#061021]/50 p-4">
              <h4 className="font-compact uppercase font-bold tracking-wider text-amber-300 mb-1 text-[11px]">
                3. Unfinished Work
              </h4>
              <p className="text-slate-300">{project.unfinishedWork}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-900/30 bg-rose-950/20 p-4">
            <h4 className="font-compact uppercase font-bold tracking-wider text-rose-300 mb-1 text-[11px]">
              4. Why Development Stopped
            </h4>
            <p className="text-rose-100/90">{project.stopReason}</p>
          </div>

          {/* Preserved Project History Log */}
          <div className="rounded-2xl border border-sky-900/40 bg-[#061021]/50 p-4">
            <h4 className="font-compact uppercase font-bold tracking-wider text-sky-200 mb-2 text-[11px] flex items-center gap-1.5">
              <History size={13} className="text-sky-400" /> 5. Preserved Relic History Log
            </h4>
            <ul className="space-y-2 border-l border-sky-900 pl-3">
              {project.history?.map((entry, idx) => (
                <li key={idx} className="relative text-[11px]">
                  <span className="absolute -left-[17px] top-1.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{entry.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{entry.date}</span>
                  </div>
                  {entry.note && <p className="text-slate-400 mt-0.5">{entry.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-sky-900/40 flex items-center justify-between text-xs text-slate-400">
          <span className="italic font-script text-sky-300 text-sm">
            "Every artifact holds an echo of its maker's intent."
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-sky-950 border border-sky-700 text-sky-200 hover:text-white transition cursor-pointer text-xs font-compact"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
