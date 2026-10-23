"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

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
import { useCreateTask } from "@/features/task/hooks/use-create-task";
import {
  createTaskSchema,
  type CreateTaskInput,
  TaskStatus,
  TaskPriority,
} from "@/features/task/schemas/create-task.schema";
import { WorkspaceMember } from "@/features/workspace/types/workspace.type";

type AddTaskProps = {
  projectId: string;
  workspaceMembers: WorkspaceMember[];
};

export function AddTask({ projectId, workspaceMembers }: AddTaskProps) {
  const [open, setOpen] = useState(false);
  const createTaskMutation = useCreateTask(projectId);

  const assigneeSelectItems = useMemo(
    () =>
      workspaceMembers.map((member) => ({
        value: member.userId,
        label: member.user.name,
      })),
    [workspaceMembers],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: undefined,
      projectId,
      assigneeId: undefined,
    },
  });

  function onSubmit(values: CreateTaskInput) {
    createTaskMutation.mutate(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && createTaskMutation.isPending) return;

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 size-3.5" /> New task
          </Button>
        }
      />
      <DialogContent className="min-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task for this project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="title">Title</Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="Task title"
                  className="w-full"
                  aria-invalid={!!errors.title}
                  disabled={createTaskMutation.isPending}
                  {...field}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
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
                  placeholder="Task description"
                  className="w-full"
                  aria-invalid={!!errors.description}
                  disabled={createTaskMutation.isPending}
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
              <Label htmlFor="status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value || null}
                    onValueChange={(val) =>
                      field.onChange(val ?? TaskStatus.TODO)
                    }
                    disabled={createTaskMutation.isPending}
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
                        {Object.values(TaskStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
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

            <div className="space-y-2 w-full">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select
                    value={field.value || null}
                    onValueChange={(val) =>
                      field.onChange(val ?? TaskPriority.MEDIUM)
                    }
                    disabled={createTaskMutation.isPending}
                  >
                    <SelectTrigger
                      id="priority"
                      className="w-full"
                      aria-invalid={!!errors.priority}
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {Object.values(TaskPriority).map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p className="text-sm text-destructive">
                  {errors.priority.message}
                </p>
              )}
            </div>
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
                  disabled={createTaskMutation.isPending}
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

          <div className="space-y-2 w-full">
            <Label htmlFor="assigneeId">Assignee</Label>
            <Controller
              control={control}
              name="assigneeId"
              render={({ field }) => (
                <Select
                  items={assigneeSelectItems}
                  value={field.value || null}
                  onValueChange={field.onChange}
                  disabled={createTaskMutation.isPending}
                >
                  <SelectTrigger
                    id="assigneeId"
                    className="w-full"
                    aria-invalid={!!errors.assigneeId}
                  >
                    <SelectValue placeholder="Select assignee (optional)">
                      {(value) =>
                        workspaceMembers.find((m) => m.userId === value)?.user
                          .name ?? value
                      }
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {workspaceMembers.map((member) => (
                        <SelectItem key={member.userId} value={member.userId}>
                          {member.user.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigneeId && (
              <p className="text-sm text-destructive">
                {errors.assigneeId.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={createTaskMutation.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
