import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";
import { cn } from "@/lib/utils";

interface PageCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export function PageCanvas({ children, className }: PageCanvasProps) {
  return (
    // Centered in layout shell: max-w-3xl column inside max-w-[calc(48rem+120px)].
    <div className={cn("relative transition-colors duration-300", className)}>
      <div className="relative mx-auto w-full max-w-full min-[765px]:max-w-[calc(100%-4rem)] min-[900px]:max-w-3xl">
        <DiagonalPatternFrame>{children}</DiagonalPatternFrame>
      </div>
    </div>
  );
}
