"use client";

import { useI18n } from "@/lib/i18n";

// ヒーローセクション — ラクシテ
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="bg-bg-secondary">
      <div className="max-w-[960px] mx-auto px-5 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        {/* バッジ */}
        <div className="flex justify-center mb-6 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-light text-accent text-xs font-medium border border-accent/15">
            {t("hero.badge")}
          </span>
        </div>

        {/* メインコピー */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-fg animate-in">
          {t("hero.catch1")}
          <br />
          <span className="text-accent">{t("hero.catch2")}{t("hero.catch3")}</span>
        </h1>

        {/* サブコピー */}
        <p className="mt-5 text-fg-muted text-base sm:text-lg max-w-md mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
          {t("hero.sub1")}
          <br className="hidden sm:block" />
          {t("hero.sub2")}
        </p>

        {/* CTA */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <a
            href="#articles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-sm"
          >
            {t("hero.cta")}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
