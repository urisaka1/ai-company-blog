"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

// Apple風ヘッダーナビゲーション
export function HeaderNav() {
  const { t } = useI18n();

  return (
    <nav className="hidden sm:flex items-center gap-6">
      <Link href="/" className="text-xs text-fg-faint hover:text-fg transition-colors">
        {t("nav.articles")}
      </Link>
    </nav>
  );
}
