import Link from "next/link";
import Image from "next/image";
import { RelatedTitle } from "./PostDetail";

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
};

function getGradient(tag: string): string {
  const map: Record<string, string> = {
    AI: "from-indigo-600 to-violet-400",
    Mac: "from-slate-600 to-zinc-400",
    "副業": "from-amber-500 to-orange-400",
    "ノーコード": "from-rose-500 to-pink-400",
    Claude: "from-violet-600 to-purple-400",
  };
  return map[tag] || "from-indigo-500 to-violet-400";
}

// 関連記事
export function RelatedPosts({
  currentSlug,
  currentTags,
  allPosts,
}: {
  currentSlug: string;
  currentTags: string[];
  allPosts: Post[];
}) {
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
    <section className="mt-20 pt-12 border-t border-border">
      <RelatedTitle />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {scored.map((post, i) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block card-premium animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getGradient(post.tags[0])} flex items-center justify-center`}>
                  <span className="text-white/10 text-4xl font-bold select-none">
                    {post.tags[0]?.[0] || "T"}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-[10px] text-fg-faint mb-2">
                <span className="uppercase tracking-wider font-semibold text-accent">{post.tags[0]}</span>
                <span>·</span>
                <time>{post.date}</time>
              </div>
              <h3 className="text-sm font-bold leading-snug text-fg group-hover:text-accent transition-colors duration-300 line-clamp-2 tracking-tight">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
