import { PAGE_META } from "@/config/metadata";
import { createOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

export const alt = "Blog — Krish Bakshi";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  const { title, description } = PAGE_META["/blog"];
  return createOgImage({ title, description, label: "Blog" });
}
