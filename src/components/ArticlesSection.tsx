"use client";

import { useI18n } from "@/lib/i18n";
import { ScrollReveal } from "./ScrollReveal";
import { TagFilter } from "./TagFilter";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  thumbnail: string;
};

// 記事一覧セクション（i18n対応）
export function ArticlesSection({ posts }: { posts: Post[] }) {
  const { t } = useI18n();

  return (
    <section id="articles" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <h2 className="text-2xl font-bold text-fg tracking-tight">{t("articles.title")}</h2>
          </div>
          <span className="text-sm text-fg-faint px-3 py-1 rounded-full bg-tag-bg font-medium">
            {posts.length} {t("articles.count")}
          </span>
        </div>
      </ScrollReveal>
      <TagFilter posts={posts} />
    </section>
  );
}
