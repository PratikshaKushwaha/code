// =========================================================================
// BOOK SPREAD TEXTURE GENERATOR
// Renders ultra-high-resolution 2x canvas textures for the 3D sketchbook
// Designed to match the exact visual direction of ProjectGrim:
// - Snell Roundhand cursive calligraphy
// - Classical Cinzel & Cormorant Garamond typography
// - Palette: Obsidian, Shrine, Blood Moon, Lantern, Mist, Moonlight
// =========================================================================

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y;
}

function drawFiligree(ctx, x, y, size, color, flipX = false, flipY = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.75;

  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(8, size - 8);
  ctx.lineTo(8, 8);
  ctx.lineTo(size - 8, 8);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(8, 8, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function renderCoverSpread(heroImg, width = 1760, height = 1240) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const halfW = width * 0.5;

  // -----------------------------------------------------------------------
  // LEFT PAGE: Inside Cover / Frontispiece Prologue (Shrine & Obsidian Leather)
  // -----------------------------------------------------------------------
  const leftGrad = ctx.createLinearGradient(0, 0, halfW, height);
  leftGrad.addColorStop(0, "#101820");
  leftGrad.addColorStop(0.5, "#18222d");
  leftGrad.addColorStop(1, "#571f24");
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, halfW, height);

  // Subtle parchment texture stipple
  ctx.fillStyle = "rgba(216, 208, 196, 0.015)";
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * halfW;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Corner Filigrees on Left Page
  drawFiligree(ctx, 45, 45, 55, "#d69a62", false, false);
  drawFiligree(ctx, halfW - 45, 45, 55, "#d69a62", true, false);
  drawFiligree(ctx, 45, height - 45, 55, "#d69a62", false, true);
  drawFiligree(ctx, halfW - 45, height - 45, 55, "#d69a62", true, true);

  // Left Page Outer Border
  ctx.strokeStyle = "rgba(214, 154, 98, 0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(55, 55, halfW - 110, height - 110);

  // Center Embossed Seal on Left Page
  ctx.save();
  const sealCenterX = halfW * 0.5;
  const sealCenterY = height * 0.42;

  // Outer and Inner Seal Rings
  ctx.strokeStyle = "rgba(214, 154, 98, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 130, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(214, 154, 98, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 115, 0, Math.PI * 2);
  ctx.stroke();

  // Seal Monogram
  ctx.fillStyle = "#d8d0c4";
  ctx.font = "900 36px 'Cinzel', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PG", sealCenterX, sealCenterY - 10);

  ctx.fillStyle = "#d69a62";
  ctx.font = "600 13px 'Cinzel', Georgia, serif";
  ctx.fillText("· MMXXVI ·", sealCenterX, sealCenterY + 30);

  // Seal Curving Legend
  ctx.font = "bold 11px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(214, 154, 98, 0.75)";
  ctx.fillText("LIBER RELIQUIARUM · VOL. I", sealCenterX, sealCenterY - 145);
  ctx.fillText("SANCTUARY LEDGER OF DORMANT VISIONS", sealCenterX, sealCenterY + 155);

  // Inscription under seal in Snell Roundhand
  ctx.font = "italic 32px 'Snell Roundhand', 'Pinyon Script', cursive";
  ctx.fillStyle = "#d8d0c4";
  ctx.fillText("To those who began with fire,", sealCenterX, height * 0.68);
  ctx.fillText("and rested in silence.", sealCenterX, height * 0.72);

  // Latin Folio epigraph
  ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.6)";
  ctx.fillText("Memoriae aeternae operum inceptorum.", sealCenterX, height * 0.77);

  ctx.restore();

  // -----------------------------------------------------------------------
  // RIGHT PAGE: The Main Cover Page (Moonlit Graveyard Artwork & Title)
  // -----------------------------------------------------------------------
  // Background Graveyard Artwork
  if (heroImg && heroImg.complete && heroImg.naturalWidth > 0) {
    ctx.drawImage(heroImg, halfW, 0, halfW, height);
  } else {
    const bgGrad = ctx.createLinearGradient(halfW, 0, width, height);
    bgGrad.addColorStop(0, "#101820");
    bgGrad.addColorStop(1, "#34404b");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(halfW, 0, halfW, height);
  }

  // Vignette Overlays
  const vBottom = ctx.createLinearGradient(halfW, height * 0.35, halfW, height);
  vBottom.addColorStop(0, "transparent");
  vBottom.addColorStop(0.65, "rgba(16, 24, 32, 0.85)");
  vBottom.addColorStop(1, "rgba(16, 24, 32, 0.98)");
  ctx.fillStyle = vBottom;
  ctx.fillRect(halfW, 0, halfW, height);

  const vLeft = ctx.createLinearGradient(halfW, 0, width, 0);
  vLeft.addColorStop(0, "rgba(16, 24, 32, 0.95)");
  vLeft.addColorStop(0.3, "rgba(16, 24, 32, 0.65)");
  vLeft.addColorStop(0.7, "rgba(87, 31, 36, 0.2)");
  vLeft.addColorStop(1, "rgba(16, 24, 32, 0.4)");
  ctx.fillStyle = vLeft;
  ctx.fillRect(halfW, 0, halfW, height);

  // Filigree Corner Accents on Right Page
  drawFiligree(ctx, halfW + 45, 45, 55, "#d69a62", false, false);
  drawFiligree(ctx, width - 45, 45, 55, "#d69a62", true, false);
  drawFiligree(ctx, halfW + 45, height - 45, 55, "#d69a62", false, true);
  drawFiligree(ctx, width - 45, height - 45, 55, "#d69a62", true, true);

  // Right Page Content
  const textLeft = halfW + 100;
  const maxContentW = halfW - 200;

  // Header
  ctx.font = "600 14px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#d69a62";
  ctx.textAlign = "left";
  ctx.fillText("LIBER RELIQUIARUM · VOL. I", textLeft, 85);

  ctx.font = "italic 14px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.65)";
  ctx.fillText("|   THE SANCTUARY GATES", textLeft + 265, 85);

  ctx.fillStyle = "rgba(214, 154, 98, 0.35)";
  ctx.fillRect(textLeft, 105, maxContentW, 1);

  // Snell Roundhand Calligraphic Prologue
  ctx.font = "normal 52px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#d69a62";
  ctx.fillText("Chronicle of the", textLeft, 240);

  // Monumental Title in Cinzel
  ctx.font = "900 88px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#d8d0c4";
  ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 6;
  ctx.fillText("PROJECT GRIM", textLeft, 335);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Classical Cormorant Garamond Subtitle
  ctx.font = "italic 27px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.92)";
  wrapText(
    ctx,
    "A sanctuary for unfinished projects, paused dreams, and silent codebases laid to rest with dignity.",
    textLeft,
    395,
    maxContentW,
    38
  );

  // Inscribed Epigraph Box
  const epigraphY = 530;
  const epigraphH = 150;
  ctx.fillStyle = "rgba(16, 24, 32, 0.85)";
  ctx.fillRect(textLeft, epigraphY, maxContentW, epigraphH);

  // Epigraph Blood Moon left border rule
  ctx.fillStyle = "#b9474b";
  ctx.fillRect(textLeft, epigraphY, 5, epigraphH);

  // Epigraph top/bottom hairlines
  ctx.fillStyle = "rgba(214, 154, 98, 0.2)";
  ctx.fillRect(textLeft, epigraphY, maxContentW, 1);
  ctx.fillRect(textLeft, epigraphY + epigraphH, maxContentW, 1);
  ctx.fillRect(textLeft + maxContentW, epigraphY, 1, epigraphH);

  // Epigraph text in Snell Roundhand
  ctx.font = "normal 34px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#d8d0c4";
  ctx.fillText(
    '"Every abandoned idea leaves a quiet ghost',
    textLeft + 35,
    epigraphY + 55
  );
  ctx.fillText(
    'waiting for courage."',
    textLeft + 35,
    epigraphY + 95
  );

  ctx.font = "600 12px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(214, 154, 98, 0.8)";
  ctx.fillText("— INSCRIBED IN THE TOMBSTONE LEDGER", textLeft + 35, epigraphY + 130);

  // Page Turn Cue in Snell Roundhand
  const cueY = 760;
  ctx.font = "normal 38px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#d69a62";
  ctx.fillText("Turn the page to enter the archive", textLeft, cueY);

  ctx.font = "700 28px 'Cinzel', Georgia, serif";
  ctx.fillText("→", textLeft + 520, cueY - 4);

  ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#8a96a0";
  ctx.fillText("Click or drag mouse across the folio edge to peel page", textLeft, cueY + 36);

  // Footer Rule & Folio
  ctx.fillStyle = "rgba(214, 154, 98, 0.35)";
  ctx.fillRect(textLeft, height - 110, maxContentW, 1);

  ctx.font = "600 13px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(214, 154, 98, 0.8)";
  ctx.fillText("FRONTISPIECE · COVER PAGE", textLeft, height - 75);

  ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.65)";
  ctx.textAlign = "right";
  ctx.fillText("Drag mouse left to peel  →", textLeft + maxContentW, height - 75);

  // -----------------------------------------------------------------------
  // CENTRAL SPINE CREASE & SHADOW
  // -----------------------------------------------------------------------
  const spineShadow = ctx.createLinearGradient(halfW - 35, 0, halfW + 35, 0);
  spineShadow.addColorStop(0, "rgba(8, 12, 16, 0)");
  spineShadow.addColorStop(0.3, "rgba(8, 12, 16, 0.55)");
  spineShadow.addColorStop(0.5, "rgba(5, 8, 12, 0.92)");
  spineShadow.addColorStop(0.7, "rgba(8, 12, 16, 0.55)");
  spineShadow.addColorStop(1, "rgba(8, 12, 16, 0)");
  ctx.fillStyle = spineShadow;
  ctx.fillRect(halfW - 35, 0, 70, height);

  // Center stitching knots
  ctx.fillStyle = "rgba(214, 154, 98, 0.45)";
  for (let y = 80; y < height - 80; y += 120) {
    ctx.fillRect(halfW - 2, y, 4, 18);
  }

  return canvas.toDataURL("image/png");
}

