"use client";

import { useState, useEffect, useCallback } from "react";

// --- 型定義 ---
type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  charCount: number;
  affiliateCount: number;
  status: string;
};

type SnsEntry = {
  slug: string;
  title: string;
  tweets: { pattern: number; text: string }[];
  instagram: { pattern: number; text: string }[];
};

type DashboardData = {
  summary: {
    publishedCount: number;
    draftCount: number;
    totalChars: number;
    totalAffiliates: number;
  };
  posts: Post[];
  calendar: string | null;
  sns: SnsEntry[];
  keywordResearch: string | null;
};

type SortKey = "date" | "charCount" | "title";
type SortDir = "asc" | "desc";

// --- ログイン画面 ---
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onLogin();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || `認証エラー (${res.status})`);
      }
    } catch (err) {
      setError("通信エラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <h1 className="text-xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">管理画面にログイン</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "認証中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}

// --- コピーボタン ---
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shrink-0"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// --- 概要カード ---
function SummaryCards({ summary }: { summary: DashboardData["summary"] }) {
  const cards = [
    { label: "公開済み記事", value: summary.publishedCount, unit: "本", color: "bg-blue-50 text-blue-700" },
    { label: "下書き記事", value: summary.draftCount, unit: "本", color: "bg-amber-50 text-amber-700" },
    { label: "総文字数", value: summary.totalChars.toLocaleString(), unit: "字", color: "bg-green-50 text-green-700" },
    { label: "アフィリエイトリンク", value: summary.totalAffiliates, unit: "件", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-xl p-4 ${c.color}`}>
          <p className="text-xs font-medium opacity-70">{c.label}</p>
          <p className="text-2xl font-bold mt-1">
            {c.value}
            <span className="text-sm font-normal ml-0.5">{c.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

// --- 記事一覧テーブル ---
function PostsTable({ posts }: { posts: Post[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...posts].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "date") cmp = a.date.localeCompare(b.date);
    else if (sortKey === "charCount") cmp = a.charCount - b.charCount;
    else cmp = a.title.localeCompare(b.title);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
    <span className={`ml-1 ${active ? "text-gray-900" : "text-gray-300"}`}>
      {dir === "asc" ? "↑" : "↓"}
    </span>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th
              className="text-left py-3 px-3 font-medium text-gray-500 cursor-pointer hover:text-gray-900"
              onClick={() => toggleSort("title")}
            >
              タイトル
              <SortIcon active={sortKey === "title"} dir={sortDir} />
            </th>
            <th
              className="text-left py-3 px-3 font-medium text-gray-500 cursor-pointer hover:text-gray-900 whitespace-nowrap"
              onClick={() => toggleSort("date")}
            >
              公開日
              <SortIcon active={sortKey === "date"} dir={sortDir} />
            </th>
            <th
              className="text-right py-3 px-3 font-medium text-gray-500 cursor-pointer hover:text-gray-900 whitespace-nowrap"
              onClick={() => toggleSort("charCount")}
            >
              文字数
              <SortIcon active={sortKey === "charCount"} dir={sortDir} />
            </th>
            <th className="text-left py-3 px-3 font-medium text-gray-500">タグ</th>
            <th className="text-right py-3 px-3 font-medium text-gray-500 whitespace-nowrap">AFL</th>
            <th className="text-center py-3 px-3 font-medium text-gray-500">状態</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((post) => (
            <tr key={post.slug} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-3">
                <a
                  href={`/posts/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium line-clamp-1"
                >
                  {post.title}
                </a>
              </td>
              <td className="py-3 px-3 text-gray-500 whitespace-nowrap">{post.date}</td>
              <td className="py-3 px-3 text-right text-gray-700 tabular-nums">
                {post.charCount.toLocaleString()}
              </td>
              <td className="py-3 px-3">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3 px-3 text-right text-gray-700">{post.affiliateCount}</td>
              <td className="py-3 px-3 text-center">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.status === "公開済み"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {post.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- カレンダーセクション ---
function CalendarSection({ markdown }: { markdown: string | null }) {
  if (!markdown) {
    return <p className="text-sm text-gray-400">カレンダーデータがありません</p>;
  }

  // 簡易パース：週間サマリーテーブルを抽出
  const lines = markdown.split("\n");
  const scheduleItems: { day: string; date: string; theme: string }[] = [];
  let inTable = false;
  let sepPassed = false;

  for (const line of lines) {
    if (line.includes("曜日") && line.includes("記事テーマ") && line.includes("|")) {
      inTable = true;
      continue;
    }
    if (inTable && line.match(/^\|[\s-|]+\|$/)) {
      sepPassed = true;
      continue;
    }
    if (inTable && sepPassed && line.startsWith("|")) {
      const cells = line.split("|").map((c) => c.trim()).filter((c) => c);
      if (cells.length >= 3) {
        scheduleItems.push({ day: cells[0], date: cells[1], theme: cells[2] });
      }
    }
    if (inTable && sepPassed && !line.startsWith("|") && line.trim()) {
      break;
    }
  }

  // 期間を抽出
  const periodMatch = markdown.match(/期間:\s*(.+)/);

  return (
    <div>
      {periodMatch && (
        <p className="text-sm text-gray-500 mb-3">{periodMatch[1]}</p>
      )}
      <div className="space-y-2">
        {scheduleItems.map((item) => (
          <div
            key={item.date}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
              {item.day}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{item.theme}</p>
              <p className="text-xs text-gray-400">{item.date}</p>
            </div>
          </div>
        ))}
        {scheduleItems.length === 0 && (
          <p className="text-sm text-gray-400">スケジュールデータを解析できませんでした</p>
        )}
      </div>
    </div>
  );
}

// --- SNS投稿管理 ---
function SnsSection({ entries }: { entries: SnsEntry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (entries.length === 0) {
    return <p className="text-sm text-gray-400">SNS投稿データがありません</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.slug} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === entry.slug ? null : entry.slug)}
            className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900 truncate">
              {entry.title || entry.slug}
            </span>
            <span className="text-xs text-gray-400 shrink-0 ml-2">
              X: {entry.tweets.length} / IG: {entry.instagram.length}
            </span>
          </button>

          {expanded === entry.slug && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-4">
              {/* ツイート */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">X (Twitter)</p>
                <div className="space-y-2">
                  {entry.tweets.map((tweet) => (
                    <div
                      key={tweet.pattern}
                      className="flex gap-2 items-start bg-gray-50 rounded-lg p-3"
                    >
                      <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap break-all">
                        {tweet.text}
                      </p>
                      <CopyButton text={tweet.text} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Instagram */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Instagram</p>
                <div className="space-y-2">
                  {entry.instagram.map((ig) => (
                    <div
                      key={ig.pattern}
                      className="flex gap-2 items-start bg-gray-50 rounded-lg p-3"
                    >
                      <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                        {ig.text}
                      </p>
                      <CopyButton text={ig.text} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- キーワードリサーチ結果 ---
function KeywordSection({ markdown }: { markdown: string | null }) {
  if (!markdown) {
    return <p className="text-sm text-gray-400">キーワードリサーチデータがありません</p>;
  }

  // テーマ提案テーブルをパース
  const themes: { priority: string; rank: string; theme: string; reason: string }[] = [];
  const lines = markdown.split("\n");
  let inThemeTable = false;
  let sepPassed = false;

  for (const line of lines) {
    if (line.includes("テーマ") && line.includes("優先度") && line.includes("理由")) {
      inThemeTable = true;
      continue;
    }
    if (inThemeTable && line.match(/^\|[\s-|]+\|$/)) {
      sepPassed = true;
      continue;
    }
    if (inThemeTable && sepPassed && line.startsWith("|")) {
      const cells = line.split("|").map((c) => c.trim()).filter((c) => c);
      if (cells.length >= 4) {
        themes.push({
          priority: cells[0].replace(/[🔴🟡🟢]/g, "").trim(),
          rank: cells[1],
          theme: cells[2],
          reason: cells[3],
        });
      }
    }
    if (inThemeTable && sepPassed && !line.startsWith("|") && line.trim()) {
      break;
    }
  }

  // 実施日を抽出
  const dateMatch = markdown.match(/実施日:\s*(.+)/);

  return (
    <div>
      {dateMatch && (
        <p className="text-sm text-gray-500 mb-3">実施日: {dateMatch[1]}</p>
      )}
      <div className="space-y-2">
        {themes.map((t, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span
              className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                t.priority === "高"
                  ? "bg-red-100 text-red-700"
                  : t.priority === "中"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {t.priority}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{t.theme}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.reason}</p>
            </div>
          </div>
        ))}
        {themes.length === 0 && (
          <p className="text-sm text-gray-400">テーマデータを解析できませんでした</p>
        )}
      </div>
    </div>
  );
}

// --- タブ ---
type TabId = "posts" | "calendar" | "sns" | "keywords";

const TABS: { id: TabId; label: string }[] = [
  { id: "posts", label: "記事一覧" },
  { id: "calendar", label: "カレンダー" },
  { id: "sns", label: "SNS投稿" },
  { id: "keywords", label: "KWリサーチ" },
];

// --- ダッシュボード本体 ---
function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("posts");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/data");
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/dashboard/auth", { method: "DELETE" });
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">データを取得できませんでした</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
            <span className="text-xs text-gray-400">AI Company Blog</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* 概要カード */}
        <SummaryCards summary={data.summary} />

        {/* タブ */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === "posts" && <PostsTable posts={data.posts} />}
            {activeTab === "calendar" && <CalendarSection markdown={data.calendar} />}
            {activeTab === "sns" && <SnsSection entries={data.sns} />}
            {activeTab === "keywords" && <KeywordSection markdown={data.keywordResearch} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- メインページ ---
export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/auth")
      .then((res) => {
        if (res.ok) setAuthenticated(true);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">確認中...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return <Dashboard />;
}
