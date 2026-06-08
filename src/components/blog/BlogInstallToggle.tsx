import { BlogCodeTabs } from "@/components/blog/BlogCodeTabs";

export interface BlogInstallToggleProps {
  uv: { code: string; lang: string };
  pip: { code: string; lang: string };
}

export function BlogInstallToggle({ uv, pip }: BlogInstallToggleProps) {
  return (
    <BlogCodeTabs
      ariaLabel="Choose install method"
      defaultTabId="uv"
      tabs={[
        { id: "uv", label: "uv", ...uv },
        { id: "pip", label: "pip", ...pip },
      ]}
    />
  );
}
