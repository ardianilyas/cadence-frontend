"use client"

import { Workspace } from "@/features/workspace/types/workspace.type";
import { useDeleteWorkspace } from "@/features/workspace/hooks/use-delete-workspace";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

type DeleteWorkspaceDialogProps = {
  workspace: Workspace;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function DeleteWorkspaceDialog({ workspace, open, onOpenChangeAction }: DeleteWorkspaceDialogProps) {
  const mutation = useDeleteWorkspace();

  async function handleDelete() {
    try {
      await mutation.mutateAsync(workspace.id);
      onOpenChangeAction(false)
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete workspace
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure want to delete{" "}
            <strong>{workspace.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction variant="destructive" disabled={mutation.isPending} onClick={(event) => {
            event.preventDefault();
            void handleDelete();
          }}>
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}