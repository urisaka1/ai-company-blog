/**
 * コンテンツ生成パイプライン（一括実行）
 *
 * 使い方: npx ts-node --project tools/tsconfig.json tools/pipeline.ts "キーワード"
 *
 * 以下の3ツールを順番に実行する：
 * 1. generate-post.ts → 記事スケルトン生成
 * 2. generate-note-summary.ts → note用要約生成
 * 3. generate-sns.ts → SNS投稿文生成
 */

import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

// ツールのベースコマンド
const TS_NODE_CMD = "npx ts-node --project tools/tsconfig.json";

// 日付のスラッグ生成（generate-post.tsと同じロジック）
function toSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getToday(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// コマンドを実行してログを表示
function runStep(
  stepNum: number,
  label: string,
  command: string
): { success: boolean; output: string } {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📌 ステップ ${stepNum}: ${label}`);
  console.log(`${"=".repeat(50)}`);
  try {
    const output = execSync(command, {
      encoding: "utf8",
      cwd: process.cwd(),
    });
    console.log(output);
    return { success: true, output };
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    console.error(`❌ エラーが発生しました: ${err.stderr || err.message}`);
    return { success: false, output: err.stderr || err.message || "" };
  }
}

// --- メイン処理 ---

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("❌ エラー: キーワードを指定してください");
    console.error(
      '使い方: npx ts-node --project tools/tsconfig.json tools/pipeline.ts "キーワード"'
    );
    process.exit(1);
  }

  const keyword = args[0];
  const slug = toSlug(keyword);
  const today = getToday();
  const fileSlug = `${today}-${slug}`;

  console.log("🚀 コンテンツ生成パイプラインを開始します");
  console.log(`📝 キーワード: ${keyword}`);
  console.log(`📅 日付: ${today}`);
  console.log(`🔗 スラッグ: ${fileSlug}`);

  const startTime = Date.now();
  const results: { step: string; success: boolean }[] = [];

  // ステップ1: 記事スケルトン生成
  const step1 = runStep(
    1,
    "記事スケルトン生成",
    `${TS_NODE_CMD} tools/generate-post.ts "${keyword}"`
  );
  results.push({ step: "記事スケルトン生成", success: step1.success });

  if (!step1.success) {
    console.error("\n❌ 記事生成に失敗したため、パイプラインを中断します");
    process.exit(1);
  }

  // ステップ2: note用要約生成
  const step2 = runStep(
    2,
    "note用要約生成",
    `${TS_NODE_CMD} tools/generate-note-summary.ts "${fileSlug}"`
  );
  results.push({ step: "note用要約生成", success: step2.success });

  // ステップ3: SNS投稿文生成
  const step3 = runStep(
    3,
    "SNS投稿文生成",
    `${TS_NODE_CMD} tools/generate-sns.ts "${fileSlug}"`
  );
  results.push({ step: "SNS投稿文生成", success: step3.success });

  // サマリーを表示
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${"=".repeat(50)}`);
  console.log("📊 パイプライン実行サマリー");
  console.log(`${"=".repeat(50)}`);
  console.log(`⏱️  実行時間: ${elapsed}秒`);
  console.log(`📝 キーワード: ${keyword}\n`);

  results.forEach((r) => {
    const icon = r.success ? "✅" : "❌";
    console.log(`${icon} ${r.step}`);
  });

  // 生成されたファイル一覧
  console.log("\n📁 生成されたファイル:");
  const generatedFiles = [
    `content/posts/${fileSlug}.md`,
    `content/note-summaries/${fileSlug}.md`,
    `content/sns/${fileSlug}.json`,
  ];

  generatedFiles.forEach((f) => {
    const fullPath = path.join(process.cwd(), f);
    const exists = fs.existsSync(fullPath);
    const icon = exists ? "📄" : "⚠️ ";
    const size = exists
      ? `(${(fs.statSync(fullPath).size / 1024).toFixed(1)}KB)`
      : "(未生成)";
    console.log(`  ${icon} ${f} ${size}`);
  });

  const allSuccess = results.every((r) => r.success);
  console.log(
    `\n${allSuccess ? "🎉 全ステップが正常に完了しました！" : "⚠️  一部ステップでエラーが発生しました"}`
  );
}

main();
