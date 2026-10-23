import { api } from "@/lib/axios";
import { CreateProjectSchema } from "@/features/project/schemas/project.schema";
import { Project } from "@/features/project/types/project.type";

export async function createProject(
  workspaceId: string,
  payload: CreateProjectSchema,
): Promise<Project> {
  const response = await api.post<{ data: Project }>(
    `/workspaces/${workspaceId}/projects`,
    {
      ...payload,
      startDate: payload.startDate.toISOString(),
      dueDate: payload.dueDate.toISOString(),
    },
  );

  return response.data.data;
}
