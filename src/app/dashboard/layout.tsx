import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | AI Company Blog",
  description: "管理ダッシュボード",
  robots: { index: false, follow: false },
};

// ダッシュボード専用レイアウト（ブログ本体のヘッダー・フッターを非表示）
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="dashboard-layout">{children}</div>;
}
