"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

// ヘッダーナビゲーション（i18n対応）
export function HeaderNav() {
  const { t } = useI18n();

  return (
    <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-fg-muted">
      <Link href="/" className="hover:text-accent transition-colors duration-300">
        {t("nav.articles")}
      </Link>
    </nav>
  );
}
