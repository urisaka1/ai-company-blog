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
  category: string;
};

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

// カテゴリーフィルター + 記事カード
export function TagFilter({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t } = useI18n();

  // カテゴリー一覧（出現順）
  const usedCategories = Array.from(new Set(posts.map((p) => p.category)));

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  return (
    <>
      {/* カテゴリーフィルター */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ${
            activeCategory === null
              ? "bg-accent text-white"
              : "bg-bg-secondary text-fg-muted hover:text-fg border border-border hover:border-accent/30"
          }`}
        >
          {t("articles.all")}
        </button>
        {usedCategories.map((cat) => {
          const info = categoryMap[cat] || categoryMap.other;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-fg-muted hover:text-fg border border-border hover:border-accent/30"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${info.color}`} />
              {info.label}
            </button>
          );
        })}
      </div>

      {/* 記事カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map((post, i) => {
          const catInfo = categoryMap[post.category] || categoryMap.other;
          return (
            <ScrollReveal key={post.slug} direction="up" delay={i * 60}>
              <Link href={`/posts/${post.slug}`} className="group block h-full">
                <article className="h-full card-premium">
                  {/* サムネイル */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    {post.thumbnail ? (
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${catInfo.gradient} flex items-center justify-center`}>
                        <span className="text-white/20 text-7xl font-black select-none">
                          {catInfo.label[0]}
                        </span>
                      </div>
                    )}
                    {/* カテゴリーバッジ */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold">
                        <span className={`w-1.5 h-1.5 rounded-full ${catInfo.color}`} />
                        {catInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* コンテンツ */}
                  <div className="p-5">
                    <time className="text-[11px] text-fg-faint font-medium">{post.date}</time>
                    <h2 className="mt-2 text-base font-bold leading-snug text-fg line-clamp-2 group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-fg-muted leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                    <p className="mt-3 text-sm text-accent font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                      {t("articles.read")} →
                    </p>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </>
  );
}
