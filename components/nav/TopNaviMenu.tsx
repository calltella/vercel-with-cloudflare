// app/components/nav/TopNaviMenu.tsx
"use client";
// Client Component で「サーバー専用コード（auth / Prisma / pg）」は実行できない
import Link from "next/link";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/app/types/user";

export default function TopNaviMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const role = useMemo<UserRole | null>(
    () => session?.user?.role ?? null,
    [session]
  );
  //console.log("TopNaviMenu (avatar_path) : ", session?.user?.avatar_path);
  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 w-full px-4 py-2 bg-(--color-primary) shadow-md">
        <div className="flex items-center">
          {/* ロゴ */}
          <div className="shrink-0 bg-white">
            <Image
              src="/bmc_logo2024.png"
              height={42}
              width={90}
              alt="logo"
              loading="eager"
              unoptimized // Edge側で最適化できない
            />
          </div>

          {/* 左メニュー */}
          <div
            className={`ml-6 flex-1 md:flex md:items-center ${open ? "" : "hidden md:flex"
              }`}
          >
            <ul className="flex flex-col md:flex-row text-base">
              <li>
                <Link
                  href="/apline"
                  className="md:px-4 py-2 block text-(--color-text) hover:text-(--color-secondary)"
                >
                  Apline
                </Link>
              </li>
              <li>
                <Link
                  href="/apline"
                  className="md:px-4 py-2 block text-(--color-text) hover:text-(--color-secondary)"
                >
                  Apline
                </Link>
              </li>
              {/* roleで出し分けも可能 */}
              {role === "admin" && (
                <li>
                  <Link
                    href="/admin"
                    className="md:px-4 py-2 block  text-(--color-text) hover:text-(--color-secondary)"
                  >
                    管理者
                  </Link>
                </li>
              )}
            </ul>

            {/* 右端：プロフィール */}
            <div className="ml-auto">
              <ProfileMenu
                userName={session?.user.name || ""}
                avatarsImage={
                  session?.user.avatarUrl || "/avatars/default.png"
                }
              />
            </div>
          </div>

          {/* ハンバーガー */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
