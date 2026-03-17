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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={`${notoSansJP.variable} ${inter.variable}`}>
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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <I18nProvider>
            <CursorFollower />

            {/* ヘッダー — Apple風ナビバー */}
            <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-2xl backdrop-saturate-150">
              <div className="max-w-[980px] mx-auto px-6 h-11 flex items-center justify-between">
                <Link href="/" className="text-[15px] font-semibold text-fg hover:opacity-70 transition-opacity tracking-tight">
                  TechLog
                </Link>
                <div className="flex items-center gap-5">
                  <HeaderNav />
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
