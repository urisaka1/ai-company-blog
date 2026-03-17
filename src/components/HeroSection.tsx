"use client";

import { useI18n } from "@/lib/i18n";

// ヒーローセクション — Apple風ミニマルデザイン
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="hero-section">
      <div className="max-w-[980px] mx-auto px-6 pt-20 pb-24 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44 text-center">
        {/* メインコピー — 大胆で圧倒的な存在感 */}
        <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-[-0.04em]">
          <span className="gradient-text">{t("hero.catch1")}</span>
          <br />
          <span className="text-fg">{t("hero.catch2")}{t("hero.catch3")}</span>
        </h1>

        {/* サブコピー — 簡潔で上品 */}
        <p className="mt-6 sm:mt-8 text-fg-muted text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          {t("hero.sub1")}
          <br className="hidden sm:block" />
          {t("hero.sub2")}
        </p>

        {/* CTA — シンプルなリンクスタイル */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6">
          <a
            href="#articles"
            className="inline-flex items-center gap-2 text-accent text-lg sm:text-xl font-medium hover:opacity-70 transition-opacity"
          >
            {t("hero.cta")}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
