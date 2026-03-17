import Link from "next/link";
import Image from "next/image";

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
};

// タグに基づくグラデーションカラー
function getGradient(tag: string): string {
  const map: Record<string, string> = {
    AI: "from-indigo-500 to-violet-400",
    Mac: "from-gray-600 to-slate-400",
    "副業": "from-amber-500 to-orange-400",
    "ノーコード": "from-rose-500 to-pink-400",
    Claude: "from-violet-500 to-purple-400",
  };
  return map[tag] || "from-indigo-500 to-pink-400";
}

// 関連記事（タグの一致度でスコアリング）
export function RelatedPosts({
  currentSlug,
  currentTags,
  allPosts,
}: {
  currentSlug: string;
  currentTags: string[];
  allPosts: Post[];
}) {
  // タグの一致度でスコアリングし、上位3件を取得
  const scored = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      ...p,
      score: p.tags.filter((t) => currentTags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) return null;

  return (
    <section className="mt-16 pt-10">
      <div className="gradient-line mb-10" />
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">🔗</span>
        <h2 className="text-lg font-bold text-fg">関連記事</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {scored.map((post, i) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block rounded-xl border border-border bg-card-bg overflow-hidden card-tilt animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* サムネイル */}
            <div className="relative w-full aspect-[2/1] overflow-hidden">
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
                  <span className="text-white/30 text-3xl font-bold select-none">
                    {post.tags[0]?.[0] || "A"}
                  </span>
                </div>
              )}
            </div>
            {/* コンテンツ */}
            <div className="p-4">
              <time className="text-xs text-fg-faint">{post.date}</time>
              <h3 className="mt-1.5 text-sm font-bold leading-snug text-fg group-hover:text-accent transition-colors duration-300 line-clamp-2">
                {post.title}
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-tag-bg text-tag-fg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
