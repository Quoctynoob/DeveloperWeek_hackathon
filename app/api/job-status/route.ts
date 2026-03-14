import { NextRequest, NextResponse } from "next/server";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, DYNAMO_TABLE } from "@/lib/aws-clients";

// GET /api/job-status?jobId=xxx
// Returns: { jobId, status, currentStep, companyName, score, verdict, memoS3Key }
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const { Item } = await ddb.send(
    new GetCommand({
      TableName: DYNAMO_TABLE,
      Key: { jobId },
    })
  );

  if (!Item) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(Item);
}
