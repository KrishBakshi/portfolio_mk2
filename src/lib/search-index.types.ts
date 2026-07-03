export type CommandSearchGroup =
  | "navigation"
  | "projects"
  | "blog"
  | "experience"
  | "social";

export type CommandSearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  group: CommandSearchGroup;
  keywords?: string[];
  external?: boolean;
};

const GROUP_LABELS: Record<CommandSearchGroup, string> = {
  navigation: "Navigation",
  projects: "Projects",
  blog: "Blog",
  experience: "Experience",
  social: "Contact & Links",
};

export function getCommandSearchGroupLabel(group: CommandSearchGroup) {
  return GROUP_LABELS[group];
}

export const COMMAND_SEARCH_GROUP_ORDER: CommandSearchGroup[] = [
  "navigation",
  "projects",
  "blog",
  "experience",
  "social",
];
