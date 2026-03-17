"use client";

import { useI18n } from "@/lib/i18n";
import { FloatingParticles } from "./FloatingParticles";

// ヒーローセクション（i18n対応）
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="hero-mesh relative overflow-hidden">
      {/* パーティクル背景 */}
      <FloatingParticles />
      <div className="bg-dots absolute inset-0 opacity-15" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl">
          {/* 浮遊する絵文字 */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl sm:text-6xl animate-float">🚀</span>
            <span className="text-3xl animate-float-delayed opacity-50">✨</span>
            <span className="text-2xl animate-float-slow opacity-30">💡</span>
          </div>

          {/* キャッチコピー */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] tracking-tight">
            <span className="gradient-text">{t("hero.catch1")}</span>
            <br />
            <span className="text-fg">{t("hero.catch2")}</span>
            <span className="text-shimmer">{t("hero.catch3")}</span>
          </h1>

          {/* サブテキスト */}
          <p className="mt-6 text-fg-muted text-base sm:text-lg max-w-lg leading-relaxed">
            {t("hero.sub1")}
            <br className="hidden sm:block" />
            {t("hero.sub2")}
            <span className="animate-wave inline-block ml-1">👋</span>
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#articles" className="btn-primary">
              {t("hero.cta")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-bg/50 backdrop-blur-sm text-fg-muted text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {t("hero.live")}
            </div>
          </div>

          {/* カテゴリバッジ */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {[t("hero.gadgets"), t("hero.ai"), t("hero.pc"), t("hero.efficiency")].map((item, i) => (
              <span
                key={item}
                className="animate-tag-pop text-xs px-3 py-1.5 rounded-full bg-bg/60 backdrop-blur-sm border border-border/50 text-fg-muted font-medium"
                style={{ animationDelay: `${0.8 + i * 0.1}s` }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 装飾（デスクトップ） */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/10 to-accent-secondary/10 blur-3xl" />
            <div className="absolute inset-8 rounded-full border border-accent/10 animate-spin-slow" />
            <div className="absolute inset-16 rounded-full border border-accent-secondary/8 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "35s" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
