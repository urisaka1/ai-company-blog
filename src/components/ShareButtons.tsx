"use client";

// シェアボタン — ミニマルスタイル
export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const baseUrl = "https://ai-company-blog.vercel.app";
  const url = `${baseUrl}/posts/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-fg-faint uppercase tracking-wider">Share</span>

      <a
        href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fg-faint hover:text-fg transition-colors"
        aria-label="Share on X"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      <a
        href={`https://b.hatena.ne.jp/entry/s/${url.replace("https://", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fg-faint hover:text-fg transition-colors"
        aria-label="Hatena Bookmark"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <text x="2" y="18" fontSize="16" fontWeight="bold" fontFamily="sans-serif">B!</text>
        </svg>
      </a>
    </div>
  );
}
