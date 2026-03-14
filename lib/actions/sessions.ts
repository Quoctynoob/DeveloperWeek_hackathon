'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { QueryCommand, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { runWithAmplifyServerContext } from '@/lib/amplify-server-utils';
import { ddb, s3, DYNAMO_TABLE, S3_INPUT_BUCKET, S3_OUTPUT_BUCKET } from '@/lib/aws-clients';
import { type Session } from '@/types';

// Get userId from Amplify server context
async function getCurrentUserId(): Promise<string | null> {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (ctx) => getCurrentUser(ctx),
    }) as { userId: string };
    return user.userId;
  } catch {
    return null;
  }
}

// Fetch memo.json from S3 for a given job
async function fetchMemo(memoS3Key: string): Promise<any | null> {
  try {
    const s3Res = await s3.send(
      new GetObjectCommand({ Bucket: S3_OUTPUT_BUCKET, Key: memoS3Key })
    );
    const text = await s3Res.Body?.transformToString();
    if (text) return JSON.parse(text);
  } catch {
    return null;
  }
  return null;
}

// Map a DynamoDB job item to the Session type the table expects
async function toSession(item: Record<string, unknown>): Promise<Session> {
  let memo: any = null;

  // Fetch memo from S3 if available
  if (item.memoS3Key && typeof item.memoS3Key === 'string') {
    memo = await fetchMemo(item.memoS3Key);
  }

  return {
    id:        item.jobId as string,
    createdAt: item.createdAt as string,
    intake: {
      company:        memo?.company_name || (item.companyName as string) || 'Processing...',
      industry:       memo?.industry || (item.industry as string) || '—',
      fundingStage:   memo?.stage || (item.stage as string) || (item.fundingStage as string) || '—',
      primaryRegion:  memo?.primary_region || (item.primaryRegion as string) || undefined,
      revenueModel:   memo?.revenue_model || (item.revenueModel as string) || undefined,
      decision:       memo?.verdict?.recommendation || (item.decision as string) || undefined,
      status:         item.status as string,
    },
    confidence: memo?.verdict?.ai_confidence ?? (typeof item.score === 'number' ? item.score : 0),
    riskLevel:  memo?.verdict?.tier || (item.verdict as string) || 'Pending',
    result:     (item.result as Session['result']) || {} as Session['result'],
  };
}

// Get all jobs for the current user from DynamoDB
export async function getSessions(): Promise<Session[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { Items = [] } = await ddb.send(new QueryCommand({
    TableName: DYNAMO_TABLE,
    IndexName: 'userId-createdAt-index',
    KeyConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: { ':uid': userId },
    ScanIndexForward: false, // newest first
  }));

  // Fetch memos in parallel for all jobs
  return Promise.all(Items.map(toSession));
}

// Get single session by ID
export async function getSessionById(id: string): Promise<Session | null> {
  const sessions = await getSessions();
  return sessions.find(s => s.id === id) || null;
}

// Delete sessions from DynamoDB and S3
export async function deleteSessions(jobIds: string[]) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, deleted: 0, error: 'Not authenticated' };
  }

  let deleted = 0;

  for (const jobId of jobIds) {
    try {
      // First, get the job to verify ownership and get S3 keys
      const { Item: job } = await ddb.send(
        new GetCommand({ TableName: DYNAMO_TABLE, Key: { jobId } })
      );

      if (!job) continue;

      // Security: Only allow users to delete their own jobs
      if (job.userId !== userId) {
        console.warn(`User ${userId} attempted to delete job ${jobId} owned by ${job.userId}`);
        continue;
      }

      // Delete from DynamoDB
      await ddb.send(
        new DeleteCommand({ TableName: DYNAMO_TABLE, Key: { jobId } })
      );

      // Delete input PDF from S3 if exists
      if (job.inputS3Key) {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: S3_INPUT_BUCKET,
              Key: job.inputS3Key as string
            })
          );
        } catch (err) {
          console.error(`Failed to delete input S3 object ${job.inputS3Key}:`, err);
        }
      }

      // Delete memo from S3 if exists
      if (job.memoS3Key) {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: S3_OUTPUT_BUCKET,
              Key: job.memoS3Key as string
            })
          );
        } catch (err) {
          console.error(`Failed to delete memo S3 object ${job.memoS3Key}:`, err);
        }
      }

      deleted++;
    } catch (err) {
      console.error(`Failed to delete job ${jobId}:`, err);
    }
  }

  // Revalidate the dashboard page to refresh the table
  revalidatePath('/');

  return { success: true, deleted };
}

// No-ops kept for compatibility
export async function upsertSession(_session: Session) { return _session; }
export async function deleteAllSessions() { return { success: true }; }
