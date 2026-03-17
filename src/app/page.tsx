import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

// トップページ：記事一覧を表示
export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      {/* ページタイトル */}
      <section className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-4">
          最新の記事
        </h1>
        <p className="text-navy-600 dark:text-navy-200 text-lg">
          AIと最新テクノロジーに関する情報を発信しています。
        </p>
      </section>

      {/* 記事一覧 */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group border border-navy-200 dark:border-navy-800 rounded-xl p-6 hover:shadow-lg hover:border-navy-400 dark:hover:border-navy-600 transition-all duration-200 bg-white dark:bg-navy-900/50"
          >
            <Link href={`/posts/${post.slug}`} className="block">
              {/* 日付とタグ */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
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

              {/* タイトル */}
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white group-hover:text-navy-600 dark:group-hover:text-navy-200 transition-colors mb-2">
                {post.title}
              </h2>

              {/* 概要 */}
              <p className="text-navy-600 dark:text-navy-200 leading-relaxed">
                {post.description}
              </p>

              {/* 続きを読むリンク */}
              <span className="inline-block mt-4 text-sm font-medium text-navy-700 dark:text-navy-200 group-hover:text-navy-900 dark:group-hover:text-white transition-colors">
                続きを読む →
              </span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
