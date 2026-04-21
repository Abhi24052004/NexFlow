import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleSheetTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleSheetTriggerRealtimeToken } from "./actions";
import { GOOGLE_SHEET_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-sheet-trigger";

export const GoogleSheetTrigger = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_SHEET_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleSheetTriggerRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <GoogleSheetTriggerDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseTriggerNode
        {...props}
        icon="/logos/googlesheet.svg"
        name="Google Sheet"
        description="When new record is added"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GoogleSheetTrigger.displayName = "GoogleSheetTrigger";
