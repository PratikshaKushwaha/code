// =========================================================================
// TEXTURE GENERATOR FOR THREE.JS WEBGL PAGE-CURL SHADER
// Renders ultra-sharp 2x canvas textures based directly on the user's
// uploaded reference image and specifications:
// - Cover Page: Victorian Manor, Full Moon, Jack-o'-lanterns, Tombstone
// - Back Page: Antique Leather & Gold Seal Endpaper
// - Archive Page: Deep Sapphire Blue Vault of Dormant Relics
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

function drawFiligreeCorner(ctx, x, y, size, color, flipX = false, flipY = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = 0.8;

  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(10, size - 10);
  ctx.lineTo(10, 10);
  ctx.lineTo(size - 10, 10);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(10, 10, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Generates the Cover Page texture using the user's reference image
 */
export function createCoverTexture(heroImg, width = 1920, height = 1080) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Draw background reference artwork with high clarity and contrast
  if (heroImg && heroImg.complete && heroImg.naturalWidth > 0) {
    ctx.filter = "brightness(1.08) contrast(1.10)";
    ctx.drawImage(heroImg, 0, 0, width, height);
    ctx.filter = "none";
  } else {
    // Atmospheric fallback gradient
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#101820");
    bg.addColorStop(0.5, "#1e2c38");
    bg.addColorStop(1, "#0a0f16");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  }

  // Subtle left-side dark vignette to ensure typography contrasts with maximum punch
  const vLeft = ctx.createLinearGradient(0, 0, width * 0.55, 0);
  vLeft.addColorStop(0, "rgba(16, 24, 32, 0.92)");
  vLeft.addColorStop(0.45, "rgba(16, 24, 32, 0.65)");
  vLeft.addColorStop(1, "rgba(16, 24, 32, 0)");
  ctx.fillStyle = vLeft;
  ctx.fillRect(0, 0, width, height);

  // Subtle bottom vignette
  const vBottom = ctx.createLinearGradient(0, height * 0.7, 0, height);
  vBottom.addColorStop(0, "transparent");
  vBottom.addColorStop(1, "rgba(16, 24, 32, 0.8)");
  ctx.fillStyle = vBottom;
  ctx.fillRect(0, 0, width, height);

  // Elegant filigree corners in Lantern Gold (#d69a62)
  drawFiligreeCorner(ctx, 40, 40, 60, "#d69a62", false, false);
  drawFiligreeCorner(ctx, width - 40, 40, 60, "#d69a62", true, false);
  drawFiligreeCorner(ctx, 40, height - 40, 60, "#d69a62", false, true);
  drawFiligreeCorner(ctx, width - 40, height - 40, 60, "#d69a62", true, true);

  // Outer framing rule
  ctx.strokeStyle = "rgba(214, 154, 98, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  // Typography Layout (Left Column, directly matching user reference artwork)
  const leftX = 110;
  const maxW = width * 0.44;

  // Header
  ctx.font = "600 15px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#d69a62";
  ctx.textAlign = "left";
  ctx.fillText("LIBER RELIQUIARUM · VOL. I", leftX, 100);

  ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.7)";
  ctx.fillText("|   THE SANCTUARY GATES", leftX + 270, 100);

  // Snell Roundhand Calligraphic Prologue
  ctx.font = "normal 48px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#d69a62";
  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = 12;
  ctx.fillText("Chronicle of the", leftX, 235);
  ctx.shadowBlur = 0;

  // Ornament dash & PROJECT
  ctx.font = "700 18px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.85)";
  ctx.letterSpacing = "0.35em";
  ctx.fillText("—   P R O J E C T   —", leftX, 280);

  // Monumental Chiseled Title "GRAVEYARD" (Stone / Moonlight texture matching reference)
  ctx.font = "900 102px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#d8d0c4";
  ctx.shadowColor = "rgba(0, 0, 0, 1)";
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 8;
  ctx.fillText("GRAVEYARD", leftX - 4, 395);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Literary Subtitle from Reference Image
  ctx.font = "italic 26px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.95)";
  wrapText(
    ctx,
    "A mysterious project where the past never rests. Explore the secrets hidden within the Graveyard.",
    leftX,
    460,
    maxW,
    38
  );

  // Inscribed Epigraph Box (Blood Moon Left Border #b9474b)
  const epiY = 590;
  const epiH = 150;
  ctx.fillStyle = "rgba(16, 24, 32, 0.88)";
  ctx.fillRect(leftX, epiY, maxW, epiH);

  // Left Blood Moon accent rule
  ctx.fillStyle = "#b9474b";
  ctx.fillRect(leftX, epiY, 5, epiH);

  // Border lines
  ctx.strokeStyle = "rgba(214, 154, 98, 0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(leftX, epiY, maxW, epiH);

  ctx.font = "normal 32px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#d8d0c4";
  ctx.fillText(
    '"Every abandoned idea leaves a quiet ghost',
    leftX + 30,
    epiY + 55
  );
  ctx.fillText(
    'waiting for courage."',
    leftX + 30,
    epiY + 95
  );

  ctx.font = "600 12px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#d69a62";
  ctx.fillText("— INSCRIBED IN THE TOMBSTONE LEDGER", leftX + 30, epiY + 130);

  // Interactive Page Turn Invitation (Snell Roundhand)
  const cueY = 820;
  ctx.font = "normal 36px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#d69a62";
  ctx.fillText("Turn the page to enter the archive", leftX, cueY);

  ctx.font = "700 28px 'Cinzel', Georgia, serif";
  ctx.fillText("→", leftX + 490, cueY - 4);

  ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#8a96a0";
  ctx.fillText("Click or drag mouse across the page to peel the folio", leftX, cueY + 36);

  // Footer Rule & Folio Metadata
  ctx.fillStyle = "rgba(214, 154, 98, 0.3)";
  ctx.fillRect(leftX, height - 95, maxW, 1);

  ctx.font = "600 13px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(214, 154, 98, 0.8)";
  ctx.fillText("PAGE 1 · THE SANCTUARY GATES", leftX, height - 68);

  ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.65)";
  ctx.textAlign = "right";
  ctx.fillText("Drag mouse left to peel  →", leftX + maxW, height - 68);

  return canvas.toDataURL("image/png");
}

