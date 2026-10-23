import { useQuery } from "@tanstack/react-query";
import { TaskKeys } from "@/features/task/constants/task-key.constant";
import { getTasksByProjectId } from "@/features/task/api/get-tasks-by-project-id";

export function useGetTasksByProjectId(projectId: string) {
  return useQuery({
    queryKey: TaskKeys.byProject(projectId),
    queryFn: () => getTasksByProjectId(projectId),
    enabled: Boolean(projectId),
    retry: false,
  });
}
