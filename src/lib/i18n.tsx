"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 対応言語
export type Locale = "ja" | "en";

// 翻訳辞書
const dict = {
  // ヘッダー
  "nav.articles": { ja: "記事一覧", en: "Articles" },
  "nav.home": { ja: "ホーム", en: "Home" },

  // ヒーロー
  "hero.catch1": { ja: "テクノロジーを、", en: "Technology," },
  "hero.catch2": { ja: "もっと", en: "Made" },
  "hero.catch3": { ja: "わかりやすく。", en: "Simple." },
  "hero.sub1": { ja: "AI・ガジェット・スマホ・PCの最新情報を、", en: "The latest on AI, gadgets, smartphones & PCs —" },
  "hero.sub2": { ja: "実際に使った体験談つきでお届けします", en: "with hands-on reviews you can trust" },
  "hero.cta": { ja: "最新記事をチェック", en: "Latest Articles" },
  "hero.live": { ja: "毎日更新中", en: "Updated Daily" },
  "hero.gadgets": { ja: "📱 ガジェット", en: "📱 Gadgets" },
  "hero.ai": { ja: "🤖 AI", en: "🤖 AI" },
  "hero.pc": { ja: "💻 PC", en: "💻 PC" },
  "hero.efficiency": { ja: "⚡ 効率化", en: "⚡ Productivity" },

  // 記事一覧
  "articles.title": { ja: "最新の記事", en: "Latest Articles" },
  "articles.count": { ja: "件", en: "" },
  "articles.all": { ja: "すべて", en: "All" },
  "articles.read": { ja: "読む", en: "Read" },

  // 記事詳細
  "post.home": { ja: "ホーム", en: "Home" },
  "post.author": { ja: "テクログ編集部", en: "TechLog Editorial" },
  "post.readtime": { ja: "分で読める", en: "min read" },
  "post.share": { ja: "シェア", en: "Share" },
  "post.back": { ja: "記事一覧に戻る", en: "Back to Articles" },
  "post.related": { ja: "関連記事", en: "Related Articles" },

  // フッター
  "footer.desc1": { ja: "AI・ガジェット・テクノロジーの", en: "The latest in AI, gadgets" },
  "footer.desc2": { ja: "最新情報をわかりやすくお届け！", en: "& tech — made simple!" },
  "footer.nav": { ja: "ナビゲーション", en: "Navigation" },
  "footer.follow": { ja: "フォロー", en: "Follow" },
  "footer.home": { ja: "ホーム", en: "Home" },
  "footer.articles": { ja: "記事一覧", en: "Articles" },
} as const;

type DictKey = keyof typeof dict;

// Context
type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey) => string;
};

const I18nContext = createContext<I18nContextType>({
  locale: "ja",
  setLocale: () => {},
  t: (key) => dict[key]?.ja || key,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ja");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && (saved === "ja" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  };

  const t = (key: DictKey): string => {
    return dict[key]?.[locale] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
