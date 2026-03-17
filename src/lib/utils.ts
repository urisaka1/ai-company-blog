// ユーティリティ関数

/**
 * 読了時間を推定する（日本語: 約500文字/分）
 * HTMLタグを除去してから計算
 */
export function estimateReadingTime(contentHtml: string): number {
  const text = contentHtml.replace(/<[^>]*>/g, "");
  const charCount = text.replace(/\s/g, "").length;
  const minutes = Math.ceil(charCount / 500);
  return Math.max(1, minutes);
}

/**
 * タグに基づくグラデーションカラーを返す
 * サムネイル画像がない場合のフォールバック用
 */
export function getTagGradient(tag: string): string {
  const gradients: Record<string, string> = {
    AI: "from-teal-500 to-cyan-400",
    "AI活用": "from-teal-500 to-cyan-400",
    "Claude Code": "from-violet-500 to-purple-400",
    Mac: "from-gray-600 to-slate-400",
    "副業": "from-amber-500 to-orange-400",
    "ノーコード": "from-rose-500 to-pink-400",
    "自動化": "from-blue-500 to-indigo-400",
    "ツール比較": "from-emerald-500 to-green-400",
    "プログラミング": "from-violet-500 to-blue-400",
    "効率化": "from-sky-500 to-blue-400",
  };
  return gradients[tag] || "from-teal-500 to-emerald-400";
}
