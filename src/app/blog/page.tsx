import { getStaticPageMetadata } from "@/config/metadata";
import { PageCanvas } from "@/components/PageCanvas";
import { Blog } from "@/components/blog/Blog";
import { getPublishedBlogPosts } from "@/lib/blog";

export const metadata = getStaticPageMetadata("/blog");

export default function BlogPage() {
  const posts = getPublishedBlogPosts();

  return (
    <PageCanvas>
      <main className="mx-auto w-full bg-background py-6 sm:py-10">
        <Blog posts={posts} />
      </main>
    </PageCanvas>
  );
}
