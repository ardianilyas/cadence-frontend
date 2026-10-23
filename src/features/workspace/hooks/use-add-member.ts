"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "@/features/workspace/api/add-member";
import { AddMemberSchema } from "@/features/workspace/schemas/workspace.schema";
import { toast } from "sonner";
import { handleApiError } from "@/lib/handle-api-error";
import { workspaceKeys } from "@/features/workspace/constants/workspace-key.constant";

export function useAddMember(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId: targetWorkspaceId,
      payload,
    }: {
      workspaceId?: string;
      payload: AddMemberSchema;
    }) => {
      const id = targetWorkspaceId || workspaceId;
      if (!id) {
        throw new Error("Workspace ID is required");
      }
      return addMember(id, payload);
    },

    onSuccess: async (_data, variables) => {
      const id = variables.workspaceId || workspaceId;
      if (id) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: workspaceKeys.detail(id),
          }),
          queryClient.invalidateQueries({
            queryKey: workspaceKeys.availableUsers(id),
          }),
          queryClient.invalidateQueries({
            queryKey: workspaceKeys.workspaceMembers(workspaceId),
          }),
          queryClient.invalidateQueries({
            queryKey: workspaceKeys.lists(),
          }),
        ]);
      }

      toast.success("Member added successfully");
    },

    onError: (error) => {
      handleApiError(error);
    },
  });
}
