import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { I18nProvider } from "@/lib/i18n";
import { FooterContent } from "@/components/FooterContent";
import "./globals.css";

// Noto Sans JP
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// メタデータ
export const metadata: Metadata = {
  title: {
    default: "ラクシテ — 楽して、暮らしをアップグレード",
    template: "%s — ラクシテ",
  },
  description:
    "暮らしの便利グッズ・時短アイテム・効率化ツールを本音レビュー。楽して暮らしをアップグレードするメディア。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ラクシテ",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "licAHEJP8sOfn0Dyl7JTQBZFpuLKArCYdqqeBBqkWeo",
  },
};

// カテゴリー定義
const categories = [
  { key: "kitchen", label: "キッチン" },
  { key: "storage", label: "収納" },
  { key: "cleaning", label: "掃除" },
  { key: "desk", label: "デスク周り" },
  { key: "appliance", label: "時短家電" },
  { key: "daily", label: "日用品" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
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
      <body className={`${notoSansJP.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <I18nProvider>
            {/* ヘッダー */}
            <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-lg border-b border-border">
              <div className="max-w-[960px] mx-auto px-5 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">ラ</span>
                  <span className="text-lg font-bold text-fg">ラクシテ</span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.key}
                      href={`/?category=${cat.key}`}
                      className="px-3 py-1.5 text-xs font-medium text-fg-muted hover:text-accent hover:bg-accent-light rounded-lg transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </nav>
                <ThemeToggle />
              </div>
            </header>

            <main className="flex-1 w-full">{children}</main>
            <FooterContent />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
