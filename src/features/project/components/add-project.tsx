"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useCreateProject } from "@/features/project/hooks/use-create-project";
import {
  createProjectSchema,
  type CreateProjectSchema,
  ProjectStatus,
} from "@/features/project/schemas/project.schema";
import { snakeToSpaces } from "@/helpers/snake-to-spaces";

type AddProjectProps = {
  workspaceId: string;
};

export function AddProject({ workspaceId }: AddProjectProps) {
  const [open, setOpen] = useState(false);
  const createProjectMutation = useCreateProject(workspaceId);

  const statusSelectItems = useMemo(
    () => Object.values(ProjectStatus).map((status) => ({ value: status, label: snakeToSpaces(status) })),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: undefined,
      dueDate: undefined,
      status: ProjectStatus.DRAFT,
    },
  });

  function onSubmit(values: CreateProjectSchema) {
    createProjectMutation.mutate(
      { payload: values },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && createProjectMutation.isPending) return;

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button><FolderPlus className="mr-2 size-3.5" /> New project</Button>} />
      <DialogContent className="min-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Create a new project for your workspace</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="name">Name</Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="Project name"
                  className="w-full"
                  aria-invalid={!!errors.name}
                  disabled={createProjectMutation.isPending}
                  {...field}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="description">Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Project description"
                  className="w-full"
                  aria-invalid={!!errors.description}
                  disabled={createProjectMutation.isPending}
                  {...field}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="startDate">Start Date</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    disabled={createProjectMutation.isPending}
                    placeholder="Pick start date"
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="dueDate">Due Date</Label>
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    disabled={createProjectMutation.isPending}
                    placeholder="Pick due date"
                  />
                )}
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  items={statusSelectItems}
                  value={field.value || null}
                  onValueChange={(val) => field.onChange(val ?? ProjectStatus.DRAFT)}
                  disabled={createProjectMutation.isPending}
                >
                  <SelectTrigger
                    id="status"
                    className="w-full"
                    aria-invalid={!!errors.status}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {statusSelectItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={createProjectMutation.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
