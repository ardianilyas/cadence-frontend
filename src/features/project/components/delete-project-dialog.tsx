"use client";

import { Project } from "@/features/project/types/project.type";
import { useDeleteProject } from "@/features/project/hooks/use-delete-project";
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

type DeleteProjectDialogProps = {
  project: Project;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function DeleteProjectDialog({
  project,
  open,
  onOpenChangeAction,
}: DeleteProjectDialogProps) {
  const mutation = useDeleteProject();

  async function handleDelete() {
    try {
      await mutation.mutateAsync({
        workspaceId: project.workspaceId,
        projectId: project.id,
      });
      onOpenChangeAction(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure want to delete <strong>{project.name}</strong>? This
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
