import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllSlugs, getAllPosts, getPostBySlug } from "@/lib/posts";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedPosts } from "@/components/RelatedPosts";
import { AuthorInfo, BackToArticles } from "@/components/PostDetail";
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

// タグに基づくグラデーションカラー
function getGradient(tag: string): string {
  const map: Record<string, string> = {
    AI: "from-indigo-500 to-violet-400",
    Mac: "from-gray-600 to-slate-400",
    "副業": "from-amber-500 to-orange-400",
    "ノーコード": "from-rose-500 to-pink-400",
    Claude: "from-violet-500 to-purple-400",
  };
  return map[tag] || "from-indigo-500 to-pink-400";
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
          <Link href="/" className="hover:text-accent transition-colors duration-300">
            Home
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-fg-muted truncate max-w-[200px] sm:max-w-[400px]">{post.title}</span>
        </nav>
      </div>

      <article className="max-w-[720px] mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* アイキャッチ画像 */}
        <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-8 group">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
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
            {post.tags.map((tag, i) => (
              <span
                key={tag}
                className="animate-tag-pop text-xs px-3 py-1 rounded-full bg-accent-light text-accent font-bold"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* タイトル */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fg leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* 著者情報（Client Component） */}
          <AuthorInfo date={post.date} readingTime={readingTime} />

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

        {/* シェア & ナビ */}
        <div className="mt-14">
          <div className="gradient-line mb-8" />
          <div className="flex items-center justify-between">
            <ShareButtons title={post.title} slug={post.slug} />
            <BackToArticles />
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
