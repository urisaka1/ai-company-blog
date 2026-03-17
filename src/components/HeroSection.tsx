"use client";

import { useI18n } from "@/lib/i18n";

// ヒーローセクション — ナチュラル＆温かみのあるエディトリアルスタイル
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="hero-section">
      {/* ソフトなドットパターン装飾 */}
      <div className="hero-pattern" />

      <div className="max-w-[1080px] mx-auto px-6 pt-24 pb-28 sm:pt-36 sm:pb-40 lg:pt-44 lg:pb-48 relative">
        {/* バッジ — 落ち着いたラベル */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-accent-light text-accent text-xs font-semibold tracking-wide border border-accent/15">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent-secondary" />
            {t("hero.live")}
          </span>
        </div>

        {/* メインコピー — セリフ体で知的な印象 */}
        <h1
          className="text-center text-3xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.12] tracking-[-0.025em] animate-in"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="text-accent">{t("hero.catch1")}</span>
          <br />
          <span className="text-fg">{t("hero.catch2")}{t("hero.catch3")}</span>
        </h1>

        {/* サブコピー */}
        <p className="mt-6 sm:mt-8 text-fg-muted text-base sm:text-lg max-w-lg mx-auto leading-relaxed text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
          {t("hero.sub1")}
          <br className="hidden sm:block" />
          {t("hero.sub2")}
        </p>

        {/* CTA — 丸みのあるボタン */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <a
            href="#articles"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-md shadow-accent/15 border border-accent/20"
          >
            {t("hero.cta")}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>

        {/* カテゴリチップス — 丸角 */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: "300ms" }}>
          {[t("hero.ai"), t("hero.gadgets"), t("hero.pc"), t("hero.efficiency")].map((chip) => (
            <span
              key={chip}
              className="px-3.5 py-1.5 rounded-lg bg-bg-secondary text-fg-faint text-xs font-medium border border-border/50"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
