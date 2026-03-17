import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// サイト共通のメタデータ
export const metadata: Metadata = {
  title: {
    default: "AI Company Blog",
    template: "%s | AI Company Blog",
  },
  description: "AIと最新テクノロジーに関する情報を発信するブログ",
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
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* ヘッダー */}
        <header className="border-b border-navy-200 dark:border-navy-800 bg-white/80 dark:bg-navy-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-navy-900 dark:text-white hover:text-navy-600 dark:hover:text-navy-200 transition-colors"
            >
              AI Company Blog
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link
                href="/"
                className="text-navy-700 dark:text-navy-200 hover:text-navy-900 dark:hover:text-white transition-colors"
              >
                記事一覧
              </Link>
            </nav>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
          {children}
        </main>

        {/* フッター */}
        <footer className="border-t border-navy-200 dark:border-navy-800 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-sm text-navy-600 dark:text-navy-200">
            © {new Date().getFullYear()} AI Company Blog. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
