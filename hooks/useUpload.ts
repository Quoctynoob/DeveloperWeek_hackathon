"use client";

import { useState } from "react";

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: string }
  | { status: "starting" }
  | { status: "error"; error: string }
  | { status: "done"; jobId: string };

export function useUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });

  async function upload(file: File) {
    try {
      // Step 1: Get presigned URL + jobId
      setState({ status: "uploading", progress: "Requesting upload URL…" });

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || "application/pdf",
        }),
      });

      if (!uploadRes.ok) throw new Error("Failed to get upload URL");
      const { jobId, uploadUrl, s3Key } = await uploadRes.json();

      // Step 2: PUT file directly to S3
      setState({ status: "uploading", progress: "Uploading PDF to S3…" });

      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/pdf" },
        body: file,
      });

      if (!s3Res.ok) throw new Error("Failed to upload file to S3");

      // Step 3: Trigger Step Functions
      setState({ status: "starting" });

      const jobRes = await fetch("/api/start-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, s3Key }),
      });

      if (!jobRes.ok) throw new Error("Failed to start pipeline");

      setState({ status: "done", jobId });
      return jobId;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setState({ status: "error", error: message });
      return null;
    }
  }

  return { state, upload };
}
