"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { uploadToR2, deleteFromR2 } from "./uploadToR2";

function generateRandomString(length: number): string {
  return Array.from({ length }, () =>
    Math.random().toString(36).charAt(2)
  ).join("");
}

export async function updateAvatar(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("未認証");
  }

  const file = formData.get("avatar") as File | null;
  if (!file) {
    throw new Error("ファイルがありません");
  }

  // 2MB 制限
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("ファイルサイズは 2MB までです");
  }

  // MIME チェック
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルのみ対応しています");
  }

  // ① 現在の avatar key を取得
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatarUrl: true },
  });

  const oldAvatarKey = user?.avatarUrl ?? null;

  // ② 新しい R2 key を生成
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const randomPart = generateRandomString(8);

  const newAvatarKey = `avatars/${session.user.id}_${randomPart}.${ext}`;

  // ③ R2 にアップロード
  await uploadToR2(newAvatarKey, file);

  // ④ DB 更新
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      avatarUrl: newAvatarKey, // ← URLではなく key を保存
    },
  });

  // ⑤ 古い avatar を R2 から削除（あれば）
  if (oldAvatarKey) {
    try {
      await deleteFromR2(oldAvatarKey);
    } catch (err) {
      console.error("古い avatar の削除に失敗:", err);
      // UX を壊さないため throw しない
    }
  }

  // フロントでは「key」を元に署名URLを生成して表示する
  return newAvatarKey;
}
