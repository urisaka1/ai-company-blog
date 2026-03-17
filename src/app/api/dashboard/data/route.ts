import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 認証チェック
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("dashboard_session");
  return !!session?.value;
}

// ダッシュボード用データを一括取得
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const rootDir = process.cwd();

  // --- 記事データ ---
  const postsDir = path.join(rootDir, "content/posts");
  const affiliatesPath = path.join(rootDir, "config/affiliates.json");
  const affiliateConfig = fs.existsSync(affiliatesPath)
    ? JSON.parse(fs.readFileSync(affiliatesPath, "utf8"))
    : { tools: [] };
  const toolNames = affiliateConfig.tools.flatMap(
    (t: { name: string; aliases: string[] }) => [t.name, ...t.aliases]
  );

  const postFiles = fs.existsSync(postsDir)
    ? fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"))
    : [];

  const posts = postFiles.map((file) => {
    const content = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data, content: body } = matter(content);
    const charCount = body.replace(/\s/g, "").length;

    // アフィリエイトリンク対象のツール名の出現回数
    let affiliateCount = 0;
    for (const name of toolNames) {
      if (body.includes(name)) affiliateCount++;
    }

    // 下書き判定: フロントマターにdraft: trueがあるか、本文に「ここに本文を記述」が含まれるか
    const isDraft =
      data.draft === true || body.includes("ここに本文を記述");

    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || file,
      date: data.date || "",
      tags: data.tags || [],
      charCount,
      affiliateCount,
      status: isDraft ? "下書き" : "公開済み",
    };
  });

  posts.sort((a, b) => (a.date > b.date ? -1 : 1));

  const published = posts.filter((p) => p.status === "公開済み");
  const drafts = posts.filter((p) => p.status === "下書き");
  const totalChars = posts.reduce((sum, p) => sum + p.charCount, 0);
  const totalAffiliates = posts.reduce((sum, p) => sum + p.affiliateCount, 0);

  // --- カレンダーデータ ---
  const plansDir = path.join(rootDir, "plans");
  let calendar = null;
  if (fs.existsSync(plansDir)) {
    const calFiles = fs
      .readdirSync(plansDir)
      .filter((f) => f.startsWith("calendar-"))
      .sort()
      .reverse();
    if (calFiles[0]) {
      calendar = fs.readFileSync(path.join(plansDir, calFiles[0]), "utf8");
    }
  }

  // --- SNSデータ ---
  const snsDir = path.join(rootDir, "content/sns");
  const snsEntries: {
    slug: string;
    title: string;
    tweets: { pattern: number; text: string }[];
    instagram: { pattern: number; text: string }[];
  }[] = [];

  if (fs.existsSync(snsDir)) {
    const snsFiles = fs.readdirSync(snsDir).filter((f) => f.endsWith(".json"));
    for (const file of snsFiles) {
      try {
        const data = JSON.parse(
          fs.readFileSync(path.join(snsDir, file), "utf8")
        );
        snsEntries.push({
          slug: data.slug || file,
          title: data.title || "",
          tweets: data.twitter || [],
          instagram: data.instagram || [],
        });
      } catch {
        // 無効なJSONはスキップ
      }
    }
  }

  // --- キーワードリサーチデータ ---
  let keywordResearch = null;
  if (fs.existsSync(plansDir)) {
    const kwFiles = fs
      .readdirSync(plansDir)
      .filter((f) => f.startsWith("keyword-research-"))
      .sort()
      .reverse();
    if (kwFiles[0]) {
      keywordResearch = fs.readFileSync(
        path.join(plansDir, kwFiles[0]),
        "utf8"
      );
    }
  }

  return NextResponse.json({
    summary: {
      publishedCount: published.length,
      draftCount: drafts.length,
      totalChars,
      totalAffiliates,
    },
    posts,
    calendar,
    sns: snsEntries,
    keywordResearch,
  });
}
