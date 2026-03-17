/**
 * note用要約自動生成ツール
 *
 * 使い方: npx ts-node --project tools/tsconfig.json tools/generate-note-summary.ts [slug]
 *
 * /content/posts/ の記事マークダウンを読み込み、
 * note投稿用の要約を /content/note-summaries/{slug}.md に保存する。
 * slugを省略した場合は最新の記事を対象にする。
 */

import * as fs from "fs";
import * as path from "path";

// サイトのベースURL
const SITE_URL = "https://ai-company-blog.vercel.app";

// --- ユーティリティ関数 ---

// フロントマターをパース（gray-matterを使わない軽量版）
function parseFrontmatter(content: string): {
  data: Record<string, string | string[]>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const data: Record<string, string | string[]> = {};
  match[1].split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // 配列の場合
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""));
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  });

  return { data, body: match[2] };
}

// マークダウンからh2見出しを抽出
function extractHeadings(body: string): string[] {
  const headings: string[] = [];
  const lines = body.split("\n");
  for (const line of lines) {
    const match = line.match(/^## (.+)$/);
    if (match) headings.push(match[1]);
  }
  return headings;
}

// マークダウンからプレーンテキストを抽出（最初のN文字）
function extractPlainText(body: string, maxLength: number): string {
  const text = body
    .replace(/^#+\s.+$/gm, "") // 見出し除去
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // リンク除去
    .replace(/[*_`~]/g, "") // 装飾除去
    .replace(/^[-*]\s/gm, "") // リスト記号除去
    .replace(/\n{2,}/g, "\n") // 連続改行をまとめる
    .trim();
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

// キーワードからハッシュタグを生成
function generateHashtags(
  tags: string[],
  title: string,
  headings: string[]
): string[] {
  const baseHashtags = tags.map((t) => `#${t}`);
  // タイトルとh2見出しからキーワードを抽出して追加
  const extraWords = [title, ...headings]
    .join(" ")
    .split(/[\s　×・｜|【】「」]+/)
    .filter((w) => w.length >= 2 && w.length <= 15)
    .map((w) => `#${w}`);

  const allHashtags = [...new Set([...baseHashtags, ...extraWords])];
  // 一般的な関連ハッシュタグを追加
  const generalTags = [
    "#AI活用",
    "#テクノロジー",
    "#副業",
    "#効率化",
    "#ブログ",
  ];
  for (const tag of generalTags) {
    if (!allHashtags.includes(tag)) allHashtags.push(tag);
  }
  return allHashtags.slice(0, 10);
}

// フック文を生成（興味を引く冒頭1〜2行）
function generateHookText(title: string, description: string): string {
  const hooks = [
    `「${title.slice(0, 20)}」——この記事を読めば、あなたの働き方が変わるかもしれません。`,
    `知らないと損する「${title.slice(0, 15)}」の世界。最新情報をまとめました。`,
    `${description.slice(0, 40)}——そんな疑問に、この記事が答えます。`,
  ];
  // タイトルの長さに応じて最適なフックを選択
  return hooks[0].length <= 80 ? hooks[0] : hooks[2];
}

// note用要約文を生成（500字以内）
function generateSummaryText(
  title: string,
  headings: string[],
  bodyText: string
): string {
  const headingList = headings
    .filter((h) => h !== "まとめ")
    .map((h) => `・${h}`)
    .join("\n");

  const summary = [
    `📝 ${title}`,
    "",
    bodyText.slice(0, 200),
    "",
    "【この記事でわかること】",
    headingList,
    "",
    "詳しくは記事本文で解説しています。",
  ].join("\n");

  return summary.length > 500 ? summary.slice(0, 497) + "…" : summary;
}

// --- メイン処理 ---

function main(): void {
  const args = process.argv.slice(2);
  const postsDir = path.join(process.cwd(), "content/posts");
  const outputDir = path.join(process.cwd(), "content/note-summaries");

  // 記事ファイルの一覧を取得
  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error("❌ エラー: /content/posts/ に記事が見つかりません");
    process.exit(1);
  }

  // slug指定がある場合はそのファイルを、なければ最新の記事を対象にする
  let targetFile: string | undefined;
  if (args[0]) {
    targetFile = files.find((f) => f.includes(args[0]));
    if (!targetFile) {
      console.error(`❌ エラー: "${args[0]}" に一致する記事が見つかりません`);
      process.exit(1);
    }
  } else {
    targetFile = files[0];
  }

  const slug = targetFile.replace(/\.md$/, "");
  const filePath = path.join(postsDir, targetFile);
  const content = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(content);

  const title = (data.title as string) || slug;
  const description = (data.description as string) || "";
  const tags = (data.tags as string[]) || [];
  const headings = extractHeadings(body);
  const bodyText = extractPlainText(body, 300);

  // 各パーツを生成
  const hookText = generateHookText(title, description);
  const summaryText = generateSummaryText(title, headings, bodyText);
  const hashtags = generateHashtags(tags, title, headings);
  const articleUrl = `${SITE_URL}/posts/${slug}`;

  // note用マークダウンを組み立て
  const noteMarkdown = [
    `---`,
    `title: "${title}"`,
    `source: "${slug}"`,
    `generated: "${new Date().toISOString().split("T")[0]}"`,
    `---`,
    ``,
    `## フック文`,
    ``,
    hookText,
    ``,
    `## 要約文`,
    ``,
    summaryText,
    ``,
    `---`,
    ``,
    `続きはこちら → ${articleUrl}`,
    ``,
    `## ハッシュタグ`,
    ``,
    hashtags.join(" "),
    ``,
  ].join("\n");

  // 出力ディレクトリの確認・作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // ファイルに保存
  const outputPath = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(outputPath, noteMarkdown, "utf8");

  console.log("✅ note用要約を生成しました");
  console.log(`📄 ファイル: content/note-summaries/${slug}.md`);
  console.log(`🔗 記事URL: ${articleUrl}`);
  console.log(`🏷️  ハッシュタグ: ${hashtags.join(" ")}`);
}

main();
