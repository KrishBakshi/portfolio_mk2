import { ExperienceItemType } from "@/components/sections/WorkExperience";

export const WORK_EXPERIENCE_DATA: ExperienceItemType[] = [
    {
        id: "nasiwak",
        companyName: "Nasiwak Services India Private Limited",
        companyLogo: "/assets/companies/nasiwak_services_pvt_ltd_logo.jpg",
        positions: [
            {
                id: "nasiwak-ds",
                title: "Data Scientist",
                employmentPeriod: "August 2025 - Present",
                employmentType: "Full-time",
                icon: "code",
                description: `- Fine-tuning vision and language models, handling end-to-end deployment.
- Developing advanced signal processing systems using models like OpenAI Whisper, and building low-latency C++ backends.
- Showcasing AI solutions through full-stack applications with React and Next.js.`,
                skills: ["Vision Models", "Language Models", "OpenAI Whisper", "C++", "React", "Next.js"],
                isExpanded: true,
            },
            {
                id: "nasiwak-intern",
                title: "Data Scientist Intern",
                employmentPeriod: "April 2025 - July 2025",
                employmentType: "Internship",
                icon: "code",
                description: `- Secured the role via LinkedIn outreach with support from AutoMailAI.
- Delivered technical documentation for both technical and non-technical audiences in English and Japanese (backed by a Japanese organization).
- Researched and developed object detection pipelines for niche tasks (e.g., floor plans) using YOLO & OpenCV.
- Integrated custom ML/AI pipelines into various applications, including Selenium-based automation.`,
                skills: ["Documentation", "YOLO", "OpenCV", "Selenium", "ML Pipelines"],
            },
        ],
        isCurrentEmployer: true,
    },
    {
        id: "metafied",
        companyName: "Metafied (formerly known as ProfCess)",
        companyLogo: "/assets/companies/metafiedkokoro_logo.jpg",
        positions: [
            {
                id: "metafied-intern",
                title: "Data Science Intern",
                employmentPeriod: "July 2024 - Feb 2025",
                employmentType: "Internship",
                icon: "code",
                description: `- Mentored by ex-IIT and ex-Harvard leaders; incubated at Harvard Innovation Labs.
- Designed and deployed scalable data pipelines for time series forecasting using Azure Databricks and PySpark.
- Implemented and optimized auto-regression models (XGBoost, ARIMA, SARIMA) to improve sales predictions.
- Built advanced queries to uncover trends and insights from large datasets.`,
                skills: ["Azure Databricks", "PySpark", "XGBoost", "ARIMA", "SARIMA", "Data Analysis"],
            },
        ],
    },
    {
        id: "proazure",
        companyName: "ProAzure Solutions Pvt Ltd.",
        companyLogo: "/assets/companies/proazure_software_solutions_pvt_ltd_logo.jpg",
        positions: [
            {
                id: "proazure-rpa",
                title: "RPA Intern",
                employmentPeriod: "December 2023 - January 2024",
                employmentType: "Internship",
                icon: "code",
                description: `- Led a team to build robotic process automation (RPA) solutions for repetitive business tasks.
- Automated workflows like web scraping, data collection, and Excel handling.
- Improved task efficiency by 30% through smart process automation.`,
                skills: ["RPA", "Web Scraping", "Automation", "Excel"],
            }
        ]
    },
    {
        id: "rbtech",
        companyName: "RB Tech Services",
        companyLogo: "/assets/companies/rbtechservices_logo.jpg",
        positions: [
            {
                id: "rbtech-web",
                title: "Web Development Intern",
                employmentPeriod: "January 2023 - April 2023",
                employmentType: "Internship",
                icon: "code",
                description: `- Led a team to develop a dynamic website with full-stack responsibilities.
- Managed frontend and backend development for smooth user experience.
- Handled database design and real-time connectivity using phpMyAdmin and Wamp Server.`,
                skills: ["Full-stack Development", "PHP", "MySQL", "phpMyAdmin"],
            }
        ]
    }
];