export function renderArchiveSpread(width = 1760, height = 1240) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const halfW = width * 0.5;

  // -----------------------------------------------------------------------
  // LEFT PAGE: Inside Archival Seal & Reflection (Deep Blue Parchment)
  // -----------------------------------------------------------------------
  const leftGrad = ctx.createLinearGradient(0, 0, halfW, height);
  leftGrad.addColorStop(0, "#050e1f");
  leftGrad.addColorStop(0.6, "#081938");
  leftGrad.addColorStop(1, "#030814");
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, halfW, height);

  // Corner Filigrees on Left Page (Sky Blue)
  drawFiligree(ctx, 45, 45, 55, "#38bdf8", false, false);
  drawFiligree(ctx, halfW - 45, 45, 55, "#38bdf8", true, false);
  drawFiligree(ctx, 45, height - 45, 55, "#38bdf8", false, true);
  drawFiligree(ctx, halfW - 45, height - 45, 55, "#38bdf8", true, true);

  // Left Page Outer Border
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(55, 55, halfW - 110, height - 110);

  // Center Seal on Left Page
  ctx.save();
  const sealCenterX = halfW * 0.5;
  const sealCenterY = height * 0.42;

  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 130, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 115, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 36px 'Cinzel', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AR", sealCenterX, sealCenterY - 10);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "600 13px 'Cinzel', Georgia, serif";
  ctx.fillText("· ARCHIVUM ·", sealCenterX, sealCenterY + 30);

  ctx.font = "bold 11px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
  ctx.fillText("CHAMBER OF QUIET REST · VOL. II", sealCenterX, sealCenterY - 145);
  ctx.fillText("HONORING LESSONS · PROTECTING EMBERS", sealCenterX, sealCenterY + 155);

  ctx.font = "italic 32px 'Snell Roundhand', 'Pinyon Script', cursive";
  ctx.fillStyle = "#e0f2fe";
  ctx.fillText("Here lie the works unfinished,", sealCenterX, height * 0.68);
  ctx.fillText("yet never truly forgotten.", sealCenterX, height * 0.72);

  ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(186, 230, 253, 0.6)";
  ctx.fillText("Dormiunt in pace, resurgant in luce.", sealCenterX, height * 0.77);

  ctx.restore();

  // -----------------------------------------------------------------------
  // RIGHT PAGE: The Archive Page (Title Only As Instructed)
  // -----------------------------------------------------------------------
  const rightGrad = ctx.createLinearGradient(halfW, 0, width, height);
  rightGrad.addColorStop(0, "#061328");
  rightGrad.addColorStop(0.5, "#0b224c");
  rightGrad.addColorStop(1, "#030a17");
  ctx.fillStyle = rightGrad;
  ctx.fillRect(halfW, 0, halfW, height);

  // Radial sapphire glow in top-right
  const rGlow = ctx.createRadialGradient(
    width * 0.75,
    height * 0.35,
    20,
    width * 0.75,
    height * 0.35,
    550
  );
  rGlow.addColorStop(0, "rgba(56, 189, 248, 0.12)");
  rGlow.addColorStop(1, "transparent");
  ctx.fillStyle = rGlow;
  ctx.fillRect(halfW, 0, halfW, height);

  // Filigree Corner Accents on Right Page (Sky Blue)
  drawFiligree(ctx, halfW + 45, 45, 55, "#38bdf8", false, false);
  drawFiligree(ctx, width - 45, 45, 55, "#38bdf8", true, false);
  drawFiligree(ctx, halfW + 45, height - 45, 55, "#38bdf8", false, true);
  drawFiligree(ctx, width - 45, height - 45, 55, "#38bdf8", true, true);

  const textLeft = halfW + 100;
  const maxContentW = halfW - 200;

  // Header
  ctx.font = "600 14px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#38bdf8";
  ctx.textAlign = "left";
  ctx.fillText("THE ARCHIVE CHAMBER · VOL. II", textLeft, 85);

  ctx.font = "italic 14px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(186, 230, 253, 0.65)";
  ctx.fillText("|   QUIET BLUE REST", textLeft + 295, 85);

  ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
  ctx.fillRect(textLeft, 105, maxContentW, 1);

  // Snell Roundhand Calligraphic Prologue
  ctx.font = "normal 52px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("The Vault of", textLeft, 240);

  // Monumental Title in Cinzel
  ctx.font = "900 88px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 6;
  ctx.fillText("THE ARCHIVE", textLeft, 335);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Classical Cormorant Garamond Subtitle
  ctx.font = "italic 27px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(186, 230, 253, 0.9)";
  wrapText(
    ctx,
    "A tranquil blue haven where dormant relics and preserved ideas await their five destinies.",
    textLeft,
    395,
    maxContentW,
    38
  );

  // Inscribed Epigraph Box
  const epigraphY = 530;
  const epigraphH = 150;
  ctx.fillStyle = "rgba(6, 21, 45, 0.85)";
  ctx.fillRect(textLeft, epigraphY, maxContentW, epigraphH);

  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(textLeft, epigraphY, 5, epigraphH);

  ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
  ctx.fillRect(textLeft, epigraphY, maxContentW, 1);
  ctx.fillRect(textLeft, epigraphY + epigraphH, maxContentW, 1);
  ctx.fillRect(textLeft + maxContentW, epigraphY, 1, epigraphH);

  ctx.font = "normal 34px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#e0f2fe";
  ctx.fillText(
    '"Nothing is truly lost if its lesson',
    textLeft + 35,
    epigraphY + 55
  );
  ctx.fillText(
    'is remembered."',
    textLeft + 35,
    epigraphY + 95
  );

  ctx.font = "600 12px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
  ctx.fillText("— INSCRIPTION OF THE BLUE VAULT", textLeft + 35, epigraphY + 130);

  // Page Turn Cue in Snell Roundhand
  const cueY = 760;
  ctx.font = "700 28px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("←", textLeft, cueY - 4);

  ctx.font = "normal 38px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillText("Peel back to return to the Sanctuary Gates", textLeft + 45, cueY);

  ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Click or drag mouse right across the folio to return", textLeft, cueY + 36);

  // Footer Rule & Folio
  ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
  ctx.fillRect(textLeft, height - 110, maxContentW, 1);

  ctx.font = "600 13px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
  ctx.fillText("PAGE 2 · THE ARCHIVE", textLeft, height - 75);

  ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(186, 230, 253, 0.65)";
  ctx.textAlign = "right";
  ctx.fillText("Drag mouse right to turn back  ←", textLeft + maxContentW, height - 75);

  // -----------------------------------------------------------------------
  // CENTRAL SPINE CREASE & SHADOW
  // -----------------------------------------------------------------------
  const spineShadow = ctx.createLinearGradient(halfW - 35, 0, halfW + 35, 0);
  spineShadow.addColorStop(0, "rgba(3, 8, 20, 0)");
  spineShadow.addColorStop(0.3, "rgba(3, 8, 20, 0.6)");
  spineShadow.addColorStop(0.5, "rgba(2, 5, 15, 0.95)");
  spineShadow.addColorStop(0.7, "rgba(3, 8, 20, 0.6)");
  spineShadow.addColorStop(1, "rgba(3, 8, 20, 0)");
  ctx.fillStyle = spineShadow;
  ctx.fillRect(halfW - 35, 0, 70, height);

  // Center stitching knots (Blue thread)
  ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
  for (let y = 80; y < height - 80; y += 120) {
    ctx.fillRect(halfW - 2, y, 4, 18);
  }

  return canvas.toDataURL("image/png");
}
