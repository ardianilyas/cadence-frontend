import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteWorkspace } from "@/features/workspace/api/delete-workspace";
import { workspaceKeys } from "@/features/workspace/constants/workspace-key.constant";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkspace(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceKeys.lists(),
      });

      toast.success("Workspace deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete workspace");
    }
  })
}