"use client";

export async function uploadAvatar(file: File): Promise<string> {
  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });

  if (!res.ok) {
    throw new Error("署名URLの取得に失敗しました");
  }

  const { uploadUrl, key } = await res.json();

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("R2 へのアップロードに失敗しました");
  }

  return key;
}
