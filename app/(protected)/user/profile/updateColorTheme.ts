"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ColorThemeKey } from "@/app/theme/colorTheme";

export async function updateColorTheme(theme: ColorThemeKey) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("未認証");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      accounts: {
        select: {
          type: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  await prisma.account.update({
    where: {
      userId_type: {
        userId: session.user.id,
        type: user.accounts[0]?.type,
      },
    },
    data: { colorThemes: theme },
  });
}
