"use client";

import { useI18n } from "@/lib/i18n";

// 著者セクション（i18n対応）
export function AuthorInfo({ date, readingTime }: { date: string; readingTime: number }) {
  const { t } = useI18n();

  return (
    <div className="mt-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-fg">{t("post.author")}</p>
        <div className="flex items-center gap-3 text-xs text-fg-faint mt-0.5">
          <time>{date}</time>
          <span className="w-1 h-1 rounded-full bg-accent" />
          <span>☕ {readingTime}{t("post.readtime")}</span>
        </div>
      </div>
    </div>
  );
}

// 「記事一覧に戻る」リンク（i18n対応）
export function BackToArticles() {
  const { t } = useI18n();

  return (
    <a
      href="/"
      className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-accent hover:-translate-x-1 transition-all duration-300"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {t("post.back")}
    </a>
  );
}

// シェアラベル（i18n対応）
export function ShareLabel() {
  const { t } = useI18n();
  return <span className="text-sm text-fg-muted font-medium">{t("post.share")}</span>;
}

// 関連記事タイトル（i18n対応）
export function RelatedTitle() {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xl">🔗</span>
      <h2 className="text-lg font-bold text-fg tracking-tight">{t("post.related")}</h2>
    </div>
  );
}
