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
  category: string;
};

// 記事一覧セクション
export function ArticlesSection({ posts }: { posts: Post[] }) {
  const { t } = useI18n();

  return (
    <section id="articles" className="max-w-[960px] mx-auto px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-fg">
            {t("articles.title")}
          </h2>
          <p className="mt-1 text-fg-faint text-sm">
            {posts.length} {t("articles.count")}
          </p>
        </div>
      </ScrollReveal>
      <TagFilter posts={posts} />
    </section>
  );
}
