"use client"

import { useState } from "react";
import { useCreateWorkspace } from "@/features/workspace/hooks/use-create-workspace";
import { useForm } from "react-hook-form";
import { createWorkspaceSchema, CreateWorkspaceSchema } from "@/features/workspace/schemas/workspace.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";

export function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);
  const createWorkspace = useCreateWorkspace();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: CreateWorkspaceSchema) {
    createWorkspace.mutate(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && createWorkspace.isPending) return;

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button><PlusIcon /> Create workspace</Button>} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Create a workspace to organize your projects.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="workspace-name"
              className="text-sm font-medium"
            >
              Name
            </label>

            <Input
              id="workspace-name"
              placeholder="e.g. My Company"
              autoComplete="off"
              aria-invalid={!!errors.name}
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="workspace-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="workspace-description"
              placeholder="What is this workspace for?"
              rows={4}
              aria-invalid={!!errors.description}
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={createWorkspace.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createWorkspace.isPending}
            >
              {createWorkspace.isPending
                ? "Creating..."
                : "Create workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}