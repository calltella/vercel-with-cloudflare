// /app/components/customcomponents/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  console.log(theme);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"; // system
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={theme === "dark"}
      className="
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors
        dark:bg-blue-700 bg-gray-300
      "
    >
      <span
        className="
          inline-block h-5 w-5 transform rounded-full bg-white shadow
          transition-transform
          dark:translate-x-5 translate-x-1
        "
      />
    </button>
  );
}
