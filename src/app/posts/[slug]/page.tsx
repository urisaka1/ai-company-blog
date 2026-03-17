import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";

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

  return (
    <article className="max-w-3xl mx-auto">
      {/* 記事ヘッダー */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <time className="text-sm text-navy-600 dark:text-navy-200">
            {post.date}
          </time>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-navy-600 dark:text-navy-200">
          {post.description}
        </p>
      </header>

      {/* 記事本文 */}
      <div
        className="prose max-w-none text-navy-900 dark:text-navy-100"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
