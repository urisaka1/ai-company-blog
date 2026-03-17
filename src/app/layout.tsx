import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// サイト共通のメタデータ
export const metadata: Metadata = {
  title: {
    default: "AI Company Blog",
    template: "%s | AI Company Blog",
  },
  description:
    "MacとAIで仕組みを作る。テクノロジーと副業に関する実践的な情報を発信するブログ。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "AI Company Blog",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      {/* ダークモードフラッシュ防止スクリプト */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      {/* Google Analytics */}
      <GoogleAnalytics />
      <body className={`${notoSansJP.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          {/* ヘッダー */}
          <header className="sticky top-0 z-50 border-b border-border/50 bg-bg/80 backdrop-blur-xl shadow-sm">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2.5 group"
              >
                {/* ロゴアイコン */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-fg group-hover:text-accent transition-colors">
                  AI Company Blog
                </span>
              </Link>
              <div className="flex items-center gap-5">
                <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-fg-muted">
                  <Link
                    href="/"
                    className="hover:text-accent transition-colors"
                  >
                    記事一覧
                  </Link>
                </nav>
                <div className="w-px h-5 bg-border hidden sm:block" />
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="flex-1 w-full">{children}</main>

          {/* フッター */}
          <footer className="mt-20">
            {/* グラデーション区切り線 */}
            <div className="gradient-line" />
            <div className="bg-bg-secondary">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {/* ブログ説明 */}
                  <div className="sm:col-span-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      </div>
                      <span className="font-bold text-fg text-sm">AI Company Blog</span>
                    </div>
                    <p className="text-sm text-fg-muted leading-relaxed">
                      MacとAIで仕組みを作る。<br />
                      テクノロジーと副業の実践的な情報を発信。
                    </p>
                  </div>

                  {/* ナビゲーション */}
                  <div className="sm:col-span-1">
                    <h3 className="font-bold text-sm text-fg mb-3">ナビゲーション</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/" className="text-sm text-fg-muted hover:text-accent transition-colors">
                          ホーム
                        </Link>
                      </li>
                      <li>
                        <Link href="/" className="text-sm text-fg-muted hover:text-accent transition-colors">
                          記事一覧
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* SNS */}
                  <div className="sm:col-span-1">
                    <h3 className="font-bold text-sm text-fg mb-3">フォロー</h3>
                    <div className="flex items-center gap-3">
                      {/* X（Twitter） */}
                      <a
                        href="https://x.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X"
                        className="w-9 h-9 rounded-lg bg-bg flex items-center justify-center text-fg-muted hover:text-accent hover:bg-accent-light transition-all"
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
                        className="w-9 h-9 rounded-lg bg-bg flex items-center justify-center text-fg-muted hover:text-accent hover:bg-accent-light transition-all"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* コピーライト */}
                <div className="mt-10 pt-6 border-t border-border">
                  <p className="text-xs text-fg-faint text-center">
                    &copy; {new Date().getFullYear()} AI Company Blog. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
