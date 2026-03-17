import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ワークスペースルートを明示的に指定（親ディレクトリのpackage-lock.json誤認を防ぐ）
  turbopack: {
    root: __dirname,
  },
  // Unsplash画像の最適化を有効化
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
