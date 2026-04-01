// /app/app/(protected)/user/profile/ProfileClient.tsx
"use client";

import { ThemeToggle } from "@/components/customcomponents/ThemeToggle";
import { useState, useTransition } from "react";
import { updateUserProfile } from "./updateUserProfile";
import { useRouter } from "next/navigation";
import ThemeSelector from "./ThemeSelector";
import Image from "next/image";
import { updateAvatarKey } from "./updateAvatarKey";
import PasswordChangeForm from "./PasswordChangeForm";
import { uploadAvatar } from "./uploadAvatar";
import { ColorThemeKey } from "@prisma/client";

type ProfileUser = {
  name: string;
  email: string;
  colorThemes: ColorThemeKey;
  avatarUrl: string;
};

export default function ProfileClient({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const onSave = () => {
    startTransition(async () => {
      await updateUserProfile({ name, email });
      //表示を変える必要がないのでセッションの更新はしない
    });
  };

  const onAvatarChange = async (file: File) => {
    const key = await uploadAvatar(file);
    await updateAvatarKey(key);
    startTransition(() => {
      router.refresh(); // Server Component 再実行 → 新しい署名URL
    });
  };

  return (
    <div className="flex flex-row mx-1 p-1" suppressHydrationWarning>
      <div className="flex flex-col gap-4 ml-15 pl-5">
        <div className="flex flex-col gap-4 m-0 p-5 rounded-md border-blue-950 border max-w-md">
          <h1 className="text-lg font-bold">ユーザープロファイル変更</h1>
          <div>
            <label className="text-sm">名前</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">メールアドレス</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={onSave}
            disabled={isPending}
            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {isPending ? "保存中..." : "保存"}
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-0 px-5 py-2 max-w-md">
          <div className="flex flex-row">
            <h1 className="text-lg font-bold">ダークモード変更</h1>：{" "}
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-0 px-5 py-2 max-w-md">
          <h1 className="text-lg font-bold">テーマカラー変更</h1>
          <ThemeSelector current={user.colorThemes} />
        </div>
        <div className="flex flex-col gap-4 mt-0 px-5 py-2 max-w-md">
          <h1 className="text-lg font-bold">アバター変更</h1>
          <div className="flex items-center gap-4">
            <Image
              width={120}
              height={120}
              src={user.avatarUrl}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border"
              unoptimized
            />

            <label className="cursor-pointer text-sm text-blue-600">
              1024px以下の正方形画像で2MB以下に限ります
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onAvatarChange(file);
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 ml-15 p-0 ">
        <div className="flex flex-col gap-4 m-0 p-5 rounded-md border-blue-950 border max-w-md">
          <PasswordChangeForm /></div>
      </div>
    </div>
  );
}
