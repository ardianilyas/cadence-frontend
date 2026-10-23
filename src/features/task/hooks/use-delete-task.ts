"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/features/task/api/delete-task";
import { TaskKeys } from "@/features/task/constants/task-key.constant";
import { Task } from "@/features/task/types/task.type";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handle-api-error";

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(projectId, taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: TaskKeys.byProject(projectId),
      });

      const previous = queryClient.getQueryData<Task[]>(
        TaskKeys.byProject(projectId),
      );

      queryClient.setQueryData<Task[]>(
        TaskKeys.byProject(projectId),
        (old) => old?.filter((t) => t.id !== taskId) ?? [],
      );

      return { previous };
    },

    onError: (error, _taskId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          TaskKeys.byProject(projectId),
          context.previous,
        );
      }
      handleApiError(error);
    },

    onSuccess: () => {
      toast.success("Task deleted");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: TaskKeys.byProject(projectId),
      });
    },
  });
}
