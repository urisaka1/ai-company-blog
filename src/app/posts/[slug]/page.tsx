import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllSlugs, getAllPosts, getPostBySlug } from "@/lib/posts";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedPosts } from "@/components/RelatedPosts";
import { AuthorInfo, BackToArticles } from "@/components/PostDetail";
import { estimateReadingTime } from "@/lib/utils";

// カテゴリー定義
const categoryMap: Record<string, { label: string; color: string; gradient: string }> = {
  kitchen: { label: "キッチン", color: "bg-emerald-500", gradient: "from-emerald-500 to-teal-400" },
  storage: { label: "収納", color: "bg-blue-500", gradient: "from-blue-500 to-indigo-400" },
  cleaning: { label: "掃除", color: "bg-cyan-500", gradient: "from-cyan-500 to-blue-400" },
  desk: { label: "デスク周り", color: "bg-violet-500", gradient: "from-violet-500 to-purple-400" },
  appliance: { label: "時短家電", color: "bg-orange-500", gradient: "from-orange-500 to-amber-400" },
  daily: { label: "日用品", color: "bg-pink-500", gradient: "from-pink-500 to-rose-400" },
  other: { label: "その他", color: "bg-gray-500", gradient: "from-gray-500 to-slate-400" },
};

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
      title: `${post.title} | ラクシテ`,
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
  const catInfo = categoryMap[post.category] || categoryMap.other;

  return (
    <div className="animate-in">
      {/* アイキャッチ画像 */}
      <div className="max-w-[960px] mx-auto px-5 pt-8">
        <div className="relative w-full aspect-[2/1] sm:aspect-[21/9] rounded-2xl overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="960px"
              priority
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${catInfo.gradient} flex items-center justify-center`}>
              <span className="text-white/15 text-[8rem] font-black select-none">
                {catInfo.label[0]}
              </span>
            </div>
          )}
          {/* カテゴリーバッジ */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${catInfo.color}`} />
              {catInfo.label}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-[680px] mx-auto px-5 pt-10 pb-16">
        {/* 記事ヘッダー */}
        <header className="mb-12">
          {/* タイトル */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fg leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* 著者・日付 */}
          <AuthorInfo date={post.date} readingTime={readingTime} />

          {/* ディスクリプション */}
          <p className="mt-6 text-fg-muted text-base leading-relaxed border-l-4 border-accent pl-4">
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
