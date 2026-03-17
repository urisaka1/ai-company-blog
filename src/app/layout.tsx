import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangToggle } from "@/components/LangToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { CursorFollower } from "@/components/CursorFollower";
import { I18nProvider } from "@/lib/i18n";
import { HeaderNav } from "@/components/HeaderNav";
import { FooterContent } from "@/components/FooterContent";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

// サイト共通のメタデータ
export const metadata: Metadata = {
  title: {
    default: "TechLog | AI・Gadgets・Technology",
    template: "%s | TechLog",
  },
  description:
    "AI・ガジェット・スマホ・PCの最新情報をわかりやすくお届け。実際に使ってみた体験レビューと最新ニュースを毎日更新中。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "TechLog",
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
    <html lang="ja" suppressHydrationWarning className={`${notoSansJP.variable} ${inter.variable}`}>
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
          <I18nProvider>
            {/* マウスカーソル追従エフェクト */}
            <CursorFollower />

            {/* ヘッダー */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-bg/80 backdrop-blur-2xl">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                  {/* ロゴアイコン */}
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-sm group-hover:animate-pulse-glow transition-all duration-300 group-hover:scale-110">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-fg group-hover:text-accent transition-all duration-300 tracking-tight">
                    TechLog
                  </span>
                </Link>
                <div className="flex items-center gap-4">
                  <HeaderNav />
                  <div className="w-px h-5 bg-border hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <LangToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>

            {/* メインコンテンツ */}
            <main className="flex-1 w-full">{children}</main>

            {/* フッター */}
            <footer className="mt-24">
              <div className="gradient-line" />
              <FooterContent />
            </footer>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
