import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

// セッショントークン生成
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ログイン処理
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correctPassword = process.env.DASHBOARD_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "DASHBOARD_PASSWORD が設定されていません" },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    return NextResponse.json({ error: "パスワードが違います" }, { status: 401 });
  }

  // セッショントークンをCookieに設定
  const token = generateToken();
  const cookieStore = await cookies();
  cookieStore.set("dashboard_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24時間
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

// セッション確認
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("dashboard_session");

  if (!session?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

// ログアウト
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("dashboard_session");
  return NextResponse.json({ ok: true });
}
