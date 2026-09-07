export type ProjectLinkKind = "demo" | "repository" | "write-up" | "model" | "notebook";

export interface ProjectLinkInfo {
  href: string;
  label: string;
  kind: ProjectLinkKind;
}

function normalizeUrl(url?: string) {
  return url?.replace(/\/+$/, "");
}

export function getProjectPrimaryLink(
  link?: string,
  github?: string
): ProjectLinkInfo | null {
  if (!link || normalizeUrl(link) === normalizeUrl(github)) return null;

  try {
    const host = new URL(link).hostname.replace(/^www\./, "");

    if (host === "github.com") {
      return { href: link, label: "Repository", kind: "repository" };
    }
    if (host.includes("linkedin.com")) {
      return { href: link, label: "Write-up", kind: "write-up" };
    }
    if (host.includes("huggingface.co")) {
      return { href: link, label: "Model", kind: "model" };
    }
    if (host.includes("colab.research.google.com")) {
      return { href: link, label: "Notebook", kind: "notebook" };
    }
  } catch {
    return null;
  }

  return { href: link, label: "Demo", kind: "demo" };
}
