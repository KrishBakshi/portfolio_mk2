export const PROJECT_DOMAIN_FILTERS = [
  "Vision",
  "AI Agents",
  "LLM",
  "RAG",
  "Gen AI",
  "RL",
] as const;

export type ProjectDomain = (typeof PROJECT_DOMAIN_FILTERS)[number];
