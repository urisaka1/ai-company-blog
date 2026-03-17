/**
 * 週次コンテンツカレンダー自動生成ツール
 *
 * 使い方: npx ts-node --project tools/tsconfig.json tools/seo/content-calendar.ts [keyword-research-file]
 *
 * キーワードリサーチの結果を読み込み、
 * 1週間分のコンテンツ計画を自動生成する。
 * 結果を /plans/calendar-{週番号}.md に保存。
 */

import * as fs from "fs";
import * as path from "path";

// --- 型定義 ---

type ThemeEntry = {
  rank: number;
  theme: string;
  priority: string;
  keywords: string[];
};

type DayPlan = {
  dayOfWeek: string;
  date: string;
  article: {
    title: string;
    headings: string[];
    targetKeywords: string[];
  };
  sns: {
    morning: string;
    noon: string;
    evening: string;
  };
  note: {
    postTime: string;
    summary: string;
  };
};

// --- ユーティリティ ---

// 今日を起点にした次の月曜日を取得
function getNextMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 1 : 8 - day; // 日曜なら翌日、それ以外は次の月曜
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday;
}

// 日付をYYYY-MM-DD形式で返す
function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ISO週番号を取得
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// 曜日名
const DAY_NAMES = ["月", "火", "水", "木", "金"];

// --- キーワードリサーチ結果のパース ---

function parseKeywordResearch(filePath: string): ThemeEntry[] {
  const content = fs.readFileSync(filePath, "utf8");
  const themes: ThemeEntry[] = [];

  // テーマ提案テーブルを解析
  const lines = content.split("\n");
  let inTable = false;
  let headerPassed = false;

  for (const line of lines) {
    // テーブルヘッダー検出
    if (line.includes("テーマ") && line.includes("優先度") && line.includes("|")) {
      inTable = true;
      continue;
    }
    // セパレーター行をスキップ
    if (inTable && line.match(/^\|[\s-|]+\|$/)) {
      headerPassed = true;
      continue;
    }
    // テーブル行を解析
    if (inTable && headerPassed && line.startsWith("|")) {
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      if (cells.length >= 5) {
        const priority = cells[0].replace(/[🔴🟡🟢]/g, "").trim();
        const rank = parseInt(cells[1]) || themes.length + 1;
        const theme = cells[2];
        const keywords = cells[4].split(",").map((k) => k.trim());
        themes.push({ rank, theme, priority, keywords });
      }
    }
    // テーブル終了検出
    if (inTable && headerPassed && !line.startsWith("|") && line.trim().length > 0) {
      inTable = false;
    }
  }

  return themes;
}

// --- 見出し構成の自動生成 ---

function generateHeadings(theme: string, keywords: string[]): string[] {
  const kw = keywords[0] || theme.slice(0, 10);
  return [
    `${kw}とは？基本概念を解説`,
    `${kw}のメリット・活用シーン`,
    `${kw}の始め方【ステップガイド】`,
    `${kw}のおすすめツール・サービス`,
    `${kw}の注意点とよくある質問`,
    `まとめ：${kw}を始めよう`,
  ];
}

// --- SNS投稿案の生成 ---

function generateSnsPlan(
  title: string,
  dayOfWeek: string
): { morning: string; noon: string; evening: string } {
  const shortTitle = title.length > 20 ? title.slice(0, 20) + "…" : title;

  return {
    morning: `【朝8:00投稿】📝 新記事公開！「${shortTitle}」初心者にもわかりやすく解説しました✨ #AI #ブログ更新`,
    noon: `【昼12:00投稿】💡 ${shortTitle}について知ってる？具体的なツールと手順をまとめました👇 #AI活用 #効率化`,
    evening: `【夜20:00投稿】🌙 今日の${dayOfWeek}曜おすすめ記事！「${shortTitle}」週末にぜひチェック🚀 #副業 #スキルアップ`,
  };
}

// --- カレンダー生成 ---

function generateCalendar(
  themes: ThemeEntry[],
  startDate: Date
): DayPlan[] {
  const plans: DayPlan[] = [];

  // 優先度でソート（高→中→低）
  const sorted = [...themes].sort((a, b) => {
    const order: Record<string, number> = { 高: 0, 中: 1, 低: 2 };
    return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
  });

  for (let i = 0; i < 5; i++) {
    const theme = sorted[i] || sorted[i % sorted.length];
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = formatDate(date);
    const dayOfWeek = DAY_NAMES[i];

    const title = theme.theme.length > 32
      ? theme.theme.slice(0, 32)
      : theme.theme;
    const headings = generateHeadings(title, theme.keywords);
    const sns = generateSnsPlan(title, dayOfWeek);

    plans.push({
      dayOfWeek,
      date: dateStr,
      article: {
        title,
        headings,
        targetKeywords: theme.keywords,
      },
      sns,
      note: {
        postTime: "記事公開の翌日 10:00",
        summary: `「${title}」のポイントを500字で要約。フック文＋要点3つ＋ブログURLの構成。`,
      },
    });
  }

  return plans;
}

// --- マークダウンレポート ---

