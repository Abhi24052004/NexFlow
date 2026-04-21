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
    }

    const body = await request.json();

    const sheetData = {
      spreadsheetId: body.spreadsheetId,
      spreadsheetName: body.spreadsheetName,
      sheetName: body.sheetName,
      rowNumber: body.rowNumber,
      timestamp: body.timestamp,
      headers: body.headers,
      row: body.row,
      raw: body,
    };

    // Trigger an Inngest job
    const enqueueResult = await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleSheet: sheetData,
      },
    });

    return NextResponse.json({
      success: true,
      queued: enqueueResult,
    });
  } catch (error) {
    console.error("Google sheet webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Google Sheet record" },
      { status: 500 },
    );
  }
}
