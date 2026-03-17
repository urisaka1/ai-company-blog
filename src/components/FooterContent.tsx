"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

// フッター（i18n対応）
export function FooterContent() {
  const { t } = useI18n();

  return (
    <div className="bg-bg-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* ブログ説明 */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </div>
              <span className="font-bold text-fg text-sm tracking-tight">TechLog</span>
            </div>
            <p className="text-sm text-fg-muted leading-relaxed">
              {t("footer.desc1")}<br />
              {t("footer.desc2")}
            </p>
          </div>

          {/* ナビゲーション */}
          <div className="sm:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-widest text-fg-faint mb-4">
              {t("footer.nav")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-fg-muted hover:text-accent transition-colors duration-300">
                  {t("footer.home")}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-fg-muted hover:text-accent transition-colors duration-300">
                  {t("footer.articles")}
                </Link>
              </li>
            </ul>
          </div>

          {/* SNS */}
          <div className="sm:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-widest text-fg-faint mb-4">
              {t("footer.follow")}
            </h3>
            <div className="flex items-center gap-3">
              {/* X（Twitter） */}
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center text-fg-muted hover:text-accent hover:bg-accent-light border border-border hover:border-accent/30 transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center text-fg-muted hover:text-accent hover:bg-accent-light border border-border hover:border-accent/30 transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-fg-faint text-center tracking-wide">
            &copy; {new Date().getFullYear()} TechLog. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
