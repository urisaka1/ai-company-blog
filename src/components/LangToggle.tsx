"use client";

import { useI18n } from "@/lib/i18n";

// 言語切り替えトグル（日/英）
export function LangToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "ja" ? "en" : "ja")}
      aria-label="Switch language"
      className="relative w-[52px] h-7 rounded-full bg-bg-secondary border border-border hover:border-accent/40 transition-all duration-300 flex items-center px-0.5 group"
    >
      {/* スライダー */}
      <div
        className="absolute w-6 h-6 rounded-full bg-accent shadow-md transition-transform duration-300 ease-out"
        style={{ transform: locale === "en" ? "translateX(23px)" : "translateX(0px)" }}
      />
      {/* ラベル */}
      <span className={`relative z-10 text-[10px] font-bold w-6 text-center transition-colors duration-300 ${locale === "ja" ? "text-white" : "text-fg-faint"}`}>
        JP
      </span>
      <span className={`relative z-10 text-[10px] font-bold w-6 text-center transition-colors duration-300 ${locale === "en" ? "text-white" : "text-fg-faint"}`}>
        EN
      </span>
    </button>
  );
}
