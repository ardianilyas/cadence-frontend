import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/features/workspace/api/get-workspaces";
import { workspaceKeys } from "@/features/workspace/constants/workspace-key.constant";

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => getWorkspaces(),
  });
}
