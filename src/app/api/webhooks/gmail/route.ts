import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: workflowId" },
        { status: 400 },
      );
    };

    const body = await request.json();

    const gmailData = {
      id: body.id,
      threadId: body.threadId,
      subject: body.subject,
      from: body.from,
      fromEmail: body.fromEmail,
      to: body.to,
      cc: body.cc,
      bcc: body.bcc,
      date: body.date,
      snippet: body.snippet,
      body: body.plainBody || body.body,
      labels: body.labels,
      rawHeaders: body.rawHeaders,
      raw: body,
    };

    const enqueueResult = await sendWorkflowExecution({
      workflowId,
      initialData: {
        gmail: gmailData,
      },
    });

    return NextResponse.json({
      success: true,
      queued: enqueueResult,
    });
  } catch (error) {
    console.error("Gmail webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Gmail webhook" },
      { status: 500 },
    );
  }
};
