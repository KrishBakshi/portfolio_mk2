import { getLlmsFullMarkdown } from "@/lib/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(getLlmsFullMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

