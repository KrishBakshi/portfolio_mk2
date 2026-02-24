import skillsData from "../../public/data/skills.json";
import workExperienceData from "../../public/data/work-experience.json";

export type TechStackItem = {
  key: string;
  title: string;
  href: string;
  categories: string[];
  theme?: boolean;
};

export type ExperiencePositionIconType =
  | "code"
  | "design"
  | "business"
  | "education"
  | "idea";

export type ExperiencePositionItemType = {
  id: string;
  title: string;
  employmentPeriod: string;
  employmentType?: string;
  description?: string;
  icon?: ExperiencePositionIconType;
  skills?: string[];
  isExpanded?: boolean;
};

export type ExperienceItemType = {
  id: string;
  companyName: string;
  companyLogo?: string;
  positions: ExperiencePositionItemType[];
  isCurrentEmployer?: boolean;
};

export const TECH_STACK = skillsData as TechStackItem[];
export const WORK_EXPERIENCE_DATA = workExperienceData as ExperienceItemType[];
