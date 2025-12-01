export type TechStackItem = {
  key: string;
  title: string;
  href: string;
  categories: string[];
  theme?: boolean; // If true, has light/dark mode icons
};

export const TECH_STACK: TechStackItem[] = [
  {
    key: "python",
    title: "Python",
    href: "https://www.python.org/",
    categories: ["Language"],
  },
  {
    key: "c",
    title: "C",
    href: "https://en.cppreference.com/w/c",
    categories: ["Language"],
  },
  {
    key: "cpp",
    title: "C++",
    href: "https://isocpp.org/",
    categories: ["Language"],
  },
  {
    key: "javascript",
    title: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    categories: ["Language"],
  },
   {
    key: "postgres",
    title: "PostgreSQL",
    href: "https://www.postgresql.org/",
    categories: ["Database"],
  },
  {
    key: "react",
    title: "React",
    href: "https://react.dev/",
    categories: ["Library", "UI Library"],
  },
  {
    key: "nodejs",
    title: "Node.js",
    href: "https://nodejs.org/",
    categories: ["Runtime Environment"],
  },
  {
    key: "pytorch",
    title: "PyTorch",
    href: "https://pytorch.org/",
    categories: ["Library", "AI/ML"],
  },
  {
    key: "pandas",
    title: "Pandas",
    href: "https://pandas.pydata.org/",
    categories: ["Library", "Data Science"],
  },
  {
    key: "pyspark",
    title: "PySpark",
    href: "https://spark.apache.org/docs/latest/api/python/",
    categories: ["Library", "Big Data"],
  },
  {
    key: "git",
    title: "Git",
    href: "https://git-scm.com/",
    categories: ["Version Control"],
  },
  {
    key: "fastapi",
    title: "FastAPI",
    href: "https://fastapi.tiangolo.com/",
    categories: ["Framework", "Backend"],
  },
  {
    key: "flask",
    title: "Flask",
    href: "https://flask.palletsprojects.com/",
    categories: ["Framework", "Backend"],
  },
  {
    key: "docker",
    title: "Docker",
    href: "https://www.docker.com/",
    categories: ["Containerization"],
  },
  {
    key: "gcp",
    title: "Google Cloud Platform",
    href: "https://cloud.google.com/",
    categories: ["Cloud"],
  },
  {
    key: "typescript",
    title: "TypeScript",
    href: "https://www.typescriptlang.org/",
    categories: ["Language"],
  },
  {
    key: "nextjs",
    title: "Next.js",
    href: "https://nextjs.org/",
    categories: ["Framework"],
    theme: true,
  },
  {
    key: "tailwindcss",
    title: "Tailwind CSS",
    href: "https://tailwindcss.com/",
    categories: ["Framework"],
  },
  {
    key: "socketio",
    title: "Socket.io",
    href: "https://socket.io/",
    categories: ["Library", "Real-time"],
  },
  {
    key: "shadcn-ui",
    title: "shadcn/ui",
    href: "https://ui.shadcn.com/",
    categories: ["Library", "Component Library"],
    theme: true,
  },
  {
    key: "huggingface",
    title: "Hugging Face",
    href: "https://huggingface.co/",
    categories: ["Library", "AI/ML"],
  },
  {
    key: "langchain",
    title: "LangChain",
    href: "https://langchain.com/",
    categories: ["Library", "AI/ML"],
  },
  {
    key: "langgraph",
    title: "LangGraph",
    href: "https://langchain-ai.github.io/langgraph/",
    categories: ["Library", "AI/ML"],
  },
  {
    key: "gradio",
    title: "Gradio",
    href: "https://gradio.app/",
    categories: ["Library", "AI/ML", "UI"],
  },
  {
    key: "streamlit",
    title: "Streamlit",
    href: "https://streamlit.io/",
    categories: ["Library", "Data Science", "UI"],
  },
  {
    key: "github",
    title: "GitHub",
    href: "https://github.com/",
    categories: ["Tool", "Version Control"],
  },
  {
    key: "aws",
    title: "AWS",
    href: "https://aws.amazon.com/",
    categories: ["Cloud"],
  },
  {
    key: "vercel",
    title: "Vercel",
    href: "https://vercel.com/",
    categories: ["Cloud"],
  },
];
