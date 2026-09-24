import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Canvas, COLORS, drawEmblem } from "../shared/raster.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = process.argv[2] ? resolve(process.argv[2]) : join(here, "wallpapers");
await mkdir(outputDir, { recursive: true });

function scaleFor(width, height) {
  return { x: width / 1920, y: height / 1080, unit: Math.min(width / 1920, height / 1080) };
}

function pill(canvas, x, y, width, height, color) {
  canvas.roundedRect(x, y, width, height, height / 2, color);
}

function motifRahmen(width, height) {
  const canvas = new Canvas(width, height, COLORS.surface1);
  const s = scaleFor(width, height);
  const X = (value) => value * s.x;
  const Y = (value) => value * s.y;
  const U = (value) => value * s.unit;

  canvas.roundedRect(X(34), Y(38), X(76), Y(790), U(38), COLORS.gold);
  canvas.fillRect(X(72), Y(38), X(620), Y(76), COLORS.gold);
  pill(canvas, X(640), Y(38), X(190), Y(76), COLORS.gold);
  pill(canvas, X(842), Y(38), X(310), Y(76), COLORS.lavender);
  pill(canvas, X(1164), Y(38), X(148), Y(76), COLORS.gray);
  pill(canvas, X(1324), Y(38), X(320), Y(76), COLORS.blue);
  pill(canvas, X(1656), Y(38), X(230), Y(76), COLORS.royalBlue);

  pill(canvas, X(124), Y(872), X(284), Y(34), COLORS.gray);
  pill(canvas, X(420), Y(872), X(164), Y(34), COLORS.blue);
  pill(canvas, X(596), Y(872), X(402), Y(34), COLORS.lavender);
  pill(canvas, X(1010), Y(872), X(210), Y(34), COLORS.gold);
  pill(canvas, X(1232), Y(872), X(410), Y(34), COLORS.royalBlue);
  pill(canvas, X(1654), Y(872), X(232), Y(34), COLORS.gray);

  canvas.fillRect(X(34), Y(838), X(76), Y(18), COLORS.royalBlue);
  canvas.fillRect(X(34), Y(862), X(76), Y(44), COLORS.lavender);
  drawEmblem(canvas, X(1662), Y(650), U(170));
  return canvas;
}

function motifSignal(width, height) {
  const canvas = new Canvas(width, height, COLORS.surface1);
  const s = scaleFor(width, height);
  const X = (value) => value * s.x;
  const Y = (value) => value * s.y;
  const U = (value) => value * s.unit;

  pill(canvas, X(34), Y(42), X(330), Y(44), COLORS.royalBlue);
  pill(canvas, X(376), Y(42), X(126), Y(44), COLORS.gray);
  pill(canvas, X(514), Y(42), X(458), Y(44), COLORS.gold);
  pill(canvas, X(984), Y(42), X(240), Y(44), COLORS.lavender);
  pill(canvas, X(1236), Y(42), X(344), Y(44), COLORS.blue);

  canvas.roundedRect(X(1810), Y(136), X(76), Y(676), U(38), COLORS.royalBlue);
  canvas.fillRect(X(1300), Y(736), X(548), Y(76), COLORS.royalBlue);
  pill(canvas, X(1170), Y(736), X(196), Y(76), COLORS.royalBlue);
  pill(canvas, X(1430), Y(824), X(456), Y(34), COLORS.gold);
  pill(canvas, X(1194), Y(824), X(224), Y(34), COLORS.gray);
  pill(canvas, X(818), Y(824), X(364), Y(34), COLORS.lavender);

  canvas.fillRect(X(1810), Y(92), X(76), Y(30), COLORS.gold);
  canvas.fillRect(X(1810), Y(824), X(76), Y(34), COLORS.lavender);
  drawEmblem(canvas, X(90), Y(690), U(168));
  return canvas;
}

const sizes = [[1920, 1080], [2560, 1440], [3840, 2160]];
const motifs = [["rahmen", motifRahmen], ["signal", motifSignal]];
for (const [width, height] of sizes) {
  for (const [name, render] of motifs) {
    const filename = `${name}-${width}x${height}.png`;
    await writeFile(join(outputDir, filename), render(width, height).png());
    console.log(`Erzeugt: ${filename}`);
  }
}
