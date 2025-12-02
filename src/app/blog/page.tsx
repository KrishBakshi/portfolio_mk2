import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";
import { Blog } from "@/components/blog/Blog";
import { getAllBlogPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="relative mx-auto max-w-3xl">
        <DiagonalPatternFrame>
          <div className="mx-auto w-full max-w-3xl sm:px-0 mb-6">
            <div id="js-cover-mark" className="absolute top-0 left-0 w-full h-32 pointer-events-none" />

            <div className="bg-background border border-gray-300/50 dark:border-white/10 mt-6 p-4">
              <Blog posts={posts} max={5} />
            </div>
          </div>
        </DiagonalPatternFrame>
      </div>
    </div>
  );
}
