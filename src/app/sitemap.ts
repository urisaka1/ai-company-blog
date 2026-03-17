import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

// サイトのベースURL（デプロイ後に変更）
const BASE_URL = "https://ai-company-blog.vercel.app";

// サイトマップを自動生成
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // 記事ページのサイトマップエントリ
  const postEntries = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...postEntries,
  ];
}
