/**
 * Generates the Resume-Fit app icon for the dashboard and the extension.
 *
 * The icon is described once, as a list of shapes on a 128x128 grid, and that
 * description is used to write both an SVG (favicon / in-app logo) and PNGs
 * (Chrome only accepts PNG for manifest icons). Run with `npm run icons`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GRID = 128;

// Mirrors COLORS in shared/src/constants/theme.ts.
const PRIMARY = "#2563EB";
const SUCCESS = "#16A34A";
const SURFACE = "#FFFFFF";
const LINE = "#93C5FD";

// Painted in order, later shapes on top.
const SHAPES = [
  { type: "rect", x: 0, y: 0, w: 128, h: 128, r: 28, fill: PRIMARY },
  // Resume page with three text lines.
  { type: "rect", x: 30, y: 18, w: 56, h: 78, r: 8, fill: SURFACE },
  { type: "rect", x: 42, y: 34, w: 32, h: 7, r: 3.5, fill: LINE },
  { type: "rect", x: 42, y: 49, w: 32, h: 7, r: 3.5, fill: LINE },
  { type: "rect", x: 42, y: 64, w: 18, h: 7, r: 3.5, fill: LINE },
  // "Match" badge: a ring in the background color separates it from the page.
  { type: "circle", cx: 88, cy: 90, r: 28, fill: PRIMARY },
  { type: "circle", cx: 88, cy: 90, r: 23, fill: SUCCESS },
  { type: "polyline", points: [[77, 90], [85, 98], [99, 82]], width: 7, stroke: SURFACE },
];

// ---------- SVG ----------

function toSvg() {
  const body = SHAPES.map((s) => {
    if (s.type === "rect") {
      return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${s.fill}"/>`;
    }
    if (s.type === "circle") {
      return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.fill}"/>`;
    }
    const points = s.points.map((p) => p.join(",")).join(" ");
    return `<polyline points="${points}" fill="none" stroke="${s.stroke}" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}">\n  ${body.join("\n  ")}\n</svg>\n`;
}

// ---------- Rasterizer ----------

function insideRoundedRect(px, py, { x, y, w, h, r }) {
  // Signed distance to a rounded rectangle, measured from its center.
  const qx = Math.abs(px - (x + w / 2)) - (w / 2 - r);
  const qy = Math.abs(py - (y + h / 2)) - (h / 2 - r);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return outside + Math.min(Math.max(qx, qy), 0) - r <= 0;
}

function distanceToSegment(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function contains(shape, px, py) {
  if (shape.type === "rect") return insideRoundedRect(px, py, shape);
  if (shape.type === "circle") return Math.hypot(px - shape.cx, py - shape.cy) <= shape.r;
  // A round-capped, round-joined stroke is the union of capsules around each segment.
  for (let i = 1; i < shape.points.length; i++) {
    if (distanceToSegment(px, py, shape.points[i - 1], shape.points[i]) <= shape.width / 2) return true;
  }
  return false;
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Returns RGBA pixels, anti-aliased by averaging an n x n grid of samples per pixel. */
function rasterize(size, samples = 8) {
  const scale = GRID / size;
  const colors = SHAPES.map((s) => hexToRgb(s.fill ?? s.stroke));
  const pixels = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, hits = 0;
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const px = (x + (sx + 0.5) / samples) * scale;
          const py = (y + (sy + 0.5) / samples) * scale;
          for (let i = SHAPES.length - 1; i >= 0; i--) {
            if (contains(SHAPES[i], px, py)) {
              r += colors[i][0];
              g += colors[i][1];
              b += colors[i][2];
              hits++;
              break;
            }
          }
        }
      }
      const offset = (y * size + x) * 4;
      if (hits > 0) {
        pixels[offset] = Math.round(r / hits);
        pixels[offset + 1] = Math.round(g / hits);
        pixels[offset + 2] = Math.round(b / hits);
        pixels[offset + 3] = Math.round((hits / (samples * samples)) * 255);
      }
    }
  }
  return pixels;
}

// ---------- PNG encoder ----------

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function toPng(size) {
  const pixels = rasterize(size);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // color type: RGBA

  // Each scanline is prefixed with a filter byte (0 = none).
  const rowLength = size * 4;
  const raw = Buffer.alloc((rowLength + 1) * size);
  for (let y = 0; y < size; y++) {
    pixels.copy(raw, y * (rowLength + 1) + 1, y * rowLength, (y + 1) * rowLength);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------- Output ----------

function write(relativePath, contents) {
  const path = resolve(ROOT, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  console.log(`wrote ${relativePath}`);
}

const svg = toSvg();
write("frontendDashboard/public/icon.svg", svg);
write("frontendDashboard/public/apple-touch-icon.png", toPng(180));
write("frontendExtension/public/icons/icon.svg", svg);
for (const size of [16, 32, 48, 128]) {
  write(`frontendExtension/public/icons/icon-${size}.png`, toPng(size));
}
