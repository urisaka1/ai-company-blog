import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
};

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
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-lg font-bold text-fg mb-4">関連記事</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scored.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block rounded-lg border border-border bg-card-bg p-4 hover:border-accent/40 hover:shadow-sm transition-all"
          >
            <time className="text-xs text-fg-faint">{post.date}</time>
            <h3 className="mt-1 text-sm font-semibold leading-snug text-fg group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded bg-tag-bg text-tag-fg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
