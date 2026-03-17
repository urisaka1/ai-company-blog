"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

// フッター — 温かみのあるエディトリアルスタイル
export function FooterContent() {
  const { t } = useI18n();

  return (
    <footer className="mt-20">
      {/* シンプルな区切り線 */}
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="h-px bg-border/60" />
      </div>

      <div className="bg-bg-secondary">
        <div className="max-w-[1080px] mx-auto px-6">
          {/* メインフッター */}
          <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* ブログ紹介 */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="logo-mark">T</span>
                <span className="text-sm font-bold text-fg tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>TechLog</span>
              </div>
              <p className="text-xs text-fg-faint leading-relaxed">
                {t("footer.desc1")}
                {t("footer.desc2")}
              </p>
            </div>

            {/* ナビゲーション */}
            <div>
              <h3 className="text-xs font-semibold text-fg mb-3" style={{ fontFamily: "var(--font-serif)" }}>{t("footer.nav")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-xs text-fg-faint hover:text-accent transition-colors">
                    {t("footer.home")}
                  </Link>
                </li>
                <li>
                  <Link href="/#articles" className="text-xs text-fg-faint hover:text-accent transition-colors">
                    {t("footer.articles")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* フォロー */}
            <div>
              <h3 className="text-xs font-semibold text-fg mb-3" style={{ fontFamily: "var(--font-serif)" }}>{t("footer.follow")}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://x.com/" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-fg-faint hover:text-accent transition-colors">
                    X / Twitter
                  </a>
                </li>
                <li>
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-fg-faint hover:text-accent transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* コピーライト */}
          <div className="py-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-fg-faint">
              &copy; {new Date().getFullYear()} TechLog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
