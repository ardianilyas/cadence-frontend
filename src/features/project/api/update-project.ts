import { UpdateProjectSchema } from "@/features/project/schemas/project.schema";
import { Project } from "@/features/project/types/project.type";
import { api } from "@/lib/axios";

export async function updateProject(
  workspaceId: string,
  projectId: string,
  payload: UpdateProjectSchema
): Promise<Project> {
  const response = await api.patch<{ data: Project }>(
    `/workspaces/${workspaceId}/projects/${projectId}`,
    {
      ...payload,
      startDate: payload.startDate.toISOString(),
      dueDate: payload.dueDate.toISOString(),
    }
  );

  return response.data.data;
}
