"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type RemoveMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  isPending: boolean;
  onConfirm: () => void;
};

export function RemoveMemberDialog({ open, onOpenChange, memberName, isPending, onConfirm }: RemoveMemberDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove workspace member?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove <strong>{memberName}</strong> from
            this workspace? They will lose access to this
            workspace. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            variant="destructive"
            onClick={(event) => {
              // Keep the dialog open until the request succeeds.
              event.preventDefault();
              onConfirm();
            }}
          >
            {isPending ? "Removing..." : "Remove member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
