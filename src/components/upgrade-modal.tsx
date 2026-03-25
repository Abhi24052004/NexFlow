"use client";

import{AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter
} from "@/components/ui/alert-dialog";
import {authClient} from "@/lib/auth-client";
import { int } from "zod";

interface UpgradeModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({isOpen, onOpenChange}: UpgradeModalProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogTrigger />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your current plan has reached its limit. Please upgrade to continue using the service.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {authClient.checkout({slug:"nexflow-Pro"})}}>Upgrade Now</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>  
                
    )
}