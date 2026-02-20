import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { startupName } = data;

    // ─── 1. Read template from /public ────────────────────────────────────────
    const templatePath = path.join(process.cwd(), 'public', 'template.docx');
    const fileBuffer   = fs.readFileSync(templatePath);
    const base64FileString = fileBuffer.toString('base64');

    // ─── Credentials ──────────────────────────────────────────────────────────
    const docgenBase = 'https://na1.fusion.foxit.com';
    const docgenClientId = process.env.FOXIT_DOCGEN_CLIENT_ID?.trim();
    const docgenClientSecret = process.env.FOXIT_DOCGEN_CLIENT_SECRET?.trim();

    console.log('[generate-pdf] Sending Client ID:', docgenClientId);
    
    if (!docgenClientId || !docgenClientSecret) {
        throw new Error("Missing Document Generation Credentials in .env.local");
    }

    // ────────────────────────────────────────────────────────────────────────────
    // STEP 1 — Document Generation API: render template → PDF
    // ────────────────────────────────────────────────────────────────────────────
    
    // Explicitly defining headers as an array of arrays to prevent Next.js from altering casing
    const docgenHeaders = new Headers([
        ['client_id', docgenClientId],
        ['client_secret', docgenClientSecret],
        ['Content-Type', 'application/json']
    ]);

    const generateRes = await fetch(`${docgenBase}/document-generation/api/GenerateDocumentBase64`, {
      method: 'POST',
      headers: docgenHeaders,
      body: JSON.stringify({
        outputFormat: 'pdf',
        base64FileString: base64FileString,
        documentValues: data,
      }),
    });

    if (!generateRes.ok) {
      const body = await generateRes.text();
      console.error("[generate-pdf] Foxit Raw Error Response:", body);
      throw new Error(`Document generation failed (${generateRes.status}): ${body}`);
    }

    const generateJson = await generateRes.json();
    console.log('[generate-pdf] Foxit response keys:', Object.keys(generateJson));
    console.log('[generate-pdf] Foxit response:', JSON.stringify(generateJson).slice(0, 300));
    const generatedPdfBase64: string = generateJson.resultFileString ?? generateJson.base64FileString ?? generateJson.fileContent ?? generateJson.content ?? generateJson.data;

    // ────────────────────────────────────────────────────────────────────────────
    // RETURN EARLY FOR TESTING
    // ────────────────────────────────────────────────────────────────────────────
    // We are temporarily skipping the password protect step to isolate the Generation API issue.
    const finalPdf = Buffer.from(generatedPdfBase64, 'base64');

    return new NextResponse(finalPdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${startupName}_Memo.pdf"`,
      },
    });

  } catch (err: unknown) {
    console.error('[/api/generate-pdf] Catch Block Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}