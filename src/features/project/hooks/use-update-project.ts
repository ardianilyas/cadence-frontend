"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProjectSchema } from "@/features/project/schemas/project.schema";
import { updateProject } from "@/features/project/api/update-project";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handle-api-error";
import { ProjectKeys } from "@/features/project/constants/project-key.constant";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, projectId, payload }: { workspaceId: string; projectId: string; payload: UpdateProjectSchema }) =>
      updateProject(workspaceId, projectId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ProjectKeys.lists(),
      });

      toast.success("Project updated successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
}
