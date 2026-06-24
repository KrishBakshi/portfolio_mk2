import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const input = join(root, "public/header/pfp.jpeg");
const output = join(root, "src/app/favicon.ico");
const sizes = [16, 32, 48];

async function createRounded(size) {
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`
  );

  return sharp(input)
    .resize(size, size, { fit: "cover", position: "center" })
    .composite([{ input: circle, blend: "dest-in" }])
    .png()
    .toBuffer();
}

const buffers = await Promise.all(sizes.map(createRounded));
writeFileSync(output, await toIco(buffers));
console.log(`Generated ${output}`);
