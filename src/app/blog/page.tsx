import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";

export default function BlogPage() {
  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="relative mx-auto max-w-3xl">
        <DiagonalPatternFrame>
          <div className="mx-auto w-full max-w-3xl sm:px-0">
            <div id="js-cover-mark" className="absolute top-0 left-0 w-full h-32 pointer-events-none" />
            <div className="bg-background border border-gray-300 p-4">
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight">
                  Blog
                </h1>
                <p className="text-muted-foreground">
                  Coming soon...
                </p>
              </div>
            </div>
          </div>
        </DiagonalPatternFrame>
      </div>
    </div>
  );
}
