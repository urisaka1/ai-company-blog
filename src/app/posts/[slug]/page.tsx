import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getAllPosts, getPostBySlug } from "@/lib/posts";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedPosts } from "@/components/RelatedPosts";

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

  return (
    <div className="animate-in">
      {/* パンくずリスト */}
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6">
        <nav className="text-sm text-fg-faint">
          <Link href="/" className="hover:text-accent transition-colors">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fg-muted">{post.title.slice(0, 30)}...</span>
        </nav>
      </div>

      <article className="max-w-[680px] mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* 記事ヘッダー */}
        <header className="mb-10">
          {/* タグ */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-accent-light text-accent font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* タイトル */}
          <h1 className="text-2xl sm:text-3xl font-bold text-fg leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* 日付とメタ */}
          <div className="mt-4 flex items-center gap-4 text-sm text-fg-faint">
            <time>{post.date}</time>
          </div>

          {/* ディスクリプション */}
          <p className="mt-4 text-fg-muted leading-relaxed border-l-2 border-accent/30 pl-4">
            {post.description}
          </p>
        </header>

        {/* 記事本文 */}
        <div
          className="prose max-w-none text-fg"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* シェアボタン */}
        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
          <ShareButtons title={post.title} slug={post.slug} />
          <Link
            href="/"
            className="text-sm text-fg-muted hover:text-accent transition-colors"
          >
            ← 記事一覧に戻る
          </Link>
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