function generateCalendarMarkdown(
  plans: DayPlan[],
  weekNumber: number,
  year: number
): string {
  let md = `---\ntype: content-calendar\nyear: ${year}\nweek: ${weekNumber}\ngenerated: "${formatDate(new Date())}"\n---\n\n`;
  md += `# 📅 週次コンテンツカレンダー（${year}年 第${weekNumber}週）\n\n`;
  md += `期間: ${plans[0].date}（${plans[0].dayOfWeek}）〜 ${plans[4].date}（${plans[4].dayOfWeek}）\n\n`;

  // 週間サマリーテーブル
  md += `## 📊 週間サマリー\n\n`;
  md += `| 曜日 | 日付 | 記事テーマ | 優先キーワード |\n`;
  md += `|------|------|------------|----------------|\n`;
  for (const plan of plans) {
    md += `| ${plan.dayOfWeek} | ${plan.date} | ${plan.article.title} | ${plan.article.targetKeywords.join(", ")} |\n`;
  }
  md += `\n`;

  // 各日の詳細
  for (const plan of plans) {
    md += `---\n\n`;
    md += `## ${plan.dayOfWeek}曜日（${plan.date}）\n\n`;

    // 記事
    md += `### 📝 記事\n\n`;
    md += `**タイトル**: ${plan.article.title}\n\n`;
    md += `**ターゲットKW**: ${plan.article.targetKeywords.join(", ")}\n\n`;
    md += `**見出し構成**:\n\n`;
    plan.article.headings.forEach((h, i) => {
      md += `${i + 1}. ${h}\n`;
    });
    md += `\n`;

    // SNS
    md += `### 📱 SNS投稿スケジュール\n\n`;
    md += `| 時間帯 | 投稿内容 |\n`;
    md += `|--------|----------|\n`;
    md += `| 朝（8:00） | ${plan.sns.morning} |\n`;
    md += `| 昼（12:00） | ${plan.sns.noon} |\n`;
    md += `| 夜（20:00） | ${plan.sns.evening} |\n`;
    md += `\n`;

    // note
    md += `### 📓 note投稿\n\n`;
    md += `- **投稿タイミング**: ${plan.note.postTime}\n`;
    md += `- **内容**: ${plan.note.summary}\n\n`;
  }

  // 運用メモ
  md += `---\n\n`;
  md += `## 💡 運用メモ\n\n`;
  md += `- 記事は前日までに下書きを完成させ、当日朝に公開する\n`;
  md += `- SNS投稿は記事公開後に \`generate-sns.ts\` で自動生成する\n`;
  md += `- note要約は記事公開翌日に \`generate-note-summary.ts\` で生成する\n`;
  md += `- 各記事にアフィリエイトリンクを挿入してから公開する\n`;

  return md;
}

// --- メイン処理 ---

function main(): void {
  const args = process.argv.slice(2);
  const plansDir = path.join(process.cwd(), "plans");

  // キーワードリサーチファイルを特定
  let researchFile: string;
  if (args[0]) {
    researchFile = args[0].startsWith("/")
      ? args[0]
      : path.join(process.cwd(), args[0]);
  } else {
    // 最新のキーワードリサーチファイルを自動検出
    if (!fs.existsSync(plansDir)) {
      console.error("❌ エラー: /plans/ ディレクトリが見つかりません");
      console.error("先にキーワードリサーチを実行してください。");
      process.exit(1);
    }
    const files = fs
      .readdirSync(plansDir)
      .filter((f) => f.startsWith("keyword-research-") && f.endsWith(".md"))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error("❌ エラー: キーワードリサーチの結果が見つかりません");
      process.exit(1);
    }
    researchFile = path.join(plansDir, files[0]);
  }

  console.log("📅 週次コンテンツカレンダーを生成します");
  console.log(`📄 参照ファイル: ${path.relative(process.cwd(), researchFile)}`);

  // キーワードリサーチ結果を読み込み
  const themes = parseKeywordResearch(researchFile);
  if (themes.length === 0) {
    console.error("❌ エラー: テーマ提案を解析できませんでした");
    process.exit(1);
  }
  console.log(`🔍 テーマ取得: ${themes.length}件`);

  // カレンダー生成
  const monday = getNextMonday();
  const weekNumber = getWeekNumber(monday);
  const year = monday.getFullYear();
  const plans = generateCalendar(themes, monday);

  // マークダウン生成
  const markdown = generateCalendarMarkdown(plans, weekNumber, year);

  // 保存
  if (!fs.existsSync(plansDir)) {
    fs.mkdirSync(plansDir, { recursive: true });
  }
  const outputPath = path.join(plansDir, `calendar-W${weekNumber}.md`);
  fs.writeFileSync(outputPath, markdown, "utf8");

  console.log(`\n✅ コンテンツカレンダーを生成しました！`);
  console.log(`📄 ファイル: plans/calendar-W${weekNumber}.md`);
  console.log(`📅 期間: ${plans[0].date}（月）〜 ${plans[4].date}（金）`);
  console.log(`\n📋 週間スケジュール:`);
  plans.forEach((p) => {
    console.log(`  ${p.dayOfWeek}（${p.date}）: ${p.article.title}`);
  });
}

main();
