/**
 * Amazonアフィリエイトモジュール
 *
 * マークダウン内の <!-- amazon:product-id --> タグを
 * Amazon商品カードHTMLに変換する
 */

import fs from "fs";
import path from "path";

type AmazonProduct = {
  id: string;
  title: string;
  description: string;
  asin: string;
  price: string;
  imageUrl: string;
  category: string;
};

type AmazonConfig = {
  associateTag: string;
  products: AmazonProduct[];
};

// 設定キャッシュ
let cachedConfig: AmazonConfig | null = null;

function loadConfig(): AmazonConfig {
  if (cachedConfig) return cachedConfig;
  const configPath = path.join(process.cwd(), "config/amazon-products.json");
  if (!fs.existsSync(configPath)) {
    cachedConfig = { associateTag: "", products: [] };
    return cachedConfig;
  }
  cachedConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return cachedConfig!;
}

// Amazon商品リンクURLを生成
function buildAmazonUrl(asin: string, tag: string): string {
  return `https://www.amazon.co.jp/dp/${asin}?tag=${tag}&linkCode=ogi&th=1&psc=1`;
}

// マークダウン内の <!-- amazon:ID --> を商品カードHTMLに変換
export function injectAmazonProducts(markdownBody: string): string {
  const config = loadConfig();
  if (config.products.length === 0) return markdownBody;

  // <!-- amazon:product-id --> パターンを検出
  return markdownBody.replace(
    /<!--\s*amazon:(\S+)\s*-->/g,
    (_match, productId: string) => {
      const product = config.products.find((p) => p.id === productId);
      if (!product) return `<!-- amazon:${productId} (not found) -->`;

      const url = buildAmazonUrl(product.asin, config.associateTag);

      // マークダウンではHTMLをそのまま書ける
      return `
<div class="amazon-card not-prose">
  <div style="flex-shrink:0;width:100px;height:100px;display:flex;align-items:center;justify-content:center;background:var(--bg-secondary);border-radius:0.5rem;overflow:hidden;">
    <img src="${product.imageUrl}" alt="${product.title}" style="max-width:90px;max-height:90px;object-fit:contain;" loading="lazy" />
  </div>
  <div style="flex:1;min-width:0;">
    <p style="margin:0 0 0.25rem;font-size:0.75rem;color:var(--fg-faint);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${product.category}</p>
    <p style="margin:0 0 0.375rem;font-size:0.9375rem;font-weight:700;color:var(--fg);line-height:1.3;letter-spacing:-0.01em;">${product.title}</p>
    <p style="margin:0 0 0.625rem;font-size:0.8125rem;color:var(--fg-muted);line-height:1.5;">${product.description}</p>
    <div style="display:flex;align-items:center;gap:0.75rem;">
      <a href="${url}" target="_blank" rel="noopener noreferrer sponsored" class="amazon-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.045 18.02c.07-.116.36-.31.77-.583 3.53-2.304 6.47-5.123 8.82-8.456a1.74 1.74 0 0 0-.15 1.19c.18.67.76 1.06 1.45 1.06.5 0 .92-.27 1.2-.7.02-.07.08-.12.1-.19l-.02.19c-.12 1.56-.64 3.08-1.47 4.38-1.46 2.28-3.62 3.97-6.29 4.65-.36.09-.73.11-1.09.02-.12-.03-.21-.12-.27-.2z"/><path d="M13.34 14.91c-1.47 1.26-3.39 1.96-5.36 1.96-2.55 0-4.84-1.2-6.58-3.18-.13-.16-.02-.38.15-.26 1.87 1.1 4.19 1.76 6.58 1.76 1.61 0 3.39-.34 5.02-.99.25-.1.46.16.19.71z"/><path d="M14.26 13.64c-.2-.27-.32-.55-.35-.83.03-.02.09-.02.15-.02 1.01.02 2.84.42 3.36.77.16.1.12.26-.05.24-.63-.08-2.18-.24-3.11-.16z"/></svg>
        Amazonで見る
      </a>
      <span style="font-size:0.875rem;font-weight:700;color:var(--accent-secondary);">${product.price}</span>
    </div>
  </div>
</div>`;
    }
  );
}

// 全商品を取得（サイドバーやおすすめ表示用）
export function getAllProducts(): AmazonProduct[] {
  const config = loadConfig();
  return config.products;
}

// カテゴリ別に商品を取得
export function getProductsByCategory(category: string): AmazonProduct[] {
  const config = loadConfig();
  return config.products.filter((p) => p.category === category);
}
