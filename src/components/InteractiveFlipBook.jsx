import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ArrowLeftRight } from "lucide-react";
import { CoverPage } from "./CoverPage.jsx";
import { ArchivePage } from "./ArchivePage.jsx";

export function InteractiveFlipBook({
  projects,
  onProjectStatusChange,
  onCreateProject,
  onDeleteProject,
  onInspectProject,
  isFlipped,
  onToggleFlip,
}) {
  const bookRef = useRef(null);
  const dragStartRef = useRef(null);
  const isDraggingRef = useRef(false);
  const currentAngleRef = useRef(0);
  const [dragProgress, setDragProgress] = useState(0);

  // Initialize Lenis for buttery-smooth interaction
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Smooth flip transition when flip state changes
  useEffect(() => {
    const targetAngle = isFlipped ? -180 : 0;
    currentAngleRef.current = targetAngle;

    if (bookRef.current) {
      gsap.to(bookRef.current, {
        rotateY: targetAngle,
        skewY: 0,
        duration: 0.85,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => {
          if (bookRef.current) {
            const rot = gsap.getProperty(bookRef.current, "rotateY");
            setDragProgress(Math.abs(rot / 180));
          }
        },
      });
    }
  }, [isFlipped]);

  // Mouse / Pointer Drag-to-Flip Mechanics
  const handlePointerDown = (e) => {
    // Avoid hijacking drag events when user is dragging an actual project card or typing in an input
    if (
      e.target.closest("article[draggable]") ||
      e.target.closest("div[draggable]") ||
      e.target.closest("form") ||
      e.target.closest("input") ||
      e.target.closest("textarea")
    ) {
      return;
    }

    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialAngle: currentAngleRef.current,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !dragStartRef.current || !bookRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const windowWidth = window.innerWidth || 1000;
    const deltaRatio = deltaX / (windowWidth * 0.65);

    // Calculate real-time interactive rotation
    const baseAngle = isFlipped ? -180 : 0;
    let newAngle = baseAngle + deltaRatio * 180;

    // Clamp angle between -180 and 0
    newAngle = Math.max(-180, Math.min(0, newAngle));
    currentAngleRef.current = newAngle;

    // Apply paper curvature bend using sine curve
    const bendSkew = Math.sin((Math.abs(newAngle) / 180) * Math.PI) * 3;

    gsap.set(bookRef.current, {
      rotateY: newAngle,
      skewY: isFlipped ? -bendSkew : bendSkew,
      overwrite: "auto",
    });

    setDragProgress(Math.abs(newAngle / 180));
  };

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (!bookRef.current) return;

    const currentAngle = currentAngleRef.current;
    let targetAngle;
    let targetFlipped;

    // Threshold: if dragged past ~25%, complete the flip
    if (!isFlipped) {
      if (currentAngle < -45) {
        targetAngle = -180;
        targetFlipped = true;
      } else {
        targetAngle = 0;
        targetFlipped = false;
      }
    } else {
      if (currentAngle > -135) {
        targetAngle = 0;
        targetFlipped = false;
      } else {
        targetAngle = -180;
        targetFlipped = true;
      }
    }

    currentAngleRef.current = targetAngle;
    onToggleFlip(targetFlipped);

    gsap.to(bookRef.current, {
      rotateY: targetAngle,
      skewY: 0,
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        setDragProgress(targetFlipped ? 1 : 0);
      },
    });
  }, [isFlipped, onToggleFlip]);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && !isFlipped) {
        onToggleFlip(true);
      } else if (e.key === "ArrowLeft" && isFlipped) {
        onToggleFlip(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, onToggleFlip]);

  return (
    <div
      className="tome-viewport relative w-full h-[90vh] md:h-[860px] max-w-7xl mx-auto my-auto select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 3D Rotating Book Tome */}
      <div ref={bookRef} className="tome-book">
        {/* Front Face: Page 1 (Home - The Sanctuary Gates) */}
        <div className="tome-sheet bg-black">
          <CoverPage onFlipToArchive={() => onToggleFlip(true)} />
          {/* Dynamic paper curl cast shadow */}
          <div
            className="page-curl-shadow"
            style={{ opacity: dragProgress * 0.85 }}
          />
        </div>

        {/* Back Face: Page 2 (Archive - The Blue Haven) */}
        <div className="tome-sheet tome-sheet-back bg-[#081224]">
          <ArchivePage
            projects={projects}
            onProjectStatusChange={onProjectStatusChange}
            onCreateProject={onCreateProject}
            onDeleteProject={onDeleteProject}
            onInspectProject={onInspectProject}
            onFlipToCover={() => onToggleFlip(false)}
          />
          {/* Dynamic paper curl cast shadow */}
          <div
            className="page-curl-shadow"
            style={{ opacity: (1 - dragProgress) * 0.85 }}
          />
        </div>
      </div>

      {/* Interactive Page Dog-Ear Corner (Visual Grab Indicator) */}
      <div
        className="page-corner-peel"
        title="Click and drag with mouse to peel & flip page"
      >
        <span className="sr-only">Drag with mouse to peel page</span>
      </div>

      {/* Flip Book Controls Pill */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 text-xs font-compact text-slate-400">
        <span className="flex items-center gap-1.5 bg-black/60 px-3.5 py-1.5 rounded-full border border-sky-900/40 backdrop-blur-md">
          <ArrowLeftRight size={13} className="text-sky-400" />
          <span>Click & drag mouse horizontally across book to flip</span>
        </span>
        <span className="text-sky-300 font-script text-sm hidden sm:inline">
          {isFlipped ? "Page 2: The Archive (Blue Haven)" : "Page 1: The Sanctuary Gate"}
        </span>
      </div>
    </div>
  );
}
