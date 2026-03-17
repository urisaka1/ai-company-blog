/**
 * アフィリエイトリンク自動挿入ツール
 *
 * 使い方:
 *   CLIモード: npx ts-node --project tools/tsconfig.json tools/affiliates/inject-links.ts [slug]
 *   ビルド時:  next.config.ts の webpack プラグインから自動呼び出し
 *
 * マークダウン記事内のツール名を検出し、
 * affiliates.json に登録されたアフィリエイトリンクに自動変換する。
 * UTMパラメータも自動付与。
 */

import * as fs from "fs";
import * as path from "path";

// --- 型定義 ---

type AffiliateEntry = {
  name: string;
  aliases: string[];
  url: string;
  affiliateId: string;
};

type AffiliateConfig = {
  baseUtmParams: {
    utm_source: string;
    utm_medium: string;
  };
  tools: AffiliateEntry[];
};

// --- アフィリエイト設定の読み込み ---

function loadConfig(): AffiliateConfig {
  const configPath = path.join(process.cwd(), "config/affiliates.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("config/affiliates.json が見つかりません");
  }
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

// --- UTMパラメータ付きURLを生成 ---

function buildAffiliateUrl(
  entry: AffiliateEntry,
  baseUtm: AffiliateConfig["baseUtmParams"],
  slug: string
): string {
  const params = new URLSearchParams({
    ...baseUtm,
    utm_campaign: slug,
    ref: entry.affiliateId,
  });
  const separator = entry.url.includes("?") ? "&" : "?";
  return `${entry.url}${separator}${params.toString()}`;
}

// --- マークダウン内のツール名にリンクを挿入 ---

export function injectAffiliateLinks(
  markdown: string,
  slug: string,
  config?: AffiliateConfig
): string {
  const cfg = config || loadConfig();
  let result = markdown;

  // 各ツールについてリンクを挿入
  for (const tool of cfg.tools) {
    const allNames = [tool.name, ...tool.aliases];
    const affiliateUrl = buildAffiliateUrl(tool, cfg.baseUtmParams, slug);

    for (const name of allNames) {
      // すでにリンク化されているものはスキップ（[name](url) 形式）
      // フロントマター内（---で囲まれた部分）もスキップ
      // 見出し行（#で始まる行）内もスキップ

      // 正規表現: リンク内でない、コードブロック内でない、フロントマター内でない独立したツール名
      // マッチ条件: 前後が [ ] ( ) でない、かつ単語の一部でない
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // まずフロントマターを除外して本文部分だけ処理
      const frontmatterMatch = result.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
      if (!frontmatterMatch) continue;

      const frontmatter = frontmatterMatch[1];
      let body = frontmatterMatch[2];

      // 本文内で、まだリンク化されていないツール名を検出してリンクに変換
      // 各ツール名は記事内で最初の出現のみリンク化（過剰なリンクを避ける）
      const pattern = new RegExp(
        // リンク内でないことを確認（前に [ や ( がない）
        `(?<![\\[\\(])\\*{0,2}(${escapedName})\\*{0,2}(?![\\]\\)])`,
        ""
      );

      const match = body.match(pattern);
      if (match && match.index !== undefined) {
        const before = body.slice(0, match.index);
        const after = body.slice(match.index + match[0].length);

        // 見出し行やコードブロック内でないか確認
        const lineStart = before.lastIndexOf("\n") + 1;
        const currentLine = before.slice(lineStart);

        // 見出し行、コードブロック内はスキップ
        if (
          !currentLine.startsWith("#") &&
          !currentLine.startsWith("```") &&
          !currentLine.startsWith("    ")
        ) {
          const linkedText = `[${match[1]}](${affiliateUrl})`;
          body = before + linkedText + after;
        }
      }

      result = frontmatter + body;
    }
  }

  return result;
}

// --- 全記事に対してリンクを挿入（ビルド時用） ---

export function processAllPosts(): { file: string; linksInjected: number }[] {
  const config = loadConfig();
  const postsDir = path.join(process.cwd(), "content/posts");
  const results: { file: string; linksInjected: number }[] = [];

  if (!fs.existsSync(postsDir)) return results;

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const original = fs.readFileSync(filePath, "utf8");
    const slug = file.replace(/\.md$/, "");

    const processed = injectAffiliateLinks(original, slug, config);

    // 変更があった場合のみカウント
    const linkCount = (processed.match(/\]\(https?:\/\/[^)]*ref=af-/g) || []).length;

    // 処理済みファイルは別ディレクトリに保存（元ファイルは変更しない）
    const outputDir = path.join(process.cwd(), "content/posts-processed");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outputDir, file), processed, "utf8");

    results.push({ file, linksInjected: linkCount });
  }

  return results;
}

// --- CLI メイン処理 ---

function main(): void {
  const args = process.argv.slice(2);
  const config = loadConfig();

  if (args[0] === "--all") {
    // 全記事処理モード
    console.log("🔗 全記事にアフィリエイトリンクを挿入します...\n");
    const results = processAllPosts();

    if (results.length === 0) {
      console.log("⚠️  処理対象の記事がありません");
      return;
    }

    let totalLinks = 0;
    results.forEach((r) => {
      const icon = r.linksInjected > 0 ? "✅" : "⬜";
      console.log(`  ${icon} ${r.file} → ${r.linksInjected}件のリンク`);
      totalLinks += r.linksInjected;
    });

    console.log(`\n📊 合計: ${results.length}記事, ${totalLinks}リンク挿入`);
    console.log(`📁 出力先: content/posts-processed/`);
  } else {
    // 単一記事処理モード
    const postsDir = path.join(process.cwd(), "content/posts");
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

    let targetFile: string | undefined;
    if (args[0]) {
      targetFile = files.find((f) => f.includes(args[0]));
    } else {
      targetFile = files.sort().reverse()[0];
    }

    if (!targetFile) {
      console.error("❌ エラー: 対象の記事が見つかりません");
      process.exit(1);
    }

    const slug = targetFile.replace(/\.md$/, "");
    const filePath = path.join(postsDir, targetFile);
    const original = fs.readFileSync(filePath, "utf8");

    console.log(`🔗 アフィリエイトリンクを挿入: ${targetFile}`);
    console.log(`📋 登録ツール数: ${config.tools.length}\n`);

    const processed = injectAffiliateLinks(original, slug, config);

    // 処理済みファイルを保存
    const outputDir = path.join(process.cwd(), "content/posts-processed");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, targetFile);
    fs.writeFileSync(outputPath, processed, "utf8");

    // 挿入されたリンクをカウント・表示
    const links = processed.match(/\]\(https?:\/\/[^)]*ref=af-[^)]*\)/g) || [];
    console.log(`✅ ${links.length}件のアフィリエイトリンクを挿入しました`);
    links.forEach((link) => {
      const nameMatch = link.match(/\[([^\]]+)\]/);
      const urlMatch = link.match(/\((https?:\/\/[^)]+)\)/);
      if (nameMatch && urlMatch) {
        console.log(`  🔗 ${nameMatch[1]} → ${urlMatch[1].slice(0, 60)}...`);
      }
    });
    console.log(`\n📄 出力: content/posts-processed/${targetFile}`);
  }
}

// CLIから直接実行された場合のみmainを実行
if (require.main === module) {
  main();
}
