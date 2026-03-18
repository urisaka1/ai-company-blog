import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Source_Sans_3, Lora } from "next/font/google";
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

// 本文用：温かみのあるヒューマニストサンセリフ
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-source-sans",
});

// 見出し用：知的で温かいセリフ体
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-lora",
});

// 日本語本文
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans",
});

// 日本語見出し用セリフ
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-serif",
});

// サイト共通のメタデータ
export const metadata: Metadata = {
  title: {
    default: "TechLog — AI, Gadgets & Technology",
    template: "%s — TechLog",
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
  // Google Search Console 所有権確認
  verification: {
    google: "licAHEJP8sOfn0Dyl7JTQBZFpuLKArCYdqqeBBqkWeo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={`${sourceSans.variable} ${lora.variable} ${notoSansJP.variable} ${notoSerifJP.variable}`}>
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
      <GoogleAnalytics />
      <body className={`${sourceSans.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <I18nProvider>
            <CursorFollower />

            {/* ヘッダー */}
            <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl">
              <div className="max-w-[1080px] mx-auto px-6 h-14 flex items-center justify-between">
                {/* ロゴ — セリフ体の「T」 */}
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                  <span className="logo-mark">T</span>
                  <span className="text-base font-bold text-fg tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>TechLog</span>
                </Link>
                {/* ナビ + トグル */}
                <div className="flex items-center gap-6">
                  <HeaderNav />
                  <div className="h-4 w-px bg-border hidden sm:block" />
                  <div className="flex items-center gap-3">
                    <LangToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
              <div className="h-px bg-border/40" />
            </header>

            <main className="flex-1 w-full">{children}</main>

            <FooterContent />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
