import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "@/features/workspace/api/create-workspace";
import { workspaceKeys } from "@/features/workspace/hooks/use-workspaces";
import { toast } from "sonner";
import axios from "axios";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceKeys.lists()
      });

      toast.success("Workspace created successfully");
    },

    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(
        typeof message === "string"
          ? message
          : "Failed to create workspace.",
      );
    },
  });
}