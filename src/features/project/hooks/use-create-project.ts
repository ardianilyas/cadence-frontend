"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/features/project/api/create-project";
import { CreateProjectSchema } from "@/features/project/schemas/project.schema";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handle-api-error";
import { ProjectKeys } from "@/features/project/constants/project-key.constant";

export function useCreateProject(workspaceId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId: targetWorkspaceId,
      payload,
    }: {
      workspaceId?: string;
      payload: CreateProjectSchema;
    }) => {
      const id = targetWorkspaceId || workspaceId;
      if (!id) {
        throw new Error("Workspace ID is required");
      }
      return createProject(id, payload);
    },

    onSuccess: async (_data, variables) => {
      const id = variables.workspaceId || workspaceId;
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: ProjectKeys.lists(),
        });
      }

      toast.success("Project created successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
}
