"use client";

import { useI18n } from "@/lib/i18n";

// 著者セクション
export function AuthorInfo({ date, readingTime }: { date: string; readingTime: number }) {
  const { t } = useI18n();

  return (
    <div className="mt-4 flex items-center gap-3 text-sm text-fg-faint">
      <span>{t("post.author")}</span>
      <span>·</span>
      <time>{date}</time>
      <span>·</span>
      <span>{readingTime} {t("post.readtime")}</span>
    </div>
  );
}

// 「記事一覧に戻る」リンク
export function BackToArticles() {
  const { t } = useI18n();
  return (
    <a href="/" className="text-sm text-accent hover:text-accent-hover transition-colors">
      ← {t("post.back")}
    </a>
  );
}

// シェアラベル
export function ShareLabel() {
  const { t } = useI18n();
  return <span className="text-sm text-fg-faint">{t("post.share")}</span>;
}

// 関連記事タイトル
export function RelatedTitle() {
  const { t } = useI18n();
  return (
    <h2 className="text-xl font-bold text-fg mb-6">
      {t("post.related")}
    </h2>
  );
}
