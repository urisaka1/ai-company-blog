"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

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
    AI: "from-indigo-500 to-violet-400",
    Mac: "from-gray-600 to-slate-400",
    "副業": "from-amber-500 to-orange-400",
    "ノーコード": "from-rose-500 to-pink-400",
    "自動化": "from-blue-500 to-cyan-400",
    Claude: "from-violet-500 to-purple-400",
    "プログラミング": "from-emerald-500 to-teal-400",
    "効率化": "from-orange-500 to-yellow-400",
  };
  return map[tag] || "from-indigo-500 to-pink-400";
}

// タグに基づくカラードット
function getTagDot(tag: string): string {
  const map: Record<string, string> = {
    AI: "bg-indigo-400",
    Mac: "bg-gray-400",
    "副業": "bg-amber-400",
    "ノーコード": "bg-rose-400",
    "自動化": "bg-blue-400",
    Claude: "bg-violet-400",
    "プログラミング": "bg-emerald-400",
    "効率化": "bg-orange-400",
  };
  return map[tag] || "bg-indigo-400";
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
      {/* タグフィルター（ポップなピル型） */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-5 py-2.5 text-sm rounded-full font-bold transition-all duration-300 ${
            activeTag === null
              ? "bg-accent text-white shadow-lg shadow-accent/30 scale-105"
              : "bg-tag-bg text-tag-fg hover:bg-border-hover hover:scale-105 active:scale-95"
          }`}
        >
          ✨ すべて
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-5 py-2.5 text-sm rounded-full font-bold transition-all duration-300 ${
              activeTag === tag
                ? "bg-accent text-white shadow-lg shadow-accent/30 scale-105"
                : "bg-tag-bg text-tag-fg hover:bg-border-hover hover:scale-105 active:scale-95"
            }`}
          >
            <span className={`inline-block w-2 h-2 rounded-full ${getTagDot(tag)} mr-1.5`} />
            {tag}
          </button>
        ))}
      </div>

      {/* 記事カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        {filtered.map((post, i) => (
          <ScrollReveal
            key={post.slug}
            direction={i % 2 === 0 ? "left" : "right"}
            delay={i * 100}
          >
            <Link
              href={`/posts/${post.slug}`}
              className="group block h-full"
            >
              <article className="h-full rounded-2xl border border-border bg-card-bg overflow-hidden card-tilt gradient-border-animated">
                {/* サムネイル画像 */}
                <div className="relative w-full aspect-[2/1] overflow-hidden">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
                      <span className="text-white/30 text-6xl font-bold select-none group-hover:scale-125 transition-transform duration-500">
                        {post.tags[0]?.[0] || "A"}
                      </span>
                    </div>
                  )}
                  {/* ホバー時のオーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* 「読む」バッジ（ホバー時にスライドイン） */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 text-xs font-bold text-accent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    読む →
                  </div>
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
                  <h2 className="mt-3 text-lg font-bold leading-snug text-fg group-hover:text-accent transition-colors duration-300 line-clamp-2">
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
                        className="text-xs px-3 py-1 rounded-full bg-tag-bg text-tag-fg font-medium flex items-center gap-1"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${getTagDot(tag)}`} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
