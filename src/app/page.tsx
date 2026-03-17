import { getAllPosts } from "@/lib/posts";
import { TagFilter } from "@/components/TagFilter";

// トップページ：ヒーロー + タグフィルター付き記事カード一覧
export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="animate-in">
      {/* ヒーローセクション */}
      <section className="bg-bg-secondary border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-fg leading-tight">
            MacとAIで、仕組みを作る。
          </h1>
          <p className="mt-3 text-fg-muted text-base sm:text-lg max-w-lg leading-relaxed">
            テクノロジーと副業に関する実践的なノウハウを、
            わかりやすくお届けします。
          </p>
        </div>
      </section>

      {/* 記事一覧 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <TagFilter posts={posts} />
      </section>
    </div>
  );
}
