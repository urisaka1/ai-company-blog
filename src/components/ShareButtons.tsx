"use client";

// シェアボタン — Threads, X, はてなブックマーク
export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const baseUrl = "https://ai-company-blog.vercel.app";
  const url = `${baseUrl}/posts/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-fg-faint font-medium">シェア</span>

      {/* X (Twitter) */}
      <a
        href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fg-faint hover:text-fg transition-colors"
        aria-label="Xでシェア"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* Threads */}
      <a
        href={`https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fg-faint hover:text-fg transition-colors"
        aria-label="Threadsでシェア"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.343-.783-.979-1.404-1.752-1.76a8.7 8.7 0 0 1-.397 2.455c-.2.573-.508 1.084-.91 1.508-.87.919-2.077 1.416-3.583 1.416-1.107 0-2.04-.322-2.776-.957-.79-.681-1.19-1.578-1.19-2.668 0-1.262.526-2.312 1.522-3.037.842-.613 1.94-.95 3.262-1.003.738-.03 1.538.015 2.38.134-.177-.972-.635-1.698-1.362-2.152-.612-.382-1.39-.576-2.313-.576-.044 0-.089 0-.133.002-1.478.038-2.587.528-3.128 1.38l-1.72-1.088c.88-1.388 2.493-2.148 4.543-2.14h.177c1.735.038 3.135.61 4.042 1.652.793.913 1.233 2.14 1.307 3.645.595.204 1.14.478 1.627.83 1.132.82 1.967 2.088 2.352 3.575.45 1.736.192 3.843-1.247 5.254-1.768 1.733-4.043 2.489-7.368 2.513z"/>
        </svg>
      </a>

      {/* はてなブックマーク */}
      <a
        href={`https://b.hatena.ne.jp/entry/s/${url.replace("https://", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fg-faint hover:text-fg transition-colors"
        aria-label="はてなブックマーク"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <text x="2" y="18" fontSize="16" fontWeight="bold" fontFamily="sans-serif">B!</text>
        </svg>
      </a>
    </div>
  );
}
