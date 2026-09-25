import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Canvas, COLORS } from "../shared/raster.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = process.argv[2] ? resolve(process.argv[2]) : join(here, "icons");
await mkdir(outputDir, { recursive: true });

function base(accent, secondary) {
  const canvas = new Canvas(512, 512, COLORS.surface1);
  canvas.roundedRect(86, 86, 40, 340, 20, accent);
  canvas.fillRect(106, 86, 238, 40, accent);
  canvas.roundedRect(318, 86, 108, 40, 20, accent);
  canvas.roundedRect(146, 386, 174, 32, 16, secondary);
  canvas.roundedRect(330, 386, 96, 32, 16, COLORS.gray);
  return canvas;
}

function gitea(canvas, color) {
  canvas.line(202, 198, 302, 256, 18, color);
  canvas.line(202, 198, 202, 326, 18, color);
  canvas.line(202, 326, 318, 326, 18, color);
  canvas.ellipse(202, 198, 30, 30, color);
  canvas.ellipse(302, 256, 30, 30, color);
  canvas.ellipse(318, 326, 30, 30, color);
}

function jenkins(canvas, color) {
  for (let index = 0; index < 3; index += 1) {
    canvas.roundedRect(174, 172 + index * 62, 164, 38, 19, index === 1 ? COLORS.lavender : color);
    canvas.ellipse(310, 191 + index * 62, 6, 6, COLORS.surface1);
  }
}

function nextcloud(canvas, color) {
  // A cloud with a down arrow of its own instead of yet another stack of lines.
  canvas.ellipse(210, 270, 42, 42, color);
  canvas.ellipse(262, 226, 62, 62, color);
  canvas.ellipse(322, 270, 44, 44, color);
  canvas.roundedRect(170, 260, 194, 70, 35, color);
  canvas.roundedRect(247, 238, 18, 58, 9, COLORS.surface1);
  canvas.polygon([[226, 284], [286, 284], [256, 320]], COLORS.surface1);
}

function immich(canvas, color) {
  const colors = [color, COLORS.gold, COLORS.lavender, COLORS.blue, COLORS.royalBlue, COLORS.gray];
  for (let index = 0; index < 6; index += 1) {
    const angle = (Math.PI * 2 * index) / 6;
    canvas.ellipse(256 + Math.cos(angle) * 64, 256 + Math.sin(angle) * 64, 34, 54, colors[index]);
  }
  canvas.ellipse(256, 256, 30, 30, COLORS.surface1);
}

function jellyfin(canvas, color) {
  canvas.roundedRect(170, 170, 172, 172, 38, color);
  canvas.polygon([[232, 208], [232, 304], [310, 256]], COLORS.surface1);
  canvas.fillRect(190, 184, 132, 12, COLORS.surface1);
  canvas.fillRect(190, 316, 132, 12, COLORS.surface1);
}

function paperless(canvas, color) {
  canvas.roundedRect(192, 158, 128, 188, 8, color);
  canvas.polygon([[282, 158], [320, 196], [282, 196]], COLORS.surface1);
  canvas.fillRect(216, 226, 80, 10, COLORS.surface1);
  canvas.fillRect(216, 254, 80, 10, COLORS.surface1);
  canvas.fillRect(216, 282, 58, 10, COLORS.surface1);
}

function vaultwarden(canvas, color) {
  canvas.polygon([[256, 148], [330, 184], [322, 286], [256, 352], [190, 286], [182, 184]], color);
  canvas.ellipse(256, 238, 26, 26, COLORS.surface1);
  canvas.roundedRect(247, 248, 18, 54, 9, COLORS.surface1);
}

function grafana(canvas, color) {
  canvas.line(180, 326, 180, 188, 14, color);
  canvas.line(180, 326, 338, 326, 14, color);
  canvas.line(202, 292, 242, 246, 18, COLORS.lavender);
  canvas.line(242, 246, 278, 270, 18, COLORS.lavender);
  canvas.line(278, 270, 330, 198, 18, COLORS.lavender);
  canvas.ellipse(202, 292, 12, 12, COLORS.gold);
  canvas.ellipse(242, 246, 12, 12, COLORS.gold);
  canvas.ellipse(278, 270, 12, 12, COLORS.gold);
  canvas.ellipse(330, 198, 12, 12, COLORS.gold);
}

const icons = [
  ["gitea", COLORS.lavender, COLORS.blue, gitea],
  ["jenkins", COLORS.gray, COLORS.gold, jenkins],
  ["nextcloud", COLORS.royalBlue, COLORS.lavender, nextcloud],
  ["immich", COLORS.lavender, COLORS.gold, immich],
  ["jellyfin", COLORS.blue, COLORS.lavender, jellyfin],
  ["paperless", COLORS.gold, COLORS.gray, paperless],
  ["vaultwarden", COLORS.royalBlue, COLORS.gold, vaultwarden],
  ["grafana", COLORS.gold, COLORS.blue, grafana],
];

for (const [name, accent, secondary, draw] of icons) {
  const canvas = base(accent, secondary);
  draw(canvas, secondary);
  await writeFile(join(outputDir, `${name}-512x512.png`), canvas.png());
  console.log(`Written: ${name}-512x512.png`);
}
