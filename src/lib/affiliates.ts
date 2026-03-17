/**
 * アフィリエイトリンク挿入モジュール（ビルド時に自動実行）
 *
 * マークダウンの本文内にあるツール名を検出し、
 * affiliates.json のURLにUTMパラメータ付きで自動変換する。
 */

import fs from "fs";
import path from "path";

type AffiliateEntry = {
  name: string;
  aliases: string[];
  url: string;
  affiliateId: string;
};

type AffiliateConfig = {
  baseUtmParams: { utm_source: string; utm_medium: string };
  tools: AffiliateEntry[];
};

// 設定ファイルの読み込み（キャッシュ）
let cachedConfig: AffiliateConfig | null = null;

function loadConfig(): AffiliateConfig {
  if (cachedConfig) return cachedConfig;
  const configPath = path.join(process.cwd(), "config/affiliates.json");
  if (!fs.existsSync(configPath)) {
    cachedConfig = { baseUtmParams: { utm_source: "blog", utm_medium: "article" }, tools: [] };
    return cachedConfig;
  }
  cachedConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return cachedConfig!;
}

// UTMパラメータ付きアフィリエイトURLを生成
function buildUrl(entry: AffiliateEntry, baseUtm: AffiliateConfig["baseUtmParams"], slug: string): string {
  const params = new URLSearchParams({
    ...baseUtm,
    utm_campaign: slug,
    ref: entry.affiliateId,
  });
  const sep = entry.url.includes("?") ? "&" : "?";
  return `${entry.url}${sep}${params.toString()}`;
}

// マークダウン本文にアフィリエイトリンクを挿入
export function injectAffiliateLinks(markdownBody: string, slug: string): string {
  const config = loadConfig();
  if (config.tools.length === 0) return markdownBody;

  let body = markdownBody;

  for (const tool of config.tools) {
    const allNames = [tool.name, ...tool.aliases];
    const url = buildUrl(tool, config.baseUtmParams, slug);

    for (const name of allNames) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // リンク内やコードブロック内でない最初の出現のみ変換
      const pattern = new RegExp(`(?<![\\[\\(\`/])\\*{0,2}(${escaped})\\*{0,2}(?![\\]\\)\`])`, "");
      const match = body.match(pattern);
      if (match && match.index !== undefined) {
        const before = body.slice(0, match.index);
        const after = body.slice(match.index + match[0].length);
        // 見出し行・コードブロック内はスキップ
        const lineStart = before.lastIndexOf("\n") + 1;
        const line = before.slice(lineStart);
        if (!line.startsWith("#") && !line.startsWith("```") && !line.startsWith("    ")) {
          body = before + `[${match[1]}](${url})` + after;
        }
      }
    }
  }

  return body;
}
