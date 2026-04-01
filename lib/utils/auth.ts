import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type {ThemeMode} from "@/app/types/user"
import type { ColorThemeKey } from "@/app/theme/colorTheme";

/**
 * メールアドレスとハッシュ化前パスワードでユーザーを取得
 * @param email string
 * @param password string（平文）
 */
export async function getUserFromDb(
  email: string,
  password: string
) {
  // ユーザー取得
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return null;
  }

  if (!user.passwordHash) {
    return null;
  }

  // パスワード検証
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  // NextAuth が要求する user オブジェクトを返す
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl:user.avatarUrl,
  };


}
export async function getAccountFromDb(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId: userId },
  });
  console.log(`account: ${account}`)
  return {
    id: account?.id,
    themeMode: account?.themeMode as ThemeMode,
    themeColor: account?.colorThemes as ColorThemeKey,
  }

}
