import { useQuery } from "@tanstack/react-query";
import { ProjectKeys } from "@/features/project/constants/project-key.constant";
import { getProjectById } from "@/features/project/api/get-project-by-id";

export function useGetProjectById(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ProjectKeys.detail(projectId),
    queryFn: () => getProjectById(workspaceId, projectId),
    enabled: Boolean(workspaceId) && Boolean(projectId),
    retry: false,
  });
}
