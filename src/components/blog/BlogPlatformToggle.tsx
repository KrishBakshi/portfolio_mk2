import { BlogCodeTabs } from "@/components/blog/BlogCodeTabs";

export interface BlogPlatformToggleProps {
  mac: { code: string; lang: string };
  linux: { code: string; lang: string };
}

export function BlogPlatformToggle({ mac, linux }: BlogPlatformToggleProps) {
  return (
    <BlogCodeTabs
      ariaLabel="Choose platform"
      defaultTabId="mac"
      tabs={[
        { id: "mac", label: "macOS", iconId: "mac", ...mac },
        { id: "linux", label: "Linux", iconId: "linux", ...linux },
      ]}
    />
  );
}
