import type { ExperienceItemType } from "@/components/WorkExperience";

export const WORK_EXPERIENCE_DATA: ExperienceItemType[] = [
    {
        id: "current-company",
        companyName: "Tech Innovations Inc.",
        companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=TI&backgroundColor=3b82f6",
        positions: [
            {
                id: "senior-engineer",
                title: "Senior Software Engineer",
                employmentPeriod: "Jan 2023 — Present",
                employmentType: "Full-time",
                icon: "code",
                description:
                    "Leading development of scalable web applications using modern technologies. Architecting cloud-native solutions and mentoring junior developers. Implementing best practices for code quality and performance optimization.",
                skills: [
                    "TypeScript",
                    "Next.js",
                    "React",
                    "Node.js",
                    "AWS",
                    "Docker",
                    "PostgreSQL",
                    "GraphQL",
                    "CI/CD",
                    "Agile",
                ],
                isExpanded: true,
            },
        ],
        isCurrentEmployer: true,
    },
    {
        id: "previous-company",
        companyName: "Digital Solutions Co.",
        companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=DS&backgroundColor=10b981",
        positions: [
            {
                id: "fullstack-dev",
                title: "Full-stack Developer",
                employmentPeriod: "Jun 2021 — Dec 2022",
                employmentType: "Full-time",
                icon: "code",
                description:
                    "Developed and maintained multiple client-facing web applications. Collaborated with cross-functional teams to deliver high-quality software solutions. Implemented responsive designs and optimized application performance.",
                skills: [
                    "JavaScript",
                    "React",
                    "Node.js",
                    "Express.js",
                    "MongoDB",
                    "REST API",
                    "Git",
                    "Teamwork",
                ],
            },
        ],
    },
    {
        id: "education",
        companyName: "Education",
        companyLogo: undefined,
        positions: [
            {
                id: "university",
                title: "Bachelor of Science in Computer Science",
                employmentPeriod: "2017 — 2021",
                icon: "education",
                description:
                    "Focused on software engineering, algorithms, and data structures. Participated in hackathons and coding competitions. Completed capstone project on machine learning applications.",
                skills: [
                    "Data Structures",
                    "Algorithms",
                    "Software Engineering",
                    "Machine Learning",
                    "Python",
                    "Java",
                    "C++",
                ],
            },
        ],
    },
];
