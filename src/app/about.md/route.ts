import { getAboutMarkdown } from "@/lib/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(getAboutMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