/**
 * Generates the Backside texture of the page (Parchment & Antique Leather Seal)
 */
export function createBackTexture(width = 1920, height = 1080) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Deep Obsidian and Shrine Crimson gradient
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#101820");
  bg.addColorStop(0.5, "#18222d");
  bg.addColorStop(1, "#571f24");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Filigree Corners in Gold
  drawFiligreeCorner(ctx, 40, 40, 60, "#d69a62", false, false);
  drawFiligreeCorner(ctx, width - 40, 40, 60, "#d69a62", true, false);
  drawFiligreeCorner(ctx, 40, height - 40, 60, "#d69a62", false, true);
  drawFiligreeCorner(ctx, width - 40, height - 40, 60, "#d69a62", true, true);

  // Outer border
  ctx.strokeStyle = "rgba(214, 154, 98, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  // Center Seal
  const cx = width * 0.5;
  const cy = height * 0.44;

  ctx.save();
  ctx.strokeStyle = "rgba(214, 154, 98, 0.4)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(214, 154, 98, 0.2)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, 124, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#d8d0c4";
  ctx.font = "900 42px 'Cinzel', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PG", cx, cy - 10);

  ctx.fillStyle = "#d69a62";
  ctx.font = "600 14px 'Cinzel', Georgia, serif";
  ctx.fillText("· MMXXVI ·", cx, cy + 35);

  ctx.font = "bold 12px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(214, 154, 98, 0.75)";
  ctx.fillText("SANCTUARY OF THE QUIET EMBERS", cx, cy - 160);
  ctx.fillText("LIBER RELIQUIARUM", cx, cy + 170);

  ctx.font = "normal 38px 'Snell Roundhand', 'Pinyon Script', cursive";
  ctx.fillStyle = "#d8d0c4";
  ctx.fillText("To those who began with fire,", cx, height * 0.72);
  ctx.fillText("and rested in silence.", cx, height * 0.77);

  ctx.font = "italic 18px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(216, 208, 196, 0.65)";
  ctx.fillText("Memoriae aeternae operum inceptorum.", cx, height * 0.83);

  ctx.restore();

  return canvas.toDataURL("image/png");
}

