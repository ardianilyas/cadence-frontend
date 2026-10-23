"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/features/task/api/create-task";
import { CreateTaskInput } from "@/features/task/schemas/create-task.schema";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handle-api-error";
import { TaskKeys } from "@/features/task/constants/task-key.constant";

export function useCreateTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskInput) => {
      const id = payload.projectId || projectId;
      if (!id) {
        throw new Error("Project ID is required");
      }
      return createTask({ ...payload, projectId: id });
    },

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: TaskKeys.byProject(variables.projectId),
      });

      toast.success("Task created successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
}
