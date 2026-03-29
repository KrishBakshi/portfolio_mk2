import { getLlmsIndexMarkdown } from "@/lib/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(getLlmsIndexMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

