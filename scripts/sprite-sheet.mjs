#!/usr/bin/env node
// Turn a generated sprite grid (poses on a plain white or black background) into a
// transparent, evenly framed sprite sheet for the site companion.
//
//   node scripts/sprite-sheet.mjs <input.png> <output.png> [cols=5] [rows=3] [frameWidth=192]
//     [--bg light|dark]        background colour of the input (default light = white)
//     [--holes x,y;x,y]        enclosed background gaps to clear (pixel coords in the input)
//     [--blank x,y,w,h;...]    rectangles to paint over first (labels, watermarks)
//     [--frame WxH]            exact frame size; the crop grows to that aspect (keeps sheets
//                              made from different inputs the same size)
//
// Steps: flood-fill the background from the edges (so highlights inside the character
// survive), clear the --holes gaps, drop stray specks, take the background colour back
// out of the anti-aliased edge pixels so no halo shows on the other theme, find one crop
// box that fits every pose so they stay aligned, then downscale into the grid.
import sharp from "sharp";

const args = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) flags[args[i].slice(2)] = args[++i];
  else positional.push(args[i]);
}
const list = (value) =>
  (value ?? "")
    .split(";")
    .filter(Boolean)
    .map((item) => item.split(",").map(Number));
const holes = list(flags.holes);
const blanks = list(flags.blank);
const dark = flags.bg === "dark";
const [input, output, colsArg = "5", rowsArg = "3", frameWidthArg = "192"] = positional;
if (!input || !output) {
  console.error(
    "usage: node scripts/sprite-sheet.mjs <input.png> <output.png> [cols] [rows] [frameWidth] [--bg light|dark] [--holes x,y;...] [--blank x,y,w,h;...] [--frame WxH]"
  );
  process.exit(1);
}
const cols = Number(colsArg);
const rows = Number(rowsArg);
const [fixedW, fixedH] = flags.frame ? flags.frame.split("x").map(Number) : [];
const frameWidth = fixedW ?? Number(frameWidthArg);

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];

