import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/features/workspace/api/get-workspaces";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "lists"] as const,
}

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => getWorkspaces(),
  });
}
