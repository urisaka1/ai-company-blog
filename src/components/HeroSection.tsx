"use client";

import { useI18n } from "@/lib/i18n";

// ヒーローセクション — TechLog独自のビジュアル
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="hero-section">
      {/* ドットパターン装飾 */}
      <div className="hero-pattern" />

      <div className="max-w-[1080px] mx-auto px-6 pt-24 pb-28 sm:pt-36 sm:pb-40 lg:pt-44 lg:pb-48 relative">
        {/* バッジ — 動的なラベル */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wide border border-accent/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            {t("hero.live")}
          </span>
        </div>

        {/* メインコピー */}
        <h1 className="text-center text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.08] tracking-[-0.035em] animate-in">
          <span className="gradient-text">{t("hero.catch1")}</span>
          <br />
          <span className="text-fg">{t("hero.catch2")}{t("hero.catch3")}</span>
        </h1>

        {/* サブコピー */}
        <p className="mt-6 sm:mt-8 text-fg-muted text-base sm:text-lg max-w-lg mx-auto leading-relaxed text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
          {t("hero.sub1")}
          <br className="hidden sm:block" />
          {t("hero.sub2")}
        </p>

        {/* CTA */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <a
            href="#articles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
          >
            {t("hero.cta")}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>

        {/* カテゴリチップス */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: "300ms" }}>
          {[t("hero.ai"), t("hero.gadgets"), t("hero.pc"), t("hero.efficiency")].map((chip) => (
            <span
              key={chip}
              className="px-3 py-1 rounded-md bg-bg-secondary text-fg-faint text-xs font-medium border border-border/50"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
