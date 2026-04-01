"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function updateAvatarKey(key: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("未認証");
console.log(`key: ${key} session: ${session.user.id}`)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: key },
  });
}
