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

// 記事一覧セクション — セリフ体見出しで知的な印象
export function ArticlesSection({ posts }: { posts: Post[] }) {
  const { t } = useI18n();

  return (
    <section id="articles" className="max-w-[1080px] mx-auto px-6 py-20 sm:py-28">
      <ScrollReveal>
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-accent rounded-full" />
            <span className="text-xs font-semibold text-accent tracking-widest">Blog</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-fg tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("articles.title")}
          </h2>
          <p className="mt-2 text-fg-faint text-base">
            {posts.length} {t("articles.count")}
          </p>
        </div>
      </ScrollReveal>
      <TagFilter posts={posts} />
    </section>
  );
}
