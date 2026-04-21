import type { NodeExecutor } from "@/features/executions/types";
import { googleSheetTriggerChannel } from "@/inngest/channels/google-sheet-trigger";

type GoogleSheetTriggerData = Record<string, unknown>;

export const googleSheetTriggerExecutor: NodeExecutor<GoogleSheetTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    googleSheetTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const result = await step.run("google-sheet-trigger", async () => context);

  await publish(
    googleSheetTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
