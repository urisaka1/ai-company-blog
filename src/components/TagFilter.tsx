"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";
import { useI18n } from "@/lib/i18n";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  thumbnail: string;
};

// タグに基づくグラデーション
function getGradient(tag: string): string {
  const map: Record<string, string> = {
    AI: "from-blue-600 to-blue-400",
    Mac: "from-gray-600 to-gray-400",
    "副業": "from-orange-500 to-amber-400",
    "ノーコード": "from-pink-500 to-rose-400",
    "自動化": "from-cyan-500 to-blue-400",
    Claude: "from-violet-500 to-purple-400",
    "プログラミング": "from-emerald-500 to-teal-400",
    "効率化": "from-orange-500 to-yellow-400",
  };
  return map[tag] || "from-blue-600 to-cyan-400";
}

// タグフィルター + 記事カード — Apple風
export function TagFilter({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { t } = useI18n();

  // 全タグを抽出（出現回数順）
  const tagCount = new Map<string, number>();
  posts.forEach((p) =>
    p.tags.forEach((t) => tagCount.set(t, (tagCount.get(t) || 0) + 1))
  );
  const allTags = Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <>
      {/* タグフィルター — 控えめなピル */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-4 py-1.5 text-xs rounded-full font-medium transition-all duration-300 ${
            activeTag === null
              ? "bg-fg text-bg"
              : "bg-tag-bg text-tag-fg hover:text-fg"
          }`}
        >
          {t("articles.all")}
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-4 py-1.5 text-xs rounded-full font-medium transition-all duration-300 ${
              activeTag === tag
                ? "bg-fg text-bg"
                : "bg-tag-bg text-tag-fg hover:text-fg"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 記事カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filtered.map((post, i) => (
          <ScrollReveal
            key={post.slug}
            direction="up"
            delay={i * 100}
          >
            <Link href={`/posts/${post.slug}`} className="group block h-full">
              <article className="h-full card-premium">
                {/* サムネイル */}
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-[1.25rem]">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-[800ms] ease-out"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
                      <span className="text-white/10 text-8xl font-bold select-none tracking-tighter">
                        {post.tags[0]?.[0] || "T"}
                      </span>
                    </div>
                  )}
                </div>

                {/* コンテンツ */}
                <div className="p-6">
                  {/* タグ + 日付 */}
                  <div className="flex items-center gap-3 text-xs text-fg-faint">
                    <span className="uppercase tracking-wider font-medium text-accent">
                      {post.tags[0]}
                    </span>
                    <span>·</span>
                    <time>{post.date}</time>
                  </div>

                  {/* タイトル */}
                  <h2 className="mt-3 text-[1.1rem] font-semibold leading-snug text-fg tracking-tight line-clamp-2 group-hover:text-accent transition-colors duration-300">
                    {post.title}
                  </h2>

                  {/* 概要 */}
                  <p className="mt-2.5 text-sm text-fg-muted leading-relaxed line-clamp-2">
                    {post.description}
                  </p>

                  {/* Read more */}
                  <p className="mt-4 text-sm text-accent font-medium opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {t("articles.read")} →
                  </p>
                </div>
              </article>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
