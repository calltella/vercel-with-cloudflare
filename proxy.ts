// /app/proxy.ts

/**
 * proxy では DB に触らない
 * @/lib/auth はDBチェックが走るのでNG
 *
 * proxy では「セッションクッキーの有無」だけ確認
 * 実際の認可（role / 権限）は Server Component or API 側で行う
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    //console.log("proxy hit:", req.nextUrl.pathname);
  }

  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (process.env.NODE_ENV === "development") {
    //console.log("sessionToken:", sessionToken);
  }

  // 🔒 未ログイン時のリダイレクト（必要になったらON）
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // リダイレクトテスト
  // if (req.nextUrl.pathname === "/redirect") {
  //   return NextResponse.redirect(new URL("/user/dashboard", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // ★ auth系APIは絶対に除外
    "/((?!api/auth|login|notes|_next/static|_next/image|favicon.ico).*)",
  ],
};
