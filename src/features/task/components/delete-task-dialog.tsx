"use client";

import { useDeleteTask } from "@/features/task/hooks/use-delete-task";
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

type DeleteTaskDialogProps = {
  projectId: string;
  taskId: string;
  taskTitle: string;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function DeleteTaskDialog({
  projectId,
  taskId,
  taskTitle,
  open,
  onOpenChangeAction,
}: DeleteTaskDialogProps) {
  const mutation = useDeleteTask(projectId);

  async function handleDelete() {
    try {
      await mutation.mutateAsync(taskId);
      onOpenChangeAction(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{taskTitle}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