// 0. Paint over labels and watermarks with the background colour.
const BG = dark ? 0 : 255;
for (const [bx, by, bw, bh] of blanks) {
  for (let y = Math.max(0, by); y < Math.min(H, by + bh); y++) {
    for (let x = Math.max(0, bx); x < Math.min(W, bx + bw); x++) {
      const i = (y * W + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = BG;
    }
  }
}

// Background: nearly grey, and bright (light) or very dark (dark).
const isBackground = (i) => {
  const [r, g, b] = px(i);
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return dark ? max <= 40 && max - min <= 25 : min >= 222 && max - min <= 22;
};

// 1. Flood fill from every image edge pixel.
const bg = new Uint8Array(W * H);
const stack = [];
const seed = (i) => {
  if (!bg[i] && isBackground(i)) {
    bg[i] = 1;
    stack.push(i);
  }
};
for (let x = 0; x < W; x++) {
  seed(x);
  seed((H - 1) * W + x);
}
for (let y = 0; y < H; y++) {
  seed(y * W);
  seed(y * W + W - 1);
}
while (stack.length) {
  const i = stack.pop();
  const x = i % W;
  if (x > 0) seed(i - 1);
  if (x < W - 1) seed(i + 1);
  if (i >= W) seed(i - W);
  if (i < W * (H - 1)) seed(i + W);
}

// 1b. White pockets enclosed by the sprite (inside a tail loop, between legs) are
// background too; smaller ones are eyes, bubble shine and body highlights, so they stay.
const MIN_POCKET = 2000;
const visited = new Uint8Array(W * H);
for (let start = 0; start < W * H; start++) {
  if (bg[start] || visited[start] || !isBackground(start)) continue;
  const pocket = [start];
  visited[start] = 1;
  for (let k = 0; k < pocket.length; k++) {
    const i = pocket[k];
    const x = i % W;
    for (const n of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
      if (n >= 0 && n < W * H && !bg[n] && !visited[n] && isBackground(n)) {
        visited[n] = 1;
        pocket.push(n);
      }
    }
  }
  if (pocket.length >= MIN_POCKET) for (const i of pocket) bg[i] = 1;
}

// 1c. Gaps named on the command line (e.g. between legs): flood each one as
// background, with a slightly looser idea of the background colour to take its rim too.
const isLight = (i) => {
  const [r, g, b] = px(i);
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  // Near-black is background whatever its tint; near-white has to be fairly grey.
  return dark ? max <= 60 : min >= 205 && max - min <= 30;
};
for (const [hx, hy] of holes) {
  const fill = [hy * W + hx];
  while (fill.length) {
    const i = fill.pop();
    if (bg[i] || !isLight(i)) continue;
    bg[i] = 1;
    const x = i % W;
    if (x > 0) fill.push(i - 1);
    if (x < W - 1) fill.push(i + 1);
    if (i >= W) fill.push(i - W);
    if (i < W * (H - 1)) fill.push(i + W);
  }
}

// 2. Remove foreground islands too small to be part of a sprite (noise, label dust).
const MIN_ISLAND = 60;
const seen = new Uint8Array(W * H);
for (let start = 0; start < W * H; start++) {
  if (bg[start] || seen[start]) continue;
  const island = [start];
  seen[start] = 1;
  for (let k = 0; k < island.length; k++) {
    const i = island[k];
    const x = i % W;
    for (const n of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
      if (n >= 0 && n < W * H && !bg[n] && !seen[n]) {
        seen[n] = 1;
        island.push(n);
      }
    }
  }
  if (island.length < MIN_ISLAND) for (const i of island) bg[i] = 1;
}

for (let i = 0; i < W * H; i++) if (bg[i]) data[i * 4 + 3] = 0;

// 2b. Defringe. Edge pixels near the background were blended with it, which shows as
// a halo on the other theme. For low-saturation pixels within a few pixels of the
// background, take the background colour back out (colour-to-alpha): keep the colour
// that was mixed in and make the pixel partly transparent. Saturated pixels (pink fur,
// lavender sparkles) are left alone, and on white the dark outline is too.
const EDGE_BAND = 6;
const depth = new Uint8Array(W * H); // 0 = not in band; d = distance to background
let frontier = [];
for (let i = 0; i < W * H; i++) {
  if (bg[i]) continue;
  const x = i % W;
  if ((x > 0 && bg[i - 1]) || (x < W - 1 && bg[i + 1]) || (i >= W && bg[i - W]) || (i < W * (H - 1) && bg[i + W])) {
    depth[i] = 1;
    frontier.push(i);
  }
}
for (let d = 2; d <= EDGE_BAND; d++) {
  const next = [];
  for (const i of frontier) {
    const x = i % W;
    for (const n of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
      if (n >= 0 && n < W * H && !bg[n] && !depth[n]) {
        depth[n] = d;
        next.push(n);
      }
    }
  }
  frontier = next;
}
let defringed = 0;
for (let i = 0; i < W * H; i++) {
  if (!depth[i]) continue;
  const [r, g, b] = px(i);
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  if (max - min > 40) continue;
  if (dark ? max > 150 : min < 110) continue;
  // Against black: alpha is the brightest channel. Against white: how far from white.
  const alpha = dark ? max / 255 : Math.max(255 - r, 255 - g, 255 - b) / 255;
  if (alpha >= 0.98) continue;
  const unmix = (c) =>
    alpha <= 0.02
      ? 0
      : Math.max(0, Math.min(255, Math.round(dark ? c / alpha : 255 - (255 - c) / alpha)));
  data[i * 4] = unmix(r);
  data[i * 4 + 1] = unmix(g);
  data[i * 4 + 2] = unmix(b);
  data[i * 4 + 3] = Math.round(alpha * 255);
  defringed++;
}
console.log(`defringed ${defringed} edge pixels`);

// 3. One crop box (relative to each cell) that holds every pose.
const cellW = W / cols;
const cellH = H / rows;
let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const x0 = Math.round(c * cellW), y0 = Math.round(r * cellH);
    const x1 = Math.round((c + 1) * cellW), y1 = Math.round((r + 1) * cellH);
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        if (bg[y * W + x]) continue;
        minX = Math.min(minX, x - x0);
        maxX = Math.max(maxX, x - x0);
        minY = Math.min(minY, y - y0);
        maxY = Math.max(maxY, y - y0);
      }
    }
  }
}
const PAD = 6;
minX = Math.max(0, minX - PAD);
minY = Math.max(0, minY - PAD);
let cropW = Math.min(Math.floor(cellW), maxX + PAD + 1) - minX;
let cropH = Math.min(Math.floor(cellH), maxY + PAD + 1) - minY;
if (fixedW && fixedH) {
  // Grow the crop (centred, within the cell) to the requested frame aspect.
  const aspect = fixedH / fixedW;
  if (cropH / cropW < aspect) {
    const grow = Math.round(cropW * aspect) - cropH;
    minY = Math.max(0, Math.min(Math.floor(cellH) - (cropH + grow), minY - Math.floor(grow / 2)));
    cropH += grow;
  } else {
    const grow = Math.round(cropH / aspect) - cropW;
    minX = Math.max(0, Math.min(Math.floor(cellW) - (cropW + grow), minX - Math.floor(grow / 2)));
    cropW += grow;
  }
}
const frameHeight = fixedH ?? Math.round((frameWidth * cropH) / cropW);

// 4. Cut, downscale and lay out the frames.
const cleaned = sharp(data, { raw: { width: W, height: H, channels: 4 } });
const source = await cleaned.png().toBuffer();
const composites = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const frame = await sharp(source)
      .extract({
        left: Math.round(c * cellW) + minX,
        top: Math.round(r * cellH) + minY,
        width: cropW,
        height: cropH,
      })
      .resize(frameWidth, frameHeight, { kernel: "lanczos3" })
      .png()
      .toBuffer();
    composites.push({ input: frame, left: c * frameWidth, top: r * frameHeight });
  }
}

await sharp({
  create: {
    width: frameWidth * cols,
    height: frameHeight * rows,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(composites)
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(output);

console.log(`${output}: ${cols}x${rows} frames of ${frameWidth}x${frameHeight} (crop ${cropW}x${cropH} per cell)`);
