// /app/(protected)/user/profile/page.tsx
/**
 * アバター
 * 表示 ProfilePage → getR2ImageUrl(r2からURL取得) → ProfileClient
 * 更新 ProfileClient → onAvatarChange → uploadAvatar → updateAvatarKey(DB保存) → startTransition
 */
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getR2ImageUrl } from "@/lib/r2GetUrl";
import ProfileClient from "./ProfileClient";
import { ColorThemeKey } from "@prisma/client";

const DEFAULT_COLOR_THEME: ColorThemeKey = "default";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      avatarUrl: true,
      account: {
        select: {
          colorThemes: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const avatarUrl = user?.avatarUrl
    ? await getR2ImageUrl(user.avatarUrl)
    : "/avatars/default.png";

  return (
    <ProfileClient
      user={{
        name: user?.name ?? "",
        email: user?.email ?? "",
        colorThemes:
          user.account?.colorThemes ?? DEFAULT_COLOR_THEME,
        avatarUrl,
      }}
    />
  );
}
