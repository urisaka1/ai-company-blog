import { getAllPosts } from "@/lib/posts";
import { HeroSection } from "@/components/HeroSection";
import { ArticlesSection } from "@/components/ArticlesSection";

// トップページ
export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="animate-in">
      <HeroSection />
      <ArticlesSection posts={posts} />
    </div>
  );
}
