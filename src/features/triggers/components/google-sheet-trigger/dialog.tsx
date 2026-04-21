"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleSheetScript } from "./utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleSheetTriggerDialog = ({
  open,
  onOpenChange,
}: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = 
    `${baseUrl}/api/webhooks/google-sheet?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Google Sheet Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Sheet's Apps Script to trigger
            this workflow when a new record is added to the sheet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pr-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 space-y-2">
            <h4 className="font-medium text-sm">Setup instructions:</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Google Sheet</li>
              <li>Click "Extensions" → Apps Script</li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL with your webhook URL above</li>
              <li>Save the script</li>
              <li>Run the "setupTrigger" function (first time only)</li>
              <li>Grant the required permissions when prompted</li>
              <li>Verify in Triggers that "onSheetEdit", "onSheetChange", and "onSheetFormSubmit" exist</li>
              <li>Add a new row to test (manual edit, row append, or Google Form submission)</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-3 space-y-2">
            <h4 className="font-medium text-sm">Google Apps Script:</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                const script = generateGoogleSheetScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success("Script copied to clipboard");
                } catch {
                  toast.error("Failed to copy Script to clipboard");
                }
              }}
            >
              <CopyIcon className="size-3 mr-1.5" />
              Copy Script
            </Button>
            <p className="text-xs text-muted-foreground">
              Automatically detects new rows and triggers this workflow
            </p>
          </div>

          <div className="rounded-lg bg-muted p-3 space-y-2">
            <h4 className="font-medium text-xs">Available Variables</h4>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>
                <code className="bg-background px-1 py-0.5 rounded text-[11px]">
                  {"{{googleSheet.spreadsheetName}}"}
                </code>
                - Spreadsheet name
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded text-[11px]">
                  {"{{googleSheet.sheetName}}"}
                </code>
                - Sheet tab name
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded text-[11px]">
                  {"{{googleSheet.row.url}}"}
                </code>
                - Column value (simple column name)
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded text-[11px]">
                  {'{{lookup googleSheet.row "Column Name"}}'}
                </code>
                - Column value (column name with spaces)
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded text-[11px]">
                  {"{{json googleSheet.row}}"}
                </code>
                - All row data
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
