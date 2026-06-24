import { PageCanvas } from "@/components/PageCanvas";
import { Blog } from "@/components/blog/Blog";
import { getAllBlogPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <PageCanvas>
      <div className="mx-auto mb-6 w-full max-w-3xl sm:px-0">
        <div id="js-cover-mark" className="pointer-events-none absolute left-0 top-0 h-32 w-full" />

        <div className="mt-6 border border-gray-300/50 bg-background p-4 dark:border-white/10">
          <Blog posts={posts} max={5} />
        </div>
      </div>
    </PageCanvas>
  );
}