/**
 * Generates Page 2: The Archive (In Deep Blue Color, Title Only As Instructed)
 */
export function createArchiveTexture(width = 1920, height = 1080) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Deep Sapphire / Midnight Blue Gradient
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#050e1f");
  bg.addColorStop(0.5, "#081a38");
  bg.addColorStop(1, "#020713");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Soft Radial Nebula Glow in Center-Right
  const radGlow = ctx.createRadialGradient(
    width * 0.65,
    height * 0.45,
    50,
    width * 0.65,
    height * 0.45,
    650
  );
  radGlow.addColorStop(0, "rgba(56, 189, 248, 0.15)");
  radGlow.addColorStop(1, "transparent");
  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, width, height);

  // Filigree Corners in Sky Blue (#38bdf8)
  drawFiligreeCorner(ctx, 40, 40, 60, "#38bdf8", false, false);
  drawFiligreeCorner(ctx, width - 40, 40, 60, "#38bdf8", true, false);
  drawFiligreeCorner(ctx, 40, height - 40, 60, "#38bdf8", false, true);
  drawFiligreeCorner(ctx, width - 40, height - 40, 60, "#38bdf8", true, true);

  // Outer framing rule
  ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  const leftX = 110;
  const maxW = width * 0.52;

  // Header
  ctx.font = "600 15px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#38bdf8";
  ctx.textAlign = "left";
  ctx.fillText("THE ARCHIVE CHAMBER · VOL. II", leftX, 100);

  ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(186, 230, 253, 0.7)";
  ctx.fillText("|   QUIET BLUE REST", leftX + 310, 100);

  // Snell Roundhand Calligraphic Prologue
  ctx.font = "normal 48px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("The Vault of", leftX, 235);

  // Monumental Chiseled Title "THE ARCHIVE"
  ctx.font = "900 102px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 8;
  ctx.fillText("THE ARCHIVE", leftX - 4, 360);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Subtitle
  ctx.font = "italic 26px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(186, 230, 253, 0.95)";
  wrapText(
    ctx,
    "A tranquil blue haven where dormant relics and preserved ideas await their five destinies.",
    leftX,
    430,
    maxW,
    38
  );

  // Inscribed Epigraph Box (Sky Blue Accent)
  const epiY = 560;
  const epiH = 150;
  ctx.fillStyle = "rgba(6, 21, 45, 0.88)";
  ctx.fillRect(leftX, epiY, maxW, epiH);

  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(leftX, epiY, 5, epiH);

  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(leftX, epiY, maxW, epiH);

  ctx.font = "normal 32px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillStyle = "#e0f2fe";
  ctx.fillText(
    '"Nothing is truly lost if its lesson',
    leftX + 30,
    epiY + 55
  );
  ctx.fillText(
    'is remembered."',
    leftX + 30,
    epiY + 95
  );

  ctx.font = "600 12px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
  ctx.fillText("— INSCRIPTION OF THE BLUE VAULT", leftX + 30, epiY + 130);

  // Return Cue
  const cueY = 790;
  ctx.font = "700 28px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("←", leftX, cueY - 4);

  ctx.font = "normal 36px 'Snell Roundhand', 'Pinyon Script', 'Alex Brush', cursive";
  ctx.fillText("Peel back to return to the Sanctuary Gates", leftX + 45, cueY);

  ctx.font = "italic 16px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Click or drag mouse right across the folio to return", leftX, cueY + 36);

  // Footer Rule & Folio
  ctx.fillStyle = "rgba(56, 189, 248, 0.3)";
  ctx.fillRect(leftX, height - 95, maxW, 1);

  ctx.font = "600 13px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
  ctx.fillText("PAGE 2 · THE ARCHIVE", leftX, height - 68);

  ctx.font = "italic 15px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "rgba(186, 230, 253, 0.65)";
  ctx.textAlign = "right";
  ctx.fillText("Drag mouse right to turn back  ←", leftX + maxW, height - 68);

  return canvas.toDataURL("image/png");
}
