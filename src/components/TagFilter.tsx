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

// タグに基づくグラデーション — 温かみのある配色
function getGradient(tag: string): string {
  const map: Record<string, string> = {
    AI: "from-amber-700 to-orange-400",
    Mac: "from-stone-600 to-stone-400",
    "副業": "from-orange-500 to-amber-300",
    "ノーコード": "from-rose-400 to-pink-300",
    "自動化": "from-teal-500 to-emerald-300",
    Claude: "from-violet-400 to-purple-300",
    "プログラミング": "from-emerald-600 to-teal-300",
    "効率化": "from-amber-500 to-yellow-300",
  };
  return map[tag] || "from-amber-500 to-orange-400";
}

// タグのドットカラー — アースカラー系
function getTagDot(tag: string): string {
  const map: Record<string, string> = {
    AI: "bg-amber-600",
    Mac: "bg-stone-500",
    "副業": "bg-orange-500",
    "ノーコード": "bg-rose-400",
    "自動化": "bg-teal-500",
    Claude: "bg-violet-400",
    "プログラミング": "bg-emerald-500",
    "効率化": "bg-amber-500",
  };
  return map[tag] || "bg-amber-500";
}

// タグフィルター + 記事カード
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
      {/* タグフィルター — 丸角ボタン */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all duration-300 ${
            activeTag === null
              ? "bg-accent text-white shadow-sm shadow-accent/20"
              : "bg-tag-bg text-tag-fg hover:text-fg border border-transparent hover:border-border"
          }`}
        >
          {t("articles.all")}
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-lg font-medium transition-all duration-300 ${
              activeTag === tag
                ? "bg-accent text-white shadow-sm shadow-accent/20"
                : "bg-tag-bg text-tag-fg hover:text-fg border border-transparent hover:border-border"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${getTagDot(tag)}`} />
            {tag}
          </button>
        ))}
      </div>

      {/* 記事カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        {filtered.map((post, i) => (
          <ScrollReveal
            key={post.slug}
            direction="up"
            delay={i * 80}
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
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
                      <span className="text-white/15 text-8xl font-black select-none tracking-tighter">
                        {post.tags[0]?.[0] || "T"}
                      </span>
                    </div>
                  )}
                  {/* カテゴリバッジ（画像の上） */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
                      <span className={`w-1.5 h-1.5 rounded-full ${getTagDot(post.tags[0])} ring-1 ring-white/30`} />
                      {post.tags[0]}
                    </span>
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="p-5">
                  {/* 日付 */}
                  <time className="text-[11px] text-fg-faint font-medium tracking-wide">
                    {post.date}
                  </time>

                  {/* タイトル — セリフ体 */}
                  <h2
                    className="mt-2 text-[1.05rem] font-bold leading-snug text-fg tracking-tight line-clamp-2 group-hover:text-accent transition-colors duration-300"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {post.title}
                  </h2>

                  {/* 概要 */}
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed line-clamp-2">
                    {post.description}
                  </p>

                  {/* Read more */}
                  <p className="mt-4 text-sm text-accent font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
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
