import { NextRequest, NextResponse } from "next/server";
import { StartExecutionCommand } from "@aws-sdk/client-sfn";
import { sfn, STEP_FUNCTIONS_ARN } from "@/lib/aws-clients";

// POST /api/start-job
// Body: { jobId: string, s3Key: string, companyName: string }
// Returns: { executionArn }
export async function POST(req: NextRequest) {
  const { jobId, s3Key, companyName } = await req.json();

  if (!jobId || !s3Key || !companyName) {
    return NextResponse.json(
      { error: "jobId, s3Key, and companyName are required" },
      { status: 400 }
    );
  }

  const command = new StartExecutionCommand({
    stateMachineArn: STEP_FUNCTIONS_ARN,
    name: jobId, // unique execution name = jobId
    input: JSON.stringify({ jobId, s3Key, companyName }),
  });

  const { executionArn } = await sfn.send(command);

  return NextResponse.json({ executionArn });
}
