"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/features/task/api/update-task-status";
import { TaskKeys } from "@/features/task/constants/task-key.constant";
import { Task, TaskStatus } from "@/features/task/types/task.type";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handle-api-error";

type UpdateTaskStatusVariables = {
  projectId: string;
  taskId: string;
  status: TaskStatus;
};

export function useUpdateTaskStatus(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateTaskStatusVariables) =>
      updateTaskStatus(variables),

    onMutate: async ({ taskId, status }) => {
      // Cancel in-flight queries so they don't overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: TaskKeys.byProject(projectId),
      });

      const previous = queryClient.getQueryData<Task[]>(
        TaskKeys.byProject(projectId),
      );

      // Optimistically update the task status in cache
      queryClient.setQueryData<Task[]>(
        TaskKeys.byProject(projectId),
        (old) =>
          old?.map((t) => (t.id === taskId ? { ...t, status } : t)) ?? [],
      );

      return { previous };
    },

    onError: (error, _variables, context) => {
      // Roll back on failure
      if (context?.previous) {
        queryClient.setQueryData(
          TaskKeys.byProject(projectId),
          context.previous,
        );
      }
      handleApiError(error);
    },

    onSuccess: () => {
      toast.success("Task status updated");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: TaskKeys.byProject(projectId),
      });
    },
  });
}
