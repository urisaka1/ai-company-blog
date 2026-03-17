import { Metadata } from "next";
import { notFound } from "next/navigation";
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
    AI: "from-amber-700 to-orange-400",
    Mac: "from-stone-600 to-stone-400",
    "副業": "from-orange-500 to-amber-300",
    "ノーコード": "from-rose-400 to-pink-300",
    Claude: "from-violet-400 to-purple-300",
  };
  return map[tag] || "from-amber-500 to-orange-400";
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
      {/* アイキャッチ画像 */}
      <div className="max-w-[1080px] mx-auto px-6 pt-8">
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="1080px"
              priority
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
              <span className="text-white/10 text-[10rem] font-black select-none tracking-tighter">
                {post.tags[0]?.[0] || "T"}
              </span>
            </div>
          )}
          {/* オーバーレイでタグ表示 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-center gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-[700px] mx-auto px-6 pt-10 pb-16">
        {/* 記事ヘッダー */}
        <header className="mb-12">
          {/* タイトル */}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-fg leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: "var(--font-serif)" }}>
            {post.title}
          </h1>

          {/* 著者・日付 */}
          <AuthorInfo date={post.date} readingTime={readingTime} />

          {/* ディスクリプション */}
          <p className="mt-6 text-fg-muted text-base leading-relaxed border-l-3 border-accent pl-4">
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
