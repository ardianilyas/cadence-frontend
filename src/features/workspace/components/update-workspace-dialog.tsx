"use client"

import { Workspace } from "@/features/workspace/types/workspace.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateWorkspaceSchema, updateWorkspaceSchema } from "@/features/workspace/schemas/workspace.schema";
import { useUpdateWorkspace } from "@/features/workspace/hooks/use-update-workspace";
import { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type UpdateWorkspaceDialogProps = {
  workspace: Workspace;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function UpdateWorkspaceDialog({ workspace, open, onOpenChangeAction }: UpdateWorkspaceDialogProps) {
  const form = useForm({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description
    },
  });

  const mutation = useUpdateWorkspace();

  useEffect(() => {
    if (open) {
      form.reset({
        name: workspace.name,
        description: workspace.description
      });
    }
  }, [open, workspace, form]);

  async function onSubmit(values: UpdateWorkspaceSchema) {
    try {
      await mutation.mutateAsync({
        id: workspace.id,
        payload: values
      });

      onOpenChangeAction(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>Update workspace data</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My workspace"
              {...form.register("name")}
              disabled={mutation.isPending}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What is this workspace for?"
              {...form.register("description")}
              disabled={mutation.isPending}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}