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

// メタデータ
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

// グラデーション
function getGradient(tag: string): string {
  const map: Record<string, string> = {
    AI: "from-blue-600 to-blue-400",
    Mac: "from-gray-600 to-gray-400",
    "副業": "from-orange-500 to-amber-400",
    "ノーコード": "from-pink-500 to-rose-400",
    Claude: "from-violet-500 to-purple-400",
  };
  return map[tag] || "from-blue-600 to-cyan-400";
}

// 記事詳細ページ — Apple風の上品なレイアウト
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
      {/* アイキャッチ画像 — フルワイド */}
      <div className="max-w-[980px] mx-auto px-6 pt-8">
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="980px"
              priority
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
              <span className="text-white/10 text-[10rem] font-bold select-none tracking-tighter">
                {post.tags[0]?.[0] || "T"}
              </span>
            </div>
          )}
        </div>
      </div>

      <article className="max-w-[680px] mx-auto px-6 pt-12 pb-16">
        {/* 記事ヘッダー */}
        <header className="mb-12">
          {/* カテゴリ + 日付 */}
          <div className="flex items-center gap-3 text-sm text-fg-faint mb-4">
            <span className="uppercase tracking-wider font-medium text-accent text-xs">
              {post.tags[0]}
            </span>
            {post.tags.slice(1).map((tag) => (
              <span key={tag} className="text-xs text-fg-faint">
                {tag}
              </span>
            ))}
          </div>

          {/* タイトル — 大きく */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-fg leading-[1.15] tracking-[-0.03em]">
            {post.title}
          </h1>

          {/* 著者・日付 */}
          <AuthorInfo date={post.date} readingTime={readingTime} />

          {/* ディスクリプション */}
          <p className="mt-6 text-fg-muted text-base leading-relaxed">
            {post.description}
          </p>
        </header>

        {/* 記事本文 */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* シェア & ナビ */}
        <div className="mt-16 pt-8 border-t border-border">
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
