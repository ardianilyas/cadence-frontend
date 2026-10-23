"use client";

import { Project } from "@/features/project/types/project.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateProjectSchema,
  updateProjectSchema,
  ProjectStatus,
} from "@/features/project/schemas/project.schema";
import { useUpdateProject } from "@/features/project/hooks/use-update-project";
import { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type UpdateProjectDialogProps = {
  project: Project;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function UpdateProjectDialog({
  project,
  open,
  onOpenChangeAction,
}: UpdateProjectDialogProps) {
  const form = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      startDate: new Date(project.startDate),
      dueDate: new Date(project.dueDate),
      status: project.status as ProjectStatus,
    },
  });

  const mutation = useUpdateProject();

  useEffect(() => {
    if (open) {
      form.reset({
        name: project.name,
        description: project.description,
        startDate: new Date(project.startDate),
        dueDate: new Date(project.dueDate),
        status: project.status as ProjectStatus,
      });
    }
  }, [open, project, form]);

  async function onSubmit(values: UpdateProjectSchema) {
    try {
      await mutation.mutateAsync({
        workspaceId: project.workspaceId,
        projectId: project.id,
        payload: values,
      });

      onOpenChangeAction(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="w-full min-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project data</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My project"
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
              placeholder="What is this project for?"
              {...form.register("description")}
              disabled={mutation.isPending}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) =>
                form.setValue("status", value as ProjectStatus)
              }
              disabled={mutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProjectStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-destructive">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("startDate") && "text-muted-foreground",
                      )}
                      disabled={mutation.isPending}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("startDate")
                        ? format(form.watch("startDate"), "PPP")
                        : "Pick a date"}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("startDate")}
                    onSelect={(date) =>
                      date && form.setValue("startDate", date)
                    }
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.startDate && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("dueDate") && "text-muted-foreground",
                      )}
                      disabled={mutation.isPending}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("dueDate")
                        ? format(form.watch("dueDate"), "PPP")
                        : "Pick a date"}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("dueDate")}
                    onSelect={(date) => date && form.setValue("dueDate", date)}
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.dueDate && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.dueDate.message}
                </p>
              )}
            </div>
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
  );
}
