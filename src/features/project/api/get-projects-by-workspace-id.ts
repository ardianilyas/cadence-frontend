import { api } from "@/lib/axios";
import { GetProjectsResponse } from "@/features/project/types/project.type";

export async function getProjectsByWorkspaceId(workspaceId: string) {
  const { data } = await api.get<GetProjectsResponse>(`/workspaces/${workspaceId}/projects`);

  return data.data;
}
