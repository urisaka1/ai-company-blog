"use client";

// SNSシェアボタン（X, はてなブックマーク）
export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const baseUrl = "https://ai-company-blog.vercel.app";
  const url = `${baseUrl}/posts/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-fg-muted">Share:</span>

      {/* X（Twitter）シェア */}
      <a
        href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-tag-bg hover:bg-fg hover:text-bg transition-all text-fg-muted"
        aria-label="Xでシェア"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* はてなブックマーク */}
      <a
        href={`https://b.hatena.ne.jp/entry/s/${url.replace("https://", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-tag-bg hover:bg-[#00a4de] hover:text-white transition-all text-fg-muted"
        aria-label="はてなブックマークに追加"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.47 21.77c-.41.41-1.06.41-1.47 0l-1.77-1.76c-.41-.41-.41-1.06 0-1.47.41-.41 1.06-.41 1.47 0l1.77 1.76c.41.41.41 1.06 0 1.47zM14 11c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3z"/>
          <text x="4" y="18" fontSize="14" fontWeight="bold" fontFamily="sans-serif">B!</text>
        </svg>
      </a>
    </div>
  );
}
