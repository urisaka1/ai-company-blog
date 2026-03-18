/**
 * Amazonアフィリエイトモジュール
 *
 * 2つの記法に対応:
 * 1. <!-- amazon:product-id --> → config/amazon-products.json のIDで参照
 * 2. <!-- amazon: 商品名 | 価格帯 | ★評価 | コメント | URL --> → インライン記法
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

// 商品カードHTMLを生成（共通）
function renderCard(
  title: string,
  price: string,
  rating: string,
  comment: string,
  url: string
): string {
  return `
<div class="amazon-card not-prose" style="margin:1.5rem 0;">
  <div style="flex:1;min-width:0;">
    <p style="margin:0 0 0.25rem;font-size:0.9375rem;font-weight:700;color:var(--fg);line-height:1.4;">${title}</p>
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.375rem;">
      <span style="font-size:0.8125rem;font-weight:600;color:var(--accent-secondary);">${price}</span>
      <span style="font-size:0.8125rem;color:var(--fg-faint);">${rating}</span>
    </div>
    <p style="margin:0 0 0.75rem;font-size:0.8125rem;color:var(--fg-muted);line-height:1.5;">${comment}</p>
    <a href="${url}" target="_blank" rel="noopener noreferrer sponsored" class="amazon-btn">
      Amazonで見る →
    </a>
  </div>
</div>`;
}

// マークダウン内の Amazon記法をHTMLに変換
export function injectAmazonProducts(markdownBody: string): string {
  const config = loadConfig();

  // 記法1: <!-- amazon:product-id --> （ID参照）
  let result = markdownBody.replace(
    /<!--\s*amazon:(\S+)\s*-->/g,
    (_match, productId: string) => {
      // インライン記法（|を含む）ならスキップ
      if (productId.includes("|")) return _match;

      const product = config.products.find((p) => p.id === productId);
      if (!product) return `<!-- amazon:${productId} (not found) -->`;

      const url = buildAmazonUrl(product.asin, config.associateTag);
      return renderCard(
        product.title,
        product.price,
        "",
        product.description,
        url
      );
    }
  );

  // 記法2: <!-- amazon: 商品名 | 価格帯 | ★評価 | コメント | URL -->
  result = result.replace(
    /<!--\s*amazon:\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^>]+?)\s*-->/g,
    (_match, title: string, price: string, rating: string, comment: string, url: string) => {
      // URLにアソシエイトタグを追加
      let finalUrl = url.trim();
      if (config.associateTag && !finalUrl.includes("tag=")) {
        const separator = finalUrl.includes("?") ? "&" : "?";
        finalUrl = `${finalUrl}${separator}tag=${config.associateTag}`;
      }
      return renderCard(
        title.trim(),
        price.trim(),
        rating.trim(),
        comment.trim(),
        finalUrl
      );
    }
  );

  return result;
}

// 全商品を取得
export function getAllProducts(): AmazonProduct[] {
  const config = loadConfig();
  return config.products;
}

// カテゴリ別に商品を取得
export function getProductsByCategory(category: string): AmazonProduct[] {
  const config = loadConfig();
  return config.products.filter((p) => p.category === category);
}
