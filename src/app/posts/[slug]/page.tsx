import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllSlugs, getAllPosts, getPostBySlug } from "@/lib/posts";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedPosts } from "@/components/RelatedPosts";
import { estimateReadingTime } from "@/lib/utils";

// 静的パスを生成
export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 記事ごとのメタデータを動的に生成（SEO・OGP対応）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.date,
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
      },
    };
  } catch {
    return {};
  }
}

// タグに基づくグラデーションカラー（サムネイルなし時のフォールバック）
function getGradient(tag: string): string {
  const map: Record<string, string> = {
    AI: "from-teal-500 to-cyan-400",
    Mac: "from-gray-600 to-slate-400",
    "副業": "from-amber-500 to-orange-400",
    "ノーコード": "from-rose-500 to-pink-400",
    Claude: "from-violet-500 to-purple-400",
  };
  return map[tag] || "from-teal-500 to-emerald-400";
}

// 記事詳細ページ
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const allPosts = getAllPosts();
  const readingTime = estimateReadingTime(post.contentHtml);

  return (
    <div className="animate-in">
      {/* パンくずリスト */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-6">
        <nav className="text-sm text-fg-faint flex items-center gap-2">
          <Link href="/" className="hover:text-accent transition-colors">
            ホーム
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-fg-muted truncate max-w-[200px] sm:max-w-[400px]">{post.title}</span>
        </nav>
      </div>

      <article className="max-w-[720px] mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* アイキャッチ画像 */}
        <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-8">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="720px"
              priority
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
              <span className="text-white/20 text-7xl font-bold select-none">
                {post.tags[0]?.[0] || "A"}
              </span>
            </div>
          )}
        </div>

        {/* 記事ヘッダー */}
        <header className="mb-10">
          {/* タグ */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-accent-light text-accent font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* タイトル */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fg leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* 著者情報・日付・読了時間 */}
          <div className="mt-5 flex items-center gap-4">
            {/* アバター */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-fg">テクログ編集部</p>
              <div className="flex items-center gap-3 text-xs text-fg-faint mt-0.5">
                <time>{post.date}</time>
                <span className="w-1 h-1 rounded-full bg-fg-faint" />
                <span>{readingTime}分で読める</span>
              </div>
            </div>
          </div>

          {/* ディスクリプション */}
          <div className="mt-6 p-4 rounded-xl bg-bg-secondary border border-border">
            <p className="text-fg-muted text-sm leading-relaxed">
              {post.description}
            </p>
          </div>
        </header>

        {/* 記事本文 */}
        <div
          className="prose max-w-none text-fg"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* シェアボタン */}
        <div className="mt-14">
          <div className="gradient-line mb-8" />
          <div className="flex items-center justify-between">
            <ShareButtons title={post.title} slug={post.slug} />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-accent transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              記事一覧に戻る
            </Link>
          </div>
        </div>

        {/* 関連記事 */}
        <RelatedPosts
          currentSlug={post.slug}
          currentTags={post.tags}
          allPosts={allPosts}
        />
      </article>
    </div>
  );
}
