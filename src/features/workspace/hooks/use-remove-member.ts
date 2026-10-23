import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "@/features/workspace/api/remove-member";
import { workspaceKeys } from "@/features/workspace/constants/workspace-key.constant";
import { toast } from "sonner";

export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeMember({ workspaceId, memberId }),
    onSuccess: async () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: workspaceKeys.detail(workspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: workspaceKeys.availableUsers(workspaceId),
        }),
      ]);

      toast.success("Member removed successfully");
    },
  });
}
