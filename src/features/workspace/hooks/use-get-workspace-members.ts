import { useQuery } from "@tanstack/react-query";
import { getWorkspaceMembers } from "@/features/workspace/api/get-workspace-members";
import { workspaceKeys } from "@/features/workspace/constants/workspace-key.constant";

export function useGetWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.workspaceMembers(workspaceId),
    queryFn: () => getWorkspaceMembers(workspaceId),
    enabled: Boolean(workspaceId),
    retry: false,
  });
}
