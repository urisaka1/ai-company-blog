/**
 * 記事自動生成CLIツール
 *
 * 使い方: npx ts-node --project tools/tsconfig.json tools/generate-post.ts "キーワード"
 *
 * キーワードを受け取り、SEO最適化されたマークダウン記事のスケルトンを生成し、
 * /content/posts/{日付}-{slug}.md に保存する。
 * 記事の中身は後でClaude等に書かせる前提のテンプレート方式。
 */

import * as fs from "fs";
import * as path from "path";
import {
  SECTION_TEMPLATES,
  buildFrontmatter,
  applyKeyword,
} from "./templates/post-template";

// --- ユーティリティ関数 ---

// 日本語キーワードからURLスラッグを生成
function toSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// 今日の日付をYYYY-MM-DD形式で返す
function getToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// SEO最適化タイトルを生成（32字以内）
function generateTitle(keyword: string): string {
  const templates = [
    `${keyword}完全ガイド【2026年最新版】`,
    `${keyword}入門｜初心者向け徹底解説`,
    `【2026年】${keyword}の始め方と活用法`,
    `${keyword}とは？使い方と実践テクニック`,
  ];
  // 32字以内に収まる最初のテンプレートを選択
  const title = templates.find((t) => t.length <= 32) || templates[0];
  return title.length > 32 ? title.slice(0, 32) : title;
}

// メタディスクリプションを生成（120字以内）
function generateDescription(keyword: string): string {
  const desc = `${keyword}について初心者にもわかりやすく解説。具体的なツール名や手順、活用事例を交えて、今日から始められる実践的な情報をお届けします。`;
  return desc.length > 120 ? desc.slice(0, 120) : desc;
}

// キーワードからタグを生成
function generateTags(keyword: string): string[] {
  const words = keyword.split(/[\s　]+/);
  const baseTags = words.filter((w) => w.length > 0);
  const extraTags = ["AI", "2026", "初心者向け"];
  const tags = [...new Set([...baseTags, ...extraTags])];
  return tags.slice(0, 5);
}

// 記事本文のマークダウンを組み立て
function buildMarkdownBody(keyword: string): string {
  const sections = SECTION_TEMPLATES.map((section) => {
    const heading = applyKeyword(section.headingTemplate, keyword);
    const guide = applyKeyword(section.guideText, keyword);
    return `## ${heading}\n\n${guide}\n`;
  });

  // 導入文
  const intro = `この記事では「${keyword}」について、基本から実践まで徹底的に解説します。具体的なツールや手順を交えながら、初心者の方でもすぐに始められる内容をお届けします。\n`;

  return [intro, ...sections].join("\n");
}

// --- メイン処理 ---

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("❌ エラー: キーワードを指定してください");
    console.error("使い方: npx ts-node --project tools/tsconfig.json tools/generate-post.ts \"キーワード\"");
    process.exit(1);
  }

  const keyword = args[0];
  const today = getToday();
  const slug = toSlug(keyword);
  const fileName = `${today}-${slug}.md`;
  const title = generateTitle(keyword);
  const description = generateDescription(keyword);
  const tags = generateTags(keyword);

  // フロントマターを生成
  const frontmatter = buildFrontmatter({
    title,
    description,
    date: today,
    tags,
    slug,
  });

  // 本文を生成
  const body = buildMarkdownBody(keyword);

  // マークダウンファイルの完成
  const markdown = `${frontmatter}\n\n${body}`;

  // 保存先ディレクトリの確認・作成
  const outputDir = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // ファイルに保存
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, markdown, "utf8");

  // 結果を表示
  console.log("✅ 記事スケルトンを生成しました");
  console.log(`📄 ファイル: content/posts/${fileName}`);
  console.log(`📝 タイトル: ${title}`);
  console.log(`🏷️  タグ: ${tags.join(", ")}`);
  console.log(`📏 ディスクリプション（${description.length}字）: ${description}`);
}

main();
