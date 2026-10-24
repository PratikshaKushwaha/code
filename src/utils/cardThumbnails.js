// =========================================================================
// THUMBNAIL GENERATOR FOR HANGING PROJECT CARDS
// Generates distinct atmospheric artwork for each archived project relic
// =========================================================================

export function getProjectThumbnail(id) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");

  if (id === "relic-1") {
    // ShadowCast: Ephemeral Audio Rooms (Soundwaves in Dark Teal)
    const bg = ctx.createLinearGradient(0, 0, 600, 360);
    bg.addColorStop(0, "#04151f");
    bg.addColorStop(0.5, "#0b2b3a");
    bg.addColorStop(1, "#030a10");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 360);

    // Glowing soundwaves
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#34d399";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    for (let x = 0; x < 600; x += 6) {
      const freq = Math.sin(x * 0.04) * Math.cos(x * 0.02) * 65;
      const y = 180 + freq * Math.sin(x * 0.08);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < 600; x += 6) {
      const freq = Math.cos(x * 0.035) * Math.sin(x * 0.015) * 45;
      const y = 180 + freq;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else if (id === "relic-2") {
    // PhantomGrid: 2D Dungeon Engine (Glowing Labyrinth Grid)
    const bg = ctx.createLinearGradient(0, 0, 600, 360);
    bg.addColorStop(0, "#120824");
    bg.addColorStop(0.5, "#251048");
    bg.addColorStop(1, "#090312");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 360);

    // Isometric / dungeon grid lines
    ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 600; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 360);
      ctx.stroke();
    }
    for (let y = 0; y <= 360; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.stroke();
    }

    // Glowing dungeon glyphs
    ctx.fillStyle = "#f59e0b";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 20;
    ctx.fillRect(180, 120, 60, 60);
    ctx.fillRect(360, 180, 60, 60);
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(270, 150, 60, 60);
  } else if (id === "relic-3") {
    // MoonlightJournal: Dream Cartography (Star Constellations)
    const bg = ctx.createLinearGradient(0, 0, 600, 360);
    bg.addColorStop(0, "#080c18");
    bg.addColorStop(0.5, "#141c30");
    bg.addColorStop(1, "#03060d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 360);

    // Moon glow
    const mGlow = ctx.createRadialGradient(420, 100, 10, 420, 100, 180);
    mGlow.addColorStop(0, "rgba(216, 208, 196, 0.45)");
    mGlow.addColorStop(0.5, "rgba(216, 208, 196, 0.1)");
    mGlow.addColorStop(1, "transparent");
    ctx.fillStyle = mGlow;
    ctx.fillRect(0, 0, 600, 360);

    // Crescent moon
    ctx.fillStyle = "#d8d0c4";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(420, 100, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#141c30";
    ctx.beginPath();
    ctx.arc(405, 92, 45, 0, Math.PI * 2);
    ctx.fill();

    // Constellation lines
    ctx.strokeStyle = "rgba(216, 208, 196, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(100, 240);
    ctx.lineTo(180, 190);
    ctx.lineTo(260, 220);
    ctx.lineTo(320, 160);
    ctx.stroke();

    // Stars
    [
      [100, 240],
      [180, 190],
      [260, 220],
      [320, 160],
      [150, 120],
      [220, 90],
    ].forEach(([sx, sy]) => {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    // CryptKeeper: Dormant Repo Archiver (Gothic Tombstone & Code Matrix)
    const bg = ctx.createLinearGradient(0, 0, 600, 360);
    bg.addColorStop(0, "#1a080a");
    bg.addColorStop(0.5, "#381014");
    bg.addColorStop(1, "#0d0305");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 360);

    // Crimson Blood Moon glow
    ctx.fillStyle = "rgba(185, 71, 75, 0.35)";
    ctx.beginPath();
    ctx.arc(300, 180, 120, 0, Math.PI * 2);
    ctx.fill();

    // Tombstone silhouette
    ctx.fillStyle = "#101820";
    ctx.strokeStyle = "#b9474b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(300, 160, 60, Math.PI, 0);
    ctx.lineTo(360, 290);
    ctx.lineTo(240, 290);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#d8d0c4";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("git memorial", 300, 210);
    ctx.fillText("v0.1.0-dormant", 300, 240);
  }

  // Vignette overlay
  const v = ctx.createRadialGradient(300, 180, 100, 300, 180, 320);
  v.addColorStop(0, "transparent");
  v.addColorStop(1, "rgba(6, 19, 37, 0.75)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, 600, 360);

  return canvas.toDataURL("image/png");
}
