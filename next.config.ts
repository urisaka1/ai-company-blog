import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ワークスペースルートを明示的に指定（親ディレクトリのpackage-lock.json誤認を防ぐ）
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
