"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 対応言語（ラクシテは日本語のみだが拡張性のため残す）
export type Locale = "ja" | "en";

// 翻訳辞書
const dict = {
  // ヘッダー
  "nav.articles": { ja: "記事一覧", en: "Articles" },
  "nav.home": { ja: "ホーム", en: "Home" },

  // ヒーロー
  "hero.catch1": { ja: "楽して、", en: "Upgrade your" },
  "hero.catch2": { ja: "暮らしを", en: "daily life" },
  "hero.catch3": { ja: "アップグレード", en: "the easy way" },
  "hero.sub1": { ja: "暮らしの便利グッズ・時短アイテムを", en: "Honest reviews of daily life gadgets" },
  "hero.sub2": { ja: "本音レビューでお届けします", en: "and time-saving products" },
  "hero.cta": { ja: "記事を読む", en: "Read Articles" },
  "hero.badge": { ja: "便利グッズ × 時短 × 効率化", en: "Gadgets × Time-saving × Efficiency" },

  // カテゴリー
  "cat.kitchen": { ja: "キッチン", en: "Kitchen" },
  "cat.storage": { ja: "収納", en: "Storage" },
  "cat.cleaning": { ja: "掃除", en: "Cleaning" },
  "cat.desk": { ja: "デスク周り", en: "Desk" },
  "cat.appliance": { ja: "時短家電", en: "Appliances" },
  "cat.daily": { ja: "日用品", en: "Daily" },
  "cat.other": { ja: "その他", en: "Other" },

  // 記事一覧
  "articles.title": { ja: "最新の記事", en: "Latest Articles" },
  "articles.count": { ja: "件", en: "" },
  "articles.all": { ja: "すべて", en: "All" },
  "articles.read": { ja: "読む", en: "Read" },

  // 記事詳細
  "post.home": { ja: "ホーム", en: "Home" },
  "post.author": { ja: "ラクシテ編集部", en: "Rakushite Editorial" },
  "post.readtime": { ja: "分で読める", en: "min read" },
  "post.share": { ja: "シェア", en: "Share" },
  "post.back": { ja: "記事一覧に戻る", en: "Back to Articles" },
  "post.related": { ja: "関連記事", en: "Related Articles" },
  "post.products": { ja: "この記事で紹介した商品", en: "Products in this article" },

  // フッター
  "footer.desc1": { ja: "暮らしの便利グッズ・時短アイテムを", en: "Honest reviews of daily life gadgets" },
  "footer.desc2": { ja: "本音レビューでお届け！", en: "and time-saving products!" },
  "footer.nav": { ja: "ナビゲーション", en: "Navigation" },
  "footer.follow": { ja: "フォロー", en: "Follow" },
  "footer.home": { ja: "ホーム", en: "Home" },
  "footer.articles": { ja: "記事一覧", en: "Articles" },
  "footer.privacy": { ja: "プライバシーポリシー", en: "Privacy Policy" },
  "footer.contact": { ja: "お問い合わせ", en: "Contact" },
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
