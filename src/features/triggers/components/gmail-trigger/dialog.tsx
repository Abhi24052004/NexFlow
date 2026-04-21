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
import { generateGmailScript } from "./utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const GmailTriggerDialog = ({
  open,
  onOpenChange
}: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl =
    `${baseUrl}/api/webhooks/gmail?workflowId=${workflowId}`;

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gmail Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in a Google Apps Script attached to your
            Google account to trigger this workflow when new emails arrive.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open script.google.com and create a new project</li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL automatically by copying from here</li>
              <li>Save, then click Triggers (clock icon)</li>
              <li>Create a trigger for checkForNewEmails</li>
              <li>Choose: Time-driven, every 5 to 15 minutes (recommended)</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="font-medium text-sm">Google Apps Script:</h4>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const script = generateGmailScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success("Script copied to clipboard");
                } catch {
                  toast.error("Failed to copy script to clipboard");
                }
              }}
            >
              <CopyIcon className="size-4 mr-2" />
              Copy Gmail Apps Script
            </Button>
            <p className="text-xs text-muted-foreground">
              This script includes your webhook URL and forwards new inbox emails
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{gmail.subject}}"}
                </code>
                - Email subject
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{gmail.fromEmail}}"}
                </code>
                - Sender email address
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{gmail.body}}"}
                </code>{" "}
                - Full email body (plain text)
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{gmail.snippet}}"}
                </code>{" "}
                - First 200 chars of message
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json gmail}}"}
                </code>{" "}
                - Full extracted Gmail payload
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
