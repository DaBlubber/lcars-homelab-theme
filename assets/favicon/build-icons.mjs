import { mkdir, readFile, writeFile } from "node:fs/promises";
import { deflateSync } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "..", "emblem.svg");
const COLORS = Object.freeze({
  blue: [23, 64, 188, 255],
  dark: [43, 47, 56, 255],
  gold: [234, 165, 73, 255],
  goldShadow: [185, 130, 47, 255],
  gray: [107, 114, 128, 255],
  nearBlack: [16, 19, 26, 255],
});

function crc32(data) {
  let crc = 0xffffffff;
  for (const value of data) {
    crc ^= value;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const result = Buffer.alloc(12 + data.length);
  result.writeUInt32BE(data.length, 0);
  name.copy(result, 4);
  data.copy(result, 8);
  result.writeUInt32BE(crc32(Buffer.concat([name, data])), 8 + data.length);
  return result;
}

function encodePng(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const rows = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y += 1) {
    pixels.copy(rows, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(rows, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function cubic(a, b, c, d, t) {
  const u = 1 - t;
  return u ** 3 * a + 3 * u ** 2 * t * b + 3 * u * t ** 2 * c + t ** 3 * d;
}

function shieldPoints(inner) {
  /* Neutrales Emblem: abgerundetes Quadrat statt Emblemschild. */
  const [left, top, size, radius] = inner ? [15, 23, 70, 10] : [10, 18, 80, 14];
  const points = [];
  const corners = [
    [left + size - radius, top + radius, -90], [left + size - radius, top + size - radius, 0],
    [left + radius, top + size - radius, 90], [left + radius, top + radius, 180],
  ];
  for (const [cx, cy, start] of corners) {
    for (let step = 0; step <= 12; step += 1) {
      const angle = ((start + (step / 12) * 90) * Math.PI) / 180;
      points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
  }
  return points;
}

const outerShield = shieldPoints(false);
const innerShield = shieldPoints(true);
const stair = [[20, 46], [36, 46], [36, 58], [52, 58], [52, 70], [68, 70], [68, 82], [84, 82], [84, 98]];
const branch = [];
for (let step = 0; step <= 32; step += 1) {
  const t = step / 32;
  const u = 1 - t;
  branch.push([
    u ** 2 * 50 + 2 * u * t * 58 + t ** 2 * 68,
    u ** 2 * 66 + 2 * u * t * 66 + t ** 2 * 69,
  ]);
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length2 = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / length2));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function distanceToPath(x, y, points) {
  let distance = Infinity;
  for (let i = 0; i + 1 < points.length; i += 1) {
    distance = Math.min(distance, distanceToSegment(x, y, ...points[i], ...points[i + 1]));
  }
  return distance;
}

function inRect(x, y, left, top, width, height) {
  return x >= left && x <= left + width && y >= top && y <= top + height;
}

function inRoundedRect(x, y, left, top, width, height, radius) {
  if (!inRect(x, y, left, top, width, height)) return false;
  const cx = Math.max(left + radius, Math.min(x, left + width - radius));
  const cy = Math.max(top + radius, Math.min(y, top + height - radius));
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function inCircle(x, y, cx, cy, radius) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

const crownRects = [
  [6, 16, 20, 18], [6, 6, 7, 10], [19, 6, 7, 10],
  [74, 16, 20, 18], [74, 6, 7, 10], [87, 6, 7, 10],
  [26, 22, 48, 12], [30, 14, 6, 8], [44, 14, 6, 8], [58, 14, 6, 8],
];

function crownColor(x, y) {
  let color = null;
  for (const [left, top, width, height] of crownRects) {
    if (!inRect(x, y, left - 0.5, top - 0.5, width + 1, height + 1)) continue;
    const fill = inRect(x, y, left + 0.5, top + 0.5, width - 1, height - 1);
    color = fill ? COLORS.gray : COLORS.dark;
  }
  if (inRoundedRect(x, y, 13, 22, 6, 10, 3) || inRoundedRect(x, y, 81, 22, 6, 10, 3)) {
    color = COLORS.nearBlack;
  }
  return color;
}

function contentColor(x, y, variant) {
  if (variant === "gitea") {
    let color = null;
    if (distanceToPath(x, y, branch) <= 3 || inRect(x, y, 47, 58, 6, 30)) color = COLORS.gold;
    for (const [cx, cy] of [[50, 52], [50, 94], [68, 69]]) {
      if (inCircle(x, y, cx, cy, 7)) color = COLORS.gold;
      if (inCircle(x, y, cx, cy, 3)) color = COLORS.blue;
    }
    return color;
  }
  if (variant === "guacamole") {
    let color = null;
    if (inRoundedRect(x, y, 30, 52, 40, 28, 2)) color = COLORS.gold;
    if (inRect(x, y, 35, 57, 30, 18)) color = COLORS.blue;
    if (inRect(x, y, 45, 80, 10, 7) || inRoundedRect(x, y, 38, 87, 24, 4, 2)) color = COLORS.gold;
    return color;
  }
  if (variant === "keycloak") {
    let color = null;
    if (inCircle(x, y, 38, 58, 11)) color = COLORS.gold;
    if (inCircle(x, y, 38, 58, 5)) color = COLORS.blue;
    if (inRect(x, y, 46, 54.5, 32, 7) || inRect(x, y, 63, 61.5, 6, 9) || inRect(x, y, 72, 61.5, 6, 12)) color = COLORS.gold;
    return color;
  }
  /* Basisfassung: drei LCARS-Balken (y ist hier um 12 verschoben). */
  for (const [top, width] of [[48, 56], [64, 42], [80, 28]]) {
    if (inRoundedRect(x, y, 22, top, width, 10, 5)) return COLORS.gold;
  }
  return null;
}

function sample(x, y, variant) {
  let color = null;
  if (pointInPolygon(x, y, outerShield)) color = COLORS.gold;
  const inInner = pointInPolygon(x, y, innerShield);
  if (inInner) color = COLORS.blue;
  if (inInner) color = contentColor(x, y + 12, variant) ?? color;
  return color;
}

export function renderEmblemPng(size, variant = "base") {
  if (!Number.isInteger(size) || size < 1) throw new Error("Die Zielgroesse muss eine positive ganze Zahl sein.");
  if (!new Set(["base", "gitea", "guacamole", "keycloak"]).has(variant)) throw new Error(`Unbekannte Emblemfassung: ${variant}`);
  const supersampling = size <= 48 ? 8 : 4;
  const pixels = Buffer.alloc(size * size * 4);
  const samples = supersampling ** 2;
  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      const total = [0, 0, 0, 0];
      for (let sy = 0; sy < supersampling; sy += 1) {
        for (let sx = 0; sx < supersampling; sx += 1) {
          /* SVG-Standard: 100:116 wird in der quadratischen Ausgabe zentriert eingepasst. */
          const x = ((px + (sx + 0.5) / supersampling) / size) * 116 - 8;
          const y = ((py + (sy + 0.5) / supersampling) / size) * 116;
          const value = sample(x, y, variant);
          if (!value) continue;
          total[0] += value[0];
          total[1] += value[1];
          total[2] += value[2];
          total[3] += 1;
        }
      }
      const index = (py * size + px) * 4;
      if (total[3]) {
        pixels[index] = Math.round(total[0] / total[3]);
        pixels[index + 1] = Math.round(total[1] / total[3]);
        pixels[index + 2] = Math.round(total[2] / total[3]);
        pixels[index + 3] = Math.round((total[3] / samples) * 255);
      }
    }
  }
  return encodePng(size, size, pixels);
}

export function createIco(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

export async function buildFaviconAssets(outputDirectory = here) {
  const outputDir = resolve(outputDirectory);
  await mkdir(outputDir, { recursive: true });
  const svg = await readFile(sourcePath, "utf8");
  if (!svg.includes('viewBox="0 0 100 116"') || !svg.includes("#1740bc") || !svg.includes("#eaa549")) {
    throw new Error("emblem.svg besitzt nicht die erwartete Emblemfassung.");
  }
  const outputs = new Map([
    [16, "favicon-16x16.png"], [24, "marke-check-24x24.png"], [32, "favicon-32x32.png"], [48, "favicon-48x48.png"],
    [180, "apple-touch-icon.png"], [192, "android-chrome-192x192.png"], [512, "android-chrome-512x512.png"],
  ]);
  const pngs = new Map();
  for (const [size, filename] of outputs) {
    const data = renderEmblemPng(size);
    pngs.set(size, data);
    await writeFile(join(outputDir, filename), data);
  }
  await writeFile(join(outputDir, "favicon.ico"), createIco([16, 32, 48].map((size) => ({ size, data: pngs.get(size) }))));
  await writeFile(join(outputDir, "favicon.svg"), svg);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildFaviconAssets(process.argv[2] ? resolve(process.argv[2]) : here);
}
