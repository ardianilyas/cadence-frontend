import { useQuery } from "@tanstack/react-query";
import { ProjectKeys } from "@/features/project/constants/project-key.constant";
import { getProjectsByWorkspaceId } from "@/features/project/api/get-projects-by-workspace-id";

export function useGetProjectsByWorkspaceId(workspaceId: string) {
  return useQuery({
    queryKey: ProjectKeys.lists(),
    queryFn: () => getProjectsByWorkspaceId(workspaceId),
    enabled: Boolean(workspaceId),
    retry: false,
  });
}
