import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { filename, contentType } = await req.json();

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const key = `avatars/${crypto.randomUUID()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, {
    expiresIn: 60, // 60秒で失効
  });

  return NextResponse.json({
    uploadUrl,
    key, // DB 保存用
  });
}
