import { cn } from "@/lib/utils";

interface PageCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export function PageCanvas({ children, className }: PageCanvasProps) {
  return (
    <div className={cn("relative mx-auto min-h-[calc(100dvh-3.5rem)] w-full max-w-3xl transition-colors duration-300", className)}>
      {children}
    </div>
  );
}
