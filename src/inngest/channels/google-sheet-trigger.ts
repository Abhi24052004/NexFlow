import { channel, topic } from "@inngest/realtime";

export const GOOGLE_SHEET_TRIGGER_CHANNEL_NAME = "google-sheet-trigger-execution";

export const googleSheetTriggerChannel = channel(GOOGLE_SHEET_TRIGGER_CHANNEL_NAME)
  .addTopic(
    topic("status").type<{
      nodeId: string;
      status: "loading" | "success" | "error";
    }>(),
  );
