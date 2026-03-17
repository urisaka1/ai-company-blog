"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

// フッター — Apple風ミニマルデザイン
export function FooterContent() {
  const { t } = useI18n();

  return (
    <footer className="mt-20">
      <div className="bg-bg-secondary">
        <div className="max-w-[980px] mx-auto px-6">
          {/* メインフッター */}
          <div className="py-5 border-b border-border/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xs font-semibold text-fg mb-3">{t("footer.nav")}</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-xs text-fg-faint hover:text-fg transition-colors">
                      {t("footer.home")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-xs text-fg-faint hover:text-fg transition-colors">
                      {t("footer.articles")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-fg mb-3">{t("footer.follow")}</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="https://x.com/" target="_blank" rel="noopener noreferrer"
                      className="text-xs text-fg-faint hover:text-fg transition-colors">
                      X / Twitter
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer"
                      className="text-xs text-fg-faint hover:text-fg transition-colors">
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* コピーライト */}
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-fg-faint">
              &copy; {new Date().getFullYear()} TechLog. All rights reserved.
            </p>
            <p className="text-[11px] text-fg-faint">
              {t("footer.desc1")} {t("footer.desc2")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
