import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateWorkspaceSchema } from "@/features/workspace/schemas/workspace.schema";
import { updateWorkspace } from "@/features/workspace/api/update-workspace";
import { workspaceKeys } from "@/features/workspace/hooks/use-workspaces";
import { toast } from "sonner";

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload } : { id: string, payload: UpdateWorkspaceSchema }) => updateWorkspace(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: workspaceKeys.lists()
      });

      toast.success("Workspace updated successfully.");
    },

    onError: () => {
      toast.error("Failed to update workspace.");
    }
  });
}
