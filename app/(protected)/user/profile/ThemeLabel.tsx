"use client";

/* SSR：<p>現在のテーマ: </p>

CSR 初回：<p>現在のテーマ: light</p>

👉 resolvedTheme ?? "" にしてもダメ
理由は：

resolvedTheme は Hydration 完了前に既に "light" になっている

つまり
「Hydration 中に値が変わる」のではなく
「Hydration 開始時点でサーバーと違う」

このケースでは
suppressHydrationWarning でも防げません。
 */

import { useTheme } from "next-themes";

export default function ThemeLabel() {
  const { resolvedTheme } = useTheme();

  if (!resolvedTheme) return null;

  return <p>現在のテーマ: {resolvedTheme}</p>;
}
