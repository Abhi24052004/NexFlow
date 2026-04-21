"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { googleSheetTriggerChannel } from "@/inngest/channels/google-sheet-trigger";
import { inngest } from "@/inngest/client";

export type GoogleSheetTriggerToken = Realtime.Token<
  typeof googleSheetTriggerChannel,
  ["status"]
>;

export async function fetchGoogleSheetTriggerRealtimeToken(): Promise<GoogleSheetTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: googleSheetTriggerChannel(),
    topics: ["status"],
  });

  return token;
};
