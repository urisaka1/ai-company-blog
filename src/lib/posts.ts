import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { injectAffiliateLinks } from "./affiliates";
import { injectAmazonProducts } from "./amazon";

// 記事データの型定義
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  thumbnail: string;
  category: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

// 記事ディレクトリのパス
const postsDirectory = path.join(process.cwd(), "content/posts");

// 全記事のメタデータを取得（日付降順）
export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        thumbnail: data.thumbnail ?? "",
        category: data.category ?? "other",
      };
    });

  // 日付降順でソート
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

// 全スラッグを取得（静的パス生成用）
export function getAllSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

// スラッグから記事データを取得
export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // アフィリエイトリンク + Amazon商品カードを自動挿入してからHTMLに変換
  const contentWithLinks = injectAffiliateLinks(content, slug);
  const contentWithAmazon = injectAmazonProducts(contentWithLinks);
  const processed = await remark().use(html, { sanitize: false }).process(contentWithAmazon);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    thumbnail: data.thumbnail ?? "",
    category: data.category ?? "other",
    contentHtml,
  };
}
