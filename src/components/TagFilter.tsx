"use client";

import { useState } from "react";
import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
};

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
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1.5 text-sm rounded-full transition-all ${
            activeTag === null
              ? "bg-accent text-white"
              : "bg-tag-bg text-tag-fg hover:bg-border"
          }`}
        >
          すべて
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-3 py-1.5 text-sm rounded-full transition-all ${
              activeTag === tag
                ? "bg-accent text-white"
                : "bg-tag-bg text-tag-fg hover:bg-border"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 記事カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filtered.map((post, i) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block animate-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <article className="h-full rounded-xl border border-border bg-card-bg p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5">
              {/* サムネイルプレースホルダー */}
              <div className="w-full h-36 rounded-lg bg-bg-secondary mb-4 flex items-center justify-center text-fg-faint text-sm overflow-hidden">
                <span className="text-3xl opacity-30 select-none">
                  {post.tags[0]?.[0] || "A"}
                </span>
              </div>

              {/* 日付 */}
              <time className="text-xs text-fg-faint">{post.date}</time>

              {/* タイトル */}
              <h2 className="mt-1.5 text-lg font-bold leading-snug text-fg group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h2>

              {/* 概要 */}
              <p className="mt-2 text-sm text-fg-muted leading-relaxed line-clamp-2">
                {post.description}
              </p>

              {/* タグ */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-tag-bg text-tag-fg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}
