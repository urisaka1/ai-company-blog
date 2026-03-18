"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

// フッター — ラクシテ
export function FooterContent() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 border-t border-border">
      <div className="bg-bg-secondary">
        <div className="max-w-[960px] mx-auto px-5">
          <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* サイト説明 */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">ラ</span>
                <span className="text-sm font-bold text-fg">ラクシテ</span>
              </div>
              <p className="text-xs text-fg-faint leading-relaxed">
                {t("footer.desc1")}
                {t("footer.desc2")}
              </p>
            </div>

            {/* ナビゲーション */}
            <div>
              <h3 className="text-xs font-semibold text-fg mb-3">{t("footer.nav")}</h3>
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
                <li>
                  <Link href="/privacy" className="text-xs text-fg-faint hover:text-accent transition-colors">
                    {t("footer.privacy")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* フォロー */}
            <div>
              <h3 className="text-xs font-semibold text-fg mb-3">{t("footer.follow")}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://x.com/" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-fg-faint hover:text-accent transition-colors">
                    X / Twitter
                  </a>
                </li>
                <li>
                  <a href="https://www.threads.net/" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-fg-faint hover:text-accent transition-colors">
                    Threads
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* コピーライト */}
          <div className="py-4 border-t border-border/50 text-center">
            <p className="text-[11px] text-fg-faint">
              &copy; {new Date().getFullYear()} ラクシテ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
