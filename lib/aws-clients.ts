import { S3Client } from "@aws-sdk/client-s3";
import { SFNClient } from "@aws-sdk/client-sfn";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const config = {
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

export const s3 = new S3Client(config);
export const sfn = new SFNClient(config);

const dynamo = new DynamoDBClient(config);
export const ddb = DynamoDBDocumentClient.from(dynamo);

export const S3_INPUT_BUCKET = "lito.ai-input-pdfs";
export const S3_OUTPUT_BUCKET = "lito.ai-output-memos";
export const STEP_FUNCTIONS_ARN =
  "arn:aws:states:us-east-1:756559157866:stateMachine:lito-pipeline";
export const DYNAMO_TABLE = "lito-jobs";
