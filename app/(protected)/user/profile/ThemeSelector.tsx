// app/(protected)/dashboard/ThemeSelector.tsx
"use client";

import { COLOR_THEMES, ColorThemeKey } from "@/app/theme/colorTheme";
import { updateColorTheme } from "./updateColorTheme";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function ThemeSelector({
  current,
}: {
  current: ColorThemeKey;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const applyThemeImmediately = (key: ColorThemeKey) => {
    if (!resolvedTheme) return;

    const palette = COLOR_THEMES[key];
    const vars =
      resolvedTheme === "dark" ? palette.dark : palette.light;

    console.log('vars:',vars)
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(
        `--color-${k}`,
        v
      );
    });
  };

  const onSelect = (key: ColorThemeKey) => {
    // カラーテーマの即時適用
    applyThemeImmediately(key);

    // カラーテーマの保存
    startTransition(async () => {
      await updateColorTheme(key);
      router.refresh(); // session 更新
    });
  };

  return (
    <div className="grid grid-cols-5 gap-1">
      {(Object.keys(COLOR_THEMES) as ColorThemeKey[]).map((key) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          disabled={isPending}
          className={`
            rounded p-5 border
            ${current === key ? "ring-2 ring-blue-500" : ""}
          `}
          style={{
            background: COLOR_THEMES[key].light.primary,
            color: COLOR_THEMES[key].light.text,
          }}
        >
        </button>
      ))}
    </div>
  );
}
