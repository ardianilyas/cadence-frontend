"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProject } from "@/features/project/api/delete-project";
import { handleApiError } from "@/lib/handle-api-error";
import { ProjectKeys } from "@/features/project/constants/project-key.constant";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      projectId,
    }: {
      workspaceId: string;
      projectId: string;
    }) => deleteProject(workspaceId, projectId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ProjectKeys.lists(),
      });

      toast.success("Project deleted successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
}
