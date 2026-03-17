/**
 * SEOキーワードリサーチツール
 *
 * 使い方: npx ts-node --project tools/tsconfig.json tools/seo/keyword-research.ts "URL1" "URL2" ...
 *
 * 競合サイトのURLをPlaywrightでスクレイピングし、
 * キーワード分析と記事テーマの提案を行う。
 * 結果を /plans/keyword-research-{日付}.md に保存。
 */

import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

// --- 型定義 ---

type PageData = {
  url: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  headings: { level: string; text: string }[];
  frequentWords: { word: string; count: number }[];
};

type ThemeProposal = {
  rank: number;
  theme: string;
  reason: string;
  priority: "高" | "中" | "低";
  sourceKeywords: string[];
};

// --- 日本語ストップワード ---

const STOP_WORDS = new Set([
  "の", "に", "は", "を", "た", "が", "で", "て", "と", "し", "れ", "さ",
  "ある", "いる", "も", "する", "から", "な", "こと", "として", "い", "や",
  "れる", "など", "なっ", "ない", "この", "ため", "その", "あっ", "よう",
  "また", "もの", "という", "あり", "まで", "られ", "なる", "へ", "か",
  "だ", "これ", "によって", "により", "おり", "より", "による", "ず", "なり",
  "られる", "において", "ば", "なかっ", "なく", "しかし", "について", "せ",
  "だっ", "その後", "できる", "それ", "ない", "です", "ます", "でも",
  "ので", "よう", "ませ", "けど", "だけ", "でき", "そう", "ところ",
  "ここ", "そこ", "あそこ", "これ", "それ", "あれ", "この", "その", "あの",
  "こう", "そう", "ああ", "どう", "私", "僕", "俺", "彼", "彼女",
  "とき", "ほど", "くらい", "ぐらい", "まま", "ほう", "かた",
  // 一般的な機能語
  "amp", "nbsp", "the", "and", "for", "that", "this", "with", "you",
  "are", "not", "was", "but", "have", "from", "been", "has", "its",
  "will", "can", "all", "one", "our", "new", "more", "when", "who",
]);

// --- ページスクレイピング ---

async function scrapePage(page: Page, url: string): Promise<PageData> {
  console.log(`  🔍 アクセス中: ${url}`);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    // ページ読み込み待機
    await page.waitForTimeout(2000);
  } catch (err) {
    console.log(`  ⚠️  ページ読み込みタイムアウト、取得済みデータで続行します`);
  }

  // ページタイトルを取得
  const title = await page.title();

  // meta descriptionを取得
  const metaDescription = await page
    .$eval('meta[name="description"]', (el) => el.getAttribute("content") || "")
    .catch(() => "");

  // meta keywordsを取得
  const metaKeywords = await page
    .$eval('meta[name="keywords"]', (el) => el.getAttribute("content") || "")
    .catch(() => "");

  // h1〜h3の見出しを抽出
  const headings = await page.$$eval("h1, h2, h3", (elements) =>
    elements.map((el) => ({
      level: el.tagName.toLowerCase(),
      text: (el.textContent || "").trim().slice(0, 100),
    }))
  );

  // 本文テキストを抽出
  const bodyText = await page.$$eval(
    "article, main, .content, .post, .entry, body",
    (elements) => {
      // 最も具体的なコンテナのテキストを取得
      const el = elements[0] || document.body;
      return (el.textContent || "").trim();
    }
  );

  // 頻出ワード分析
  const frequentWords = analyzeFrequentWords(bodyText);

  return {
    url,
    title,
    metaDescription,
    metaKeywords,
    headings: headings.filter((h) => h.text.length > 0),
    frequentWords,
  };
}

// --- テキスト分析 ---

