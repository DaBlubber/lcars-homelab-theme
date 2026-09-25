import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Canvas, COLORS, drawEmblem } from "../shared/raster.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = process.argv[2] ? resolve(process.argv[2]) : join(here, "wallpapers");
await mkdir(outputDir, { recursive: true });

function scaleFor(width, height) {
  return { x: width / 1080, y: height / 2400, unit: Math.min(width / 1080, height / 2400) };
}

function pill(canvas, x, y, width, height, color) {
  canvas.roundedRect(x, y, width, height, height / 2, color);
}

function home(width, height) {
  const canvas = new Canvas(width, height, COLORS.surface1);
  const s = scaleFor(width, height);
  const X = (value) => value * s.x;
  const Y = (value) => value * s.y;
  const U = (value) => value * s.unit;

  canvas.roundedRect(X(22), Y(118), X(70), Y(1760), U(35), COLORS.gold);
  canvas.fillRect(X(56), Y(118), X(370), Y(70), COLORS.gold);
  pill(canvas, X(390), Y(118), X(250), Y(70), COLORS.gold);
  pill(canvas, X(652), Y(118), X(160), Y(70), COLORS.lavender);
  pill(canvas, X(824), Y(118), X(232), Y(70), COLORS.royalBlue);

  canvas.fillRect(X(22), Y(1900), X(70), Y(116), COLORS.lavender);
  canvas.fillRect(X(22), Y(2028), X(70), Y(220), COLORS.blue);
  pill(canvas, X(126), Y(2148), X(280), Y(38), COLORS.gray);
  pill(canvas, X(418), Y(2148), X(172), Y(38), COLORS.gold);
  pill(canvas, X(602), Y(2148), X(210), Y(38), COLORS.lavender);
  pill(canvas, X(824), Y(2148), X(232), Y(38), COLORS.royalBlue);
  drawEmblem(canvas, X(852), Y(1840), U(150));
  return canvas;
}

function lock(width, height) {
  const canvas = new Canvas(width, height, COLORS.surface1);
  const s = scaleFor(width, height);
  const X = (value) => value * s.x;
  const Y = (value) => value * s.y;
  const U = (value) => value * s.unit;

  pill(canvas, X(24), Y(110), X(244), Y(42), COLORS.gray);
  pill(canvas, X(280), Y(110), X(156), Y(42), COLORS.royalBlue);
  pill(canvas, X(448), Y(110), X(270), Y(42), COLORS.lavender);
  pill(canvas, X(730), Y(110), X(326), Y(42), COLORS.gold);

  canvas.roundedRect(X(988), Y(1110), X(68), Y(1030), U(34), COLORS.royalBlue);
  canvas.fillRect(X(580), Y(2072), X(442), Y(68), COLORS.royalBlue);
  pill(canvas, X(450), Y(2072), X(196), Y(68), COLORS.royalBlue);
  pill(canvas, X(666), Y(2160), X(390), Y(36), COLORS.gold);
  pill(canvas, X(430), Y(2160), X(224), Y(36), COLORS.gray);
  pill(canvas, X(126), Y(2160), X(292), Y(36), COLORS.lavender);
  drawEmblem(canvas, X(760), Y(1780), U(168));
  return canvas;
}

const sizes = [[1080, 2400], [1440, 3200], [1080, 1920]];
for (const [width, height] of sizes) {
  for (const [name, render] of [["homescreen", home], ["lockscreen", lock]]) {
    const filename = `${name}-${width}x${height}.png`;
    await writeFile(join(outputDir, filename), render(width, height).png());
    console.log(`Written: ${filename}`);
  }
}
