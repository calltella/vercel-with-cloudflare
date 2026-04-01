"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "./updatePassword";

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        await updatePassword({
          currentPassword,
          newPassword,
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        alert("パスワードを変更しました");
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("パスワード変更に失敗しました");
        }
      }
    });
  };

  return (
<>
      <h1 className="text-lg font-bold">パスワード変更</h1>
      <div>
        <label className="text-sm">現在のパスワード</label>
        <input
          type="password"
          className="border rounded px-2 py-1 w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">新しいパスワード</label>
        <input
          type="password"
          className="border rounded px-2 py-1 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">新しいパスワード（確認）</label>
        <input
          type="password"
          className="border rounded px-2 py-1 w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={onSubmit}
        disabled={isPending}
        className="bg-blue-600 text-white m-2 py-1 rounded disabled:opacity-50"
      >
        {isPending ? "変更中..." : "パスワード変更"}
      </button>
      </>
  );
}