// 本文から頻出ワードを抽出（上位20個）
function analyzeFrequentWords(
  text: string
): { word: string; count: number }[] {
  // テキストの前処理
  const cleaned = text
    .replace(/[\n\r\t]+/g, " ")
    .replace(/[!-/:-@[-`{-~]/g, " ") // ASCII記号除去
    .replace(/[！-／：-＠［-｀｛-～、。・「」『』（）【】]/g, " ") // 全角記号除去
    .replace(/\s+/g, " ")
    .trim();

  // 簡易的な単語分割（2〜10文字のカタカナ・漢字・英数字の塊を抽出）
  const patterns = [
    /[\u30A0-\u30FF]{2,10}/g, // カタカナ語
    /[\u4E00-\u9FFF]{2,6}/g, // 漢字語
    /[A-Za-z][A-Za-z0-9]{2,15}/g, // 英単語
    /[\u3040-\u309F\u4E00-\u9FFF\u30A0-\u30FF]{3,8}/g, // 混合語
  ];

  const wordCount = new Map<string, number>();

  for (const pattern of patterns) {
    const matches = cleaned.match(pattern) || [];
    for (const word of matches) {
      const lower = word.toLowerCase();
      if (STOP_WORDS.has(lower) || lower.length < 2) continue;
      wordCount.set(lower, (wordCount.get(lower) || 0) + 1);
    }
  }

  // 出現回数でソートして上位20個を返す
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
}

// --- テーマ提案生成 ---

// スクレイピング結果から記事テーマを10個提案
function generateThemeProposals(pages: PageData[]): ThemeProposal[] {
  // 全ページの見出しとキーワードを集約
  const allHeadings = pages.flatMap((p) => p.headings.map((h) => h.text));
  const allFrequentWords = pages.flatMap((p) =>
    p.frequentWords.map((w) => w.word)
  );
  const allTitles = pages.map((p) => p.title);

  // 頻出ワードの出現回数を集計
  const wordScores = new Map<string, number>();
  for (const page of pages) {
    for (const { word, count } of page.frequentWords) {
      wordScores.set(word, (wordScores.get(word) || 0) + count);
    }
  }

  // スコア上位のキーワードを取得
  const topKeywords = Array.from(wordScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);

  // 見出しからテーマ候補を抽出
  const headingThemes = allHeadings
    .filter((h) => h.length >= 5 && h.length <= 50)
    .filter((h) => !h.match(/^(メニュー|ホーム|サイトマップ|カテゴリ|アーカイブ|プロフィール)/));

  // テーマ提案を生成
  const proposals: ThemeProposal[] = [];
  const usedThemes = new Set<string>();

  // 戦略1: 見出しベースのテーマ（高優先度）
  for (const heading of headingThemes) {
    if (proposals.length >= 4 || usedThemes.has(heading)) continue;
    const relatedKeywords = topKeywords.filter(
      (k) => heading.includes(k) || k.length >= 3
    ).slice(0, 3);
    proposals.push({
      rank: proposals.length + 1,
      theme: `${heading}【完全ガイド】`,
      reason: "競合サイトの主要見出しに基づくテーマ。検索意図に合致する可能性が高い。",
      priority: "高",
      sourceKeywords: relatedKeywords,
    });
    usedThemes.add(heading);
  }

  // 戦略2: キーワード組み合わせテーマ（中優先度）
  const kwPairs = [
    ["始め方", "初心者"],
    ["比較", "おすすめ"],
    ["使い方", "活用法"],
    ["メリット", "デメリット"],
    ["無料", "ツール"],
    ["2026年", "最新"],
  ];

  for (const [suffix1, suffix2] of kwPairs) {
    if (proposals.length >= 8) break;
    const kw = topKeywords.find(
      (k) => !usedThemes.has(k) && k.length >= 2
    );
    if (!kw) continue;
    const theme = `${kw}の${suffix1}と${suffix2}ガイド`;
    if (usedThemes.has(theme)) continue;
    proposals.push({
      rank: proposals.length + 1,
      theme,
      reason: `頻出キーワード「${kw}」に関連するHow-to記事。検索ボリュームが見込める。`,
      priority: "中",
      sourceKeywords: [kw, suffix1, suffix2],
    });
    usedThemes.add(theme);
  }

  // 戦略3: ロングテールテーマ（低〜中優先度）
  const longTailPatterns = [
    "{{kw}}とは？初心者にもわかりやすく解説",
    "{{kw}}の選び方と注意点まとめ",
    "{{kw}}で副業を始める方法",
    "{{kw}}の料金プラン徹底比較",
  ];

  for (const pattern of longTailPatterns) {
    if (proposals.length >= 10) break;
    const kw = topKeywords.find(
      (k) => !usedThemes.has(k) && k.length >= 3
    );
    if (!kw) continue;
    const theme = pattern.replace("{{kw}}", kw);
    proposals.push({
      rank: proposals.length + 1,
      theme,
      reason: `ロングテールキーワード戦略。競合が少なく上位表示を狙いやすい。`,
      priority: proposals.length <= 8 ? "中" : "低",
      sourceKeywords: [kw],
    });
    usedThemes.add(kw);
  }

  // 10個に満たない場合、汎用テーマで補完
  while (proposals.length < 10) {
    const idx = proposals.length;
    const kw = topKeywords[idx] || `テーマ${idx + 1}`;
    proposals.push({
      rank: proposals.length + 1,
      theme: `${kw}に関する最新トレンドと実践テクニック`,
      reason: "頻出ワードに基づく汎用テーマ。",
      priority: "低",
      sourceKeywords: [kw],
    });
  }

  return proposals.slice(0, 10);
}

// --- レポート生成 ---

function generateReport(pages: PageData[], proposals: ThemeProposal[]): string {
  const today = new Date().toISOString().split("T")[0];

  let md = `---\ntype: keyword-research\ndate: "${today}"\ntargets: ${pages.length}\n---\n\n`;
  md += `# SEOキーワードリサーチレポート\n\n`;
  md += `📅 実施日: ${today}\n`;
  md += `🔍 分析対象: ${pages.length}サイト\n\n`;

  // 各サイトの分析結果
  md += `## 競合サイト分析結果\n\n`;

  for (const page of pages) {
    md += `### ${page.title || "（タイトルなし）"}\n\n`;
    md += `- **URL**: ${page.url}\n`;
    md += `- **meta description**: ${page.metaDescription || "（なし）"}\n`;
    md += `- **meta keywords**: ${page.metaKeywords || "（なし）"}\n\n`;

    // 見出し一覧
    if (page.headings.length > 0) {
      md += `**見出し構成:**\n\n`;
      for (const h of page.headings.slice(0, 20)) {
        const indent = h.level === "h1" ? "" : h.level === "h2" ? "  " : "    ";
        md += `${indent}- [${h.level}] ${h.text}\n`;
      }
      md += `\n`;
    }

    // 頻出ワード
    if (page.frequentWords.length > 0) {
      md += `**頻出ワード（上位20）:**\n\n`;
      md += `| 順位 | ワード | 出現回数 |\n`;
      md += `|------|--------|----------|\n`;
      page.frequentWords.forEach((w, i) => {
        md += `| ${i + 1} | ${w.word} | ${w.count} |\n`;
      });
      md += `\n`;
    }

    md += `---\n\n`;
  }

  // 記事テーマ提案
  md += `## 📝 記事テーマ提案（10本）\n\n`;
  md += `| 優先度 | # | テーマ | 理由 | 関連キーワード |\n`;
  md += `|--------|---|--------|------|----------------|\n`;

  for (const p of proposals) {
    const priorityIcon = p.priority === "高" ? "🔴" : p.priority === "中" ? "🟡" : "🟢";
    md += `| ${priorityIcon} ${p.priority} | ${p.rank} | ${p.theme} | ${p.reason} | ${p.sourceKeywords.join(", ")} |\n`;
  }

  md += `\n### 優先度の判断基準\n\n`;
  md += `- 🔴 **高**: 競合の主要コンテンツと直接競合。検索意図が明確で成果が見込めるテーマ\n`;
  md += `- 🟡 **中**: 頻出キーワードに基づくテーマ。一定の検索ボリュームが期待できる\n`;
  md += `- 🟢 **低**: ロングテール戦略。競合が少なく長期的にトラフィックを獲得できる\n`;

  return md;
}

// --- メイン処理 ---

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("❌ エラー: URLを1つ以上指定してください");
    console.error(
      '使い方: npx ts-node --project tools/tsconfig.json tools/seo/keyword-research.ts "URL1" "URL2" ...'
    );
    process.exit(1);
  }

  const urls = args;
  console.log("🚀 SEOキーワードリサーチを開始します");
  console.log(`📎 対象URL: ${urls.length}件\n`);

  // Playwrightブラウザを起動
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  const pages: PageData[] = [];

  // 各URLをスクレイピング
  for (const url of urls) {
    try {
      const data = await scrapePage(page, url);
      pages.push(data);
      console.log(`  ✅ 取得完了: 見出し${data.headings.length}件, 頻出ワード${data.frequentWords.length}件`);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`  ❌ スクレイピング失敗: ${url} - ${error.message}`);
    }
  }

  await browser.close();

  if (pages.length === 0) {
    console.error("❌ 有効なページデータが取得できませんでした");
    process.exit(1);
  }

  // テーマ提案を生成
  console.log("\n📊 キーワード分析・テーマ提案を生成中...");
  const proposals = generateThemeProposals(pages);

  // レポートを生成
  const report = generateReport(pages, proposals);

  // 保存
  const today = new Date().toISOString().split("T")[0];
  const outputDir = path.join(process.cwd(), "plans");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `keyword-research-${today}.md`);
  fs.writeFileSync(outputPath, report, "utf8");

  console.log(`\n✅ キーワードリサーチ完了！`);
  console.log(`📄 レポート: plans/keyword-research-${today}.md`);
  console.log(`📝 提案テーマ: ${proposals.length}件`);
  console.log(`\nテーマ一覧:`);
  proposals.forEach((p) => {
    const icon = p.priority === "高" ? "🔴" : p.priority === "中" ? "🟡" : "🟢";
    console.log(`  ${icon} [${p.priority}] ${p.theme}`);
  });
}

main().catch((err) => {
  console.error("❌ 予期しないエラー:", err);
  process.exit(1);
});
