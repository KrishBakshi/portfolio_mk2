import { getProjectsMarkdown } from "@/lib/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(getProjectsMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

