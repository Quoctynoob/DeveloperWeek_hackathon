import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_INPUT_BUCKET } from "@/lib/aws-clients";
import { randomUUID } from "crypto";

// POST /api/upload
// Body: { fileName: string, fileType: string }
// Returns: { jobId, uploadUrl, s3Key }
export async function POST(req: NextRequest) {
  const { fileName, fileType } = await req.json();

  if (!fileName || !fileType) {
    return NextResponse.json(
      { error: "fileName and fileType are required" },
      { status: 400 }
    );
  }

  const jobId = randomUUID();
  const s3Key = `${jobId}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: S3_INPUT_BUCKET,
    Key: s3Key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

  return NextResponse.json({ jobId, uploadUrl, s3Key });
}
