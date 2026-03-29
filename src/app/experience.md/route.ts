import { getExperienceMarkdown } from "@/lib/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(getExperienceMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

