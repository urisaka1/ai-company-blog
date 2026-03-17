/**
 * SNS投稿文自動生成ツール
 *
 * 使い方: npx ts-node --project tools/tsconfig.json tools/generate-sns.ts [slug]
 *
 * /content/posts/ の記事マークダウンを読み込み、
 * X（Twitter）用ツイートとInstagramキャプションを生成し、
 * /content/sns/{slug}.json に保存する。
 * slugを省略した場合は最新の記事を対象にする。
 */

import * as fs from "fs";
import * as path from "path";

// サイトのベースURL
const SITE_URL = "https://ai-company-blog.vercel.app";

// --- ユーティリティ関数 ---

// フロントマターをパース
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
  for (const line of body.split("\n")) {
    const match = line.match(/^## (.+)$/);
    if (match) headings.push(match[1]);
  }
  return headings;
}

// 文字列を指定文字数以内に切り詰め
function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
}

// X（Twitter）用ツイートを5パターン生成（140字以内、絵文字あり）
function generateTweets(
  title: string,
  description: string,
  headings: string[],
  url: string
): string[] {
  const tweets: string[] = [];

  // パターン1: ストレートな紹介
  tweets.push(
    truncate(`📝 新着記事を公開しました！\n\n「${title}」\n\n${description.slice(0, 50)}\n\n${url}`, 140)
  );

  // パターン2: 疑問形で興味を引く
  tweets.push(
    truncate(`🤔 ${title.slice(0, 20)}、知っていますか？\n\n${description.slice(0, 40)}を詳しく解説👇\n\n${url}`, 140)
  );

  // パターン3: 見出しをハイライト
  const topHeadings = headings
    .filter((h) => h !== "まとめ")
    .slice(0, 3)
    .map((h) => `✅ ${h.slice(0, 15)}`)
    .join("\n");
  tweets.push(
    truncate(`🔥 ${title.slice(0, 20)}\n\n${topHeadings}\n\n詳細はブログで👇\n${url}`, 140)
  );

  // パターン4: 数字やデータを強調
  tweets.push(
    truncate(`💡 ${title}\n\n具体的なツールと手順を徹底解説しました！\n\n${url}`, 140)
  );

  // パターン5: CTA強め
  tweets.push(
    truncate(`🚀 今すぐチェック！\n\n「${title}」\n\n初心者でもわかる実践ガイドです✨\n\n${url}`, 140)
  );

  return tweets;
}

// Instagramキャプションを2パターン生成（ハッシュタグ30個付き）
function generateInstagramCaptions(
  title: string,
  description: string,
  headings: string[],
  tags: string[],
  url: string
): string[] {
  // ハッシュタグ30個を生成
  const baseTags = tags.map((t) => `#${t}`);
  const headingTags = headings
    .filter((h) => h !== "まとめ")
    .map((h) => {
      const cleaned = h
        .replace(/[？?！!【】「」]/g, "")
        .split(/[\s　・×]+/)
        .filter((w) => w.length >= 2)
        .slice(0, 2)
        .map((w) => `#${w}`);
      return cleaned;
    })
    .flat();
  const generalTags = [
    "#AI",
    "#AI活用",
    "#テクノロジー",
    "#ブログ更新",
    "#副業",
    "#フリーランス",
    "#効率化",
    "#自動化",
    "#プログラミング",
    "#エンジニア",
    "#ノーコード",
    "#ChatGPT",
    "#Claude",
    "#Gemini",
    "#生成AI",
    "#DX",
    "#デジタル",
    "#スキルアップ",
    "#学び",
    "#2026",
    "#最新情報",
    "#おすすめ",
    "#仕事術",
    "#ライフハック",
    "#IT",
    "#Web開発",
    "#マーケティング",
    "#SNS運用",
    "#コンテンツ",
    "#情報発信",
  ];
  const allTags = [...new Set([...baseTags, ...headingTags, ...generalTags])];
  const hashtags = allTags.slice(0, 30).join(" ");

  const captions: string[] = [];

  // パターン1: 情報提供型
  const headingList = headings
    .filter((h) => h !== "まとめ")
    .slice(0, 4)
    .map((h, i) => `${i + 1}️⃣ ${h.slice(0, 25)}`)
    .join("\n");
  captions.push(
    [
      `📝 ${title}`,
      ``,
      description,
      ``,
      `この記事でわかること👇`,
      headingList,
      ``,
      `🔗 詳細はプロフィールのリンクから！`,
      `${url}`,
      ``,
      `---`,
      hashtags,
    ].join("\n")
  );

  // パターン2: ストーリー型
  captions.push(
    [
      `💡 知ってた？`,
      ``,
      `「${title.slice(0, 25)}」`,
      ``,
      `${description}`,
      ``,
      `初心者の方でもすぐに始められる内容にまとめました✨`,
      ``,
      `気になった方はプロフィールのリンクをチェック👆`,
      `${url}`,
      ``,
      `いいね・保存してくれると嬉しいです🙏`,
      ``,
      `---`,
      hashtags,
    ].join("\n")
  );

  return captions;
}

// --- メイン処理 ---

function main(): void {
  const args = process.argv.slice(2);
  const postsDir = path.join(process.cwd(), "content/posts");
  const outputDir = path.join(process.cwd(), "content/sns");

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
  const articleUrl = `${SITE_URL}/posts/${slug}`;

  // ツイートとInstagramキャプションを生成
  const tweets = generateTweets(title, description, headings, articleUrl);
  const instagramCaptions = generateInstagramCaptions(
    title,
    description,
    headings,
    tags,
    articleUrl
  );

  // JSON形式で保存
  const snsData = {
    slug,
    title,
    url: articleUrl,
    generatedAt: new Date().toISOString(),
    twitter: tweets.map((tweet, i) => ({
      pattern: i + 1,
      text: tweet,
      charCount: tweet.length,
    })),
    instagram: instagramCaptions.map((caption, i) => ({
      pattern: i + 1,
      text: caption,
    })),
  };

  // 出力ディレクトリの確認・作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(snsData, null, 2), "utf8");

  console.log("✅ SNS投稿文を生成しました");
  console.log(`📄 ファイル: content/sns/${slug}.json`);
  console.log(`🐦 X（Twitter）ツイート: ${tweets.length}パターン`);
  tweets.forEach((t, i) => {
    console.log(`   パターン${i + 1}（${t.length}字）: ${t.split("\n")[0]}...`);
  });
  console.log(`📸 Instagramキャプション: ${instagramCaptions.length}パターン`);
}

main();
