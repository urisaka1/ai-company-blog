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
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            {/* エモジ + キャッチコピー */}
            <div className="text-4xl sm:text-5xl mb-4">🚀</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              <span className="gradient-text">テクノロジーを、</span>
              <br />
              <span className="text-fg">もっとわかりやすく。</span>
            </h1>

            {/* サブテキスト */}
            <p className="mt-5 text-fg-muted text-base sm:text-lg max-w-xl leading-relaxed">
              AI・ガジェット・スマホ・PCの最新情報を、
              実際に使った体験談つきでお届けします ✨
            </p>

            {/* CTAボタン */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#articles"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-300"
              >
                最新記事をチェック 👇
              </a>
            </div>
          </div>

          {/* 装飾的な要素 */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
            <div className="w-72 h-72 rounded-full bg-gradient-to-br from-accent/20 to-accent-secondary/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* 記事一覧 */}
      <section id="articles" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* セクションヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-xl">📝</span>
            <h2 className="text-xl font-bold text-fg">最新の記事</h2>
          </div>
          <span className="text-sm text-fg-faint">{posts.length} 件の記事</span>
        </div>

        <TagFilter posts={posts} />
      </section>
    </div>
  );
}
