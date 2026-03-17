"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  thumbnail: string;
};

// タグに基づくグラデーションカラー（サムネイルなし時のフォールバック）
function getGradient(tag: string): string {
  const map: Record<string, string> = {
    AI: "from-teal-500 to-cyan-400",
    Mac: "from-gray-600 to-slate-400",
    "副業": "from-amber-500 to-orange-400",
    "ノーコード": "from-rose-500 to-pink-400",
    "自動化": "from-blue-500 to-indigo-400",
    Claude: "from-violet-500 to-purple-400",
  };
  return map[tag] || "from-teal-500 to-emerald-400";
}

// タグフィルター付き記事カード一覧
export function TagFilter({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 全タグを抽出（出現回数順）
  const tagCount = new Map<string, number>();
  posts.forEach((p) =>
    p.tags.forEach((t) => tagCount.set(t, (tagCount.get(t) || 0) + 1))
  );
  const allTags = Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  // フィルター適用
  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <>
      {/* タグフィルター */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-200 ${
            activeTag === null
              ? "bg-accent text-white shadow-md shadow-accent/25"
              : "bg-tag-bg text-tag-fg hover:bg-border-hover"
          }`}
        >
          すべて
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-200 ${
              activeTag === tag
                ? "bg-accent text-white shadow-md shadow-accent/25"
                : "bg-tag-bg text-tag-fg hover:bg-border-hover"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 記事カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map((post, i) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <article className="h-full rounded-2xl border border-border bg-card-bg overflow-hidden card-hover">
              {/* サムネイル画像 */}
              <div className="relative w-full aspect-[2/1] overflow-hidden">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
                    <span className="text-white/40 text-5xl font-bold select-none">
                      {post.tags[0]?.[0] || "A"}
                    </span>
                  </div>
                )}
                {/* 画像オーバーレイ（ホバー時） */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* コンテンツ */}
              <div className="p-5">
                {/* 日付 */}
                <div className="flex items-center gap-2 text-xs text-fg-faint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <time>{post.date}</time>
                </div>

                {/* タイトル */}
                <h2 className="mt-2.5 text-lg font-bold leading-snug text-fg group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* 概要 */}
                <p className="mt-2 text-sm text-fg-muted leading-relaxed line-clamp-2">
                  {post.description}
                </p>

                {/* タグ */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-tag-bg text-tag-fg font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}
