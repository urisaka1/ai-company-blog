import { getAllPosts } from "@/lib/posts";
import { TagFilter } from "@/components/TagFilter";

// トップページ：ヒーロー + タグフィルター付き記事カード一覧
export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="animate-in">
      {/* ヒーローセクション */}
      <section className="hero-mesh relative">
        <div className="bg-dots absolute inset-0 opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            {/* キャッチコピー */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              <span className="gradient-text">MacとAIで、</span>
              <br />
              <span className="text-fg">仕組みを作る。</span>
            </h1>

            {/* サブテキスト */}
            <p className="mt-5 text-fg-muted text-base sm:text-lg max-w-xl leading-relaxed">
              テクノロジーと副業に関する実践的なノウハウを、
              わかりやすくお届けします。
            </p>

            {/* CTAボタン */}
            <a
              href="#articles"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-300"
            >
              最新記事を読む
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </a>
          </div>

          {/* 装飾的な要素 */}
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-20">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-accent to-accent-secondary blur-3xl" />
          </div>
        </div>
      </section>

      {/* 記事一覧 */}
      <section id="articles" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* セクションヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-accent-secondary" />
            <h2 className="text-xl font-bold text-fg">最新の記事</h2>
          </div>
          <span className="text-sm text-fg-faint">{posts.length} 件の記事</span>
        </div>

        <TagFilter posts={posts} />
      </section>
    </div>
  );
}
