// /app/app/(protected)/user/profile/updateUserProfile.ts

"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function updateUserProfile(input: { name?: string, email?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("未認証");
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      ...(input.name && { name: input.name.trim() }),
      ...(input.email && { email: input.email.trim() }),
    },
  });

  return { success: true };
}
