"use client";

import { useI18n } from "@/lib/i18n";

// 言語切り替え — Apple風ミニマルトグル
export function LangToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "ja" ? "en" : "ja")}
      aria-label="Switch language"
      className="text-xs text-fg-faint hover:text-fg transition-colors font-medium tracking-wide"
    >
      {locale === "ja" ? "EN" : "JP"}
    </button>
  );
}
