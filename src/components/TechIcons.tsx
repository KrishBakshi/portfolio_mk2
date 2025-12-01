import React from 'react';
import AWS from './technologies/AWS';
import Appwrite from './technologies/Appwrite';
import BootStrap from './technologies/BootStrap';
import Bun from './technologies/Bun';
import CSS from './technologies/CSS';
import ExpressJs from './technologies/ExpressJs';
import Figma from './technologies/Figma';
import Github from './technologies/Github';
import Html from './technologies/Html';
import JavaScript from './technologies/JavaScript';
import MDXIcon from './technologies/MDXIcon';
import MongoDB from './technologies/MongoDB';
import Motion from './technologies/Motion';
import NestJs from './technologies/NestJs';
import Netlify from './technologies/Netlify';
import NextJs from './technologies/NextJs';
import NodeJs from './technologies/NodeJs';
import PostgreSQL from './technologies/PostgreSQL';
import Postman from './technologies/Postman';
import Prisma from './technologies/Prisma';
import ReactIcon from './technologies/ReactIcon';
import Sanity from './technologies/Sanity';
import Shadcn from './technologies/Shadcn';
import SocketIo from './technologies/SocketIo';
import TailwindCss from './technologies/TailwindCss';
import ThreeJs from './technologies/ThreeJs';
import TypeScript from './technologies/TypeScript';
import Vercel from './technologies/Vercel';

// Import new icon components
import Python from './technologies/Python';
import C from './technologies/C';
import Cpp from './technologies/Cpp';
import PyTorch from './technologies/PyTorch';
import PySpark from './technologies/PySpark';
import Git from './technologies/Git';
import FastAPI from './technologies/FastAPI';
import Flask from './technologies/Flask';
import Docker from './technologies/Docker';
import GoogleCloud from './technologies/GoogleCloud';
import Pandas from './technologies/Pandas';
import HuggingFace from './technologies/HuggingFace';
import LangChain from './technologies/LangChain';
import LangGraph from './technologies/LangGraph';
import Gradio from './technologies/Gradio';
import Streamlit from './technologies/Streamlit';

export const TechIcons: Record<string, React.ComponentType<any>> = {
    'AWS': AWS,
    'Appwrite': Appwrite,
    'Bootstrap': BootStrap,
    'Bun': Bun,
    'CSS': CSS,
    'Express.js': ExpressJs,
    'Figma': Figma,
    'GitHub': Github,
    'HTML': Html,
    'JavaScript': JavaScript,
    'MDX': MDXIcon,
    'MongoDB': MongoDB,
    'Motion': Motion,
    'Nest.js': NestJs,
    'Netlify': Netlify,
    'Next.js': NextJs,
    'Node.js': NodeJs,
    'PostgreSQL': PostgreSQL,
    'Postman': Postman,
    'Prisma': Prisma,
    'React': ReactIcon,
    'Sanity': Sanity,
    'shadcn/ui': Shadcn,
    'Socket.io': SocketIo,
    'Tailwind CSS': TailwindCss,
    'Three.js': ThreeJs,
    'TypeScript': TypeScript,
    'Vercel': Vercel,
    
    // Mapped new icons
    'Python': Python,
    'C': C,
    'C++': Cpp,
    'PyTorch': PyTorch,
    'PySpark': PySpark,
    'Git': Git,
    'FastAPI': FastAPI,
    'Flask': Flask,
    'Docker': Docker,
    'Google Cloud Platform': GoogleCloud,
    'Pandas': Pandas,
    'Hugging Face': HuggingFace,
    'LangChain': LangChain,
    'LangGraph': LangGraph,
    'Gradio': Gradio,
    'Streamlit': Streamlit,
};

export function getTechIcon(name: string) {
    return TechIcons[name] || null;
}
