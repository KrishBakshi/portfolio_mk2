import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";
import { cn } from "@/lib/utils";

interface PageCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export function PageCanvas({ children, className }: PageCanvasProps) {
  return (
    <div className={cn("relative transition-colors duration-300", className)}>
      <div className="relative mx-auto w-full max-w-3xl">
        <DiagonalPatternFrame>{children}</DiagonalPatternFrame>
      </div>
    </div>
  );
}
