import { deflateSync } from "node:zlib";

export const COLORS = Object.freeze({
  gold: "#eaa549",
  royalBlue: "#1740bc",
  lavender: "#9a8ec9",
  blue: "#5a7fe0",
  gray: "#3c4257",
  ground: "#000000",
  surface1: "#0b0d14",
  surface2: "#10131a",
  surface3: "#1b1f2b",
  line: "#2a2e38",
  text: "#dfe4f2",
  success: "#7fb069",
  error: "#cc6666",
});

function rgba(value) {
  if (Array.isArray(value)) return value;
  const hex = value.replace("#", "");
  if (hex.length !== 6 && hex.length !== 8) throw new Error(`Ungueltige Farbe: ${value}`);
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
    hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) : 255,
  ];
}

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

export function encodePng(width, height, pixels) {
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

export class Canvas {
  constructor(width, height, background = COLORS.surface1) {
    this.width = width;
    this.height = height;
    this.pixels = Buffer.alloc(width * height * 4);
    this.fillRect(0, 0, width, height, background);
  }

  setPixel(x, y, color) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const [red, green, blue, alpha = 255] = rgba(color);
    const index = (y * this.width + x) * 4;
    if (alpha === 255) {
      this.pixels[index] = red;
      this.pixels[index + 1] = green;
      this.pixels[index + 2] = blue;
      this.pixels[index + 3] = 255;
      return;
    }
    const a = alpha / 255;
    this.pixels[index] = Math.round(red * a + this.pixels[index] * (1 - a));
    this.pixels[index + 1] = Math.round(green * a + this.pixels[index + 1] * (1 - a));
    this.pixels[index + 2] = Math.round(blue * a + this.pixels[index + 2] * (1 - a));
    this.pixels[index + 3] = 255;
  }

  fillSpan(y, x1, x2, color) {
    y = Math.round(y);
    x1 = Math.max(0, Math.ceil(x1));
    x2 = Math.min(this.width, Math.ceil(x2));
    if (y < 0 || y >= this.height || x2 <= x1) return;
    const value = rgba(color);
    if (value[3] !== 255) {
      for (let x = x1; x < x2; x += 1) this.setPixel(x, y, value);
      return;
    }
    this.pixels.fill(Buffer.from(value), (y * this.width + x1) * 4, (y * this.width + x2) * 4);
  }

  fillRect(x, y, width, height, color) {
    const y1 = Math.max(0, Math.ceil(y));
    const y2 = Math.min(this.height, Math.ceil(y + height));
    for (let row = y1; row < y2; row += 1) this.fillSpan(row, x, x + width, color);
  }

  roundedRect(x, y, width, height, radius, color) {
    radius = Math.max(0, Math.min(radius, width / 2, height / 2));
    const y1 = Math.max(0, Math.ceil(y));
    const y2 = Math.min(this.height, Math.ceil(y + height));
    for (let row = y1; row < y2; row += 1) {
      const localY = row + 0.5 - y;
      let inset = 0;
      if (localY < radius) {
        const dy = radius - localY;
        inset = radius - Math.sqrt(Math.max(0, radius * radius - dy * dy));
      } else if (localY > height - radius) {
        const dy = localY - (height - radius);
        inset = radius - Math.sqrt(Math.max(0, radius * radius - dy * dy));
      }
      this.fillSpan(row, x + inset, x + width - inset, color);
    }
  }

  ellipse(cx, cy, rx, ry, color) {
    const y1 = Math.max(0, Math.ceil(cy - ry));
    const y2 = Math.min(this.height, Math.ceil(cy + ry));
    for (let row = y1; row < y2; row += 1) {
      const dy = (row + 0.5 - cy) / ry;
      const dx = rx * Math.sqrt(Math.max(0, 1 - dy * dy));
      this.fillSpan(row, cx - dx, cx + dx, color);
    }
  }

  polygon(points, color) {
    const minY = Math.max(0, Math.floor(Math.min(...points.map((point) => point[1]))));
    const maxY = Math.min(this.height - 1, Math.ceil(Math.max(...points.map((point) => point[1]))));
    for (let y = minY; y <= maxY; y += 1) {
      const scanY = y + 0.5;
      const hits = [];
      for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
        const a = points[j];
        const b = points[i];
        if ((a[1] > scanY) !== (b[1] > scanY)) {
          hits.push(a[0] + ((scanY - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
        }
      }
      hits.sort((a, b) => a - b);
      for (let index = 0; index + 1 < hits.length; index += 2) this.fillSpan(y, hits[index], hits[index + 1], color);
    }
  }

  line(x1, y1, x2, y2, width, color) {
    const radius = width / 2;
    const minX = Math.max(0, Math.floor(Math.min(x1, x2) - radius));
    const maxX = Math.min(this.width - 1, Math.ceil(Math.max(x1, x2) + radius));
    const minY = Math.max(0, Math.floor(Math.min(y1, y2) - radius));
    const maxY = Math.min(this.height - 1, Math.ceil(Math.max(y1, y2) + radius));
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length2 = dx * dx + dy * dy || 1;
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const t = Math.max(0, Math.min(1, ((x + 0.5 - x1) * dx + (y + 0.5 - y1) * dy) / length2));
        const px = x1 + t * dx;
        const py = y1 + t * dy;
        if ((x + 0.5 - px) ** 2 + (y + 0.5 - py) ** 2 <= radius ** 2) this.setPixel(x, y, color);
      }
    }
  }

  png() {
    return encodePng(this.width, this.height, this.pixels);
  }
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

function distanceToPath(x, y, points, closed = false) {
  let distance = Infinity;
  const count = closed ? points.length : points.length - 1;
  for (let index = 0; index < count; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    distance = Math.min(distance, distanceToSegment(x, y, a[0], a[1], b[0], b[1]));
  }
  return distance;
}

function inRoundedSquare(x, y, left, top, size, radius) {
  if (x < left || x > left + size || y < top || y > top + size) return false;
  const cx = Math.max(left + radius, Math.min(x, left + size - radius));
  const cy = Math.max(top + radius, Math.min(y, top + size - radius));
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

/* Neutrales Emblem im Quadrat 0..100: Goldrand, blaues Feld, drei LCARS-Balken. */
function shieldSample(x, y) {
  const ex = x * 1.16 - 8;
  const ey = y * 1.16;
  if (!inRoundedSquare(ex, ey, 10, 18, 80, 14)) return null;
  if (!inRoundedSquare(ex, ey, 15, 23, 70, 10)) return [234, 165, 73, 255];
  for (const [top, width] of [[36, 56], [52, 42], [68, 28]]) {
    if (ey >= top && ey <= top + 10 && ex >= 22 && ex <= 22 + width) {
      const cx = Math.max(27, Math.min(ex, 22 + width - 5));
      if ((ex - cx) ** 2 + (ey - (top + 5)) ** 2 <= 25) return [234, 165, 73, 255];
    }
  }
  return [23, 64, 188, 255];
}

export function drawEmblem(canvas, x, y, size) {
  const left = Math.floor(x);
  const top = Math.floor(y);
  const width = Math.ceil(size);
  for (let py = 0; py < width; py += 1) {
    for (let px = 0; px < width; px += 1) {
      const totals = [0, 0, 0];
      let hits = 0;
      for (const offsetY of [0.25, 0.75]) {
        for (const offsetX of [0.25, 0.75]) {
          const sample = shieldSample(((px + offsetX) / size) * 100, ((py + offsetY) / size) * 100);
          if (sample) {
            totals[0] += sample[0];
            totals[1] += sample[1];
            totals[2] += sample[2];
            hits += 1;
          }
        }
      }
      if (hits) canvas.setPixel(left + px, top + py, [Math.round(totals[0] / hits), Math.round(totals[1] / hits), Math.round(totals[2] / hits), Math.round((hits / 4) * 255)]);
    }
  }
}
