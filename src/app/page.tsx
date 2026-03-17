import { getAllPosts } from "@/lib/posts";
import { TagFilter } from "@/components/TagFilter";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ScrollReveal } from "@/components/ScrollReveal";

// トップページ：ヒーロー + タグフィルター付き記事カード一覧
export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="animate-in">
      {/* ヒーローセクション */}
      <section className="hero-mesh relative overflow-hidden">
        {/* パーティクルアニメーション背景 */}
        <FloatingParticles />
        <div className="bg-dots absolute inset-0 opacity-20" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            {/* 浮遊する絵文字たち */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl sm:text-6xl animate-float">🚀</span>
              <span className="text-3xl animate-float-delayed opacity-60">✨</span>
              <span className="text-2xl animate-float-slow opacity-40">💡</span>
            </div>

            {/* キャッチコピー */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="gradient-text">テクノロジーを、</span>
              <br />
              <span className="text-fg">もっと</span>
              <span className="text-shimmer">わかりやすく。</span>
            </h1>

            {/* サブテキスト */}
            <p className="mt-6 text-fg-muted text-base sm:text-lg max-w-xl leading-relaxed">
              AI・ガジェット・スマホ・PCの最新情報を、
              <br className="hidden sm:block" />
              実際に使った体験談つきでお届けします
              <span className="animate-wave inline-block ml-1">👋</span>
            </p>

            {/* CTAボタン */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#articles"
                className="ripple-btn inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-white font-bold text-sm shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                最新記事をチェック
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </a>
              <div className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-border bg-bg/50 backdrop-blur-sm text-fg-muted text-sm font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                毎日更新中
              </div>
            </div>

            {/* ステータスバッジ */}
            <div className="mt-8 flex flex-wrap gap-3">
              {["📱 ガジェット", "🤖 AI", "💻 PC", "⚡ 効率化"].map((item, i) => (
                <span
                  key={item}
                  className="animate-tag-pop text-xs px-3 py-1.5 rounded-full bg-bg/60 backdrop-blur-sm border border-border/50 text-fg-muted font-medium"
                  style={{ animationDelay: `${0.8 + i * 0.1}s` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 装飾的な要素（デスクトップ） */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
            {/* 回転するグラデーションリング */}
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-accent-secondary/20 blur-3xl" />
              <div className="absolute inset-8 rounded-full border border-accent/20 animate-spin-slow" />
              <div className="absolute inset-16 rounded-full border border-accent-secondary/15 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
              <div className="absolute inset-24 rounded-full bg-gradient-to-br from-accent/10 to-accent-secondary/10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* 記事一覧 */}
      <section id="articles" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* セクションヘッダー */}
        <ScrollReveal>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce-in">📝</span>
              <h2 className="text-2xl font-bold text-fg">最新の記事</h2>
            </div>
            <span className="text-sm text-fg-faint px-3 py-1 rounded-full bg-tag-bg">
              {posts.length} 件
            </span>
          </div>
        </ScrollReveal>

        <TagFilter posts={posts} />
      </section>
    </div>
  );
}
