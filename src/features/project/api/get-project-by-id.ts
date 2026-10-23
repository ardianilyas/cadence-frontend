import { api } from "@/lib/axios";
import { Project } from "@/features/project/types/project.type";

export async function getProjectById(
  workspaceId: string,
  projectId: string,
): Promise<Project> {
  const response = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}`,
  );
  return response.data.data;
}
