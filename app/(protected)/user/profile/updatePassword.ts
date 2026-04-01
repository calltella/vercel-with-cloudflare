// /app/app/(protected)/user/profile/updatePassword.ts

"use server";

import { auth } from "@/auth";
import  prisma  from "@/lib/prisma";
import bcrypt from "bcryptjs";

type Input = {
  currentPassword: string;
  newPassword: string;
};

export async function updatePassword(input: Input) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("認証されていません");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    throw new Error("ユーザーが存在しません");
  }

  const isValid = await bcrypt.compare(
    input.currentPassword,
    user.passwordHash
  );

  if (!isValid) {
    throw new Error("現在のパスワードが正しくありません");
  }

  if (input.newPassword.length < 8) {
    throw new Error("パスワードは8文字以上にしてください");
  }

  const hashed = await bcrypt.hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: hashed },
  });
}
