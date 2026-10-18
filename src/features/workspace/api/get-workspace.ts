import { GetWorkspaceResponse, Workspace } from "@/features/workspace/types/workspace.type";
import { api } from "@/lib/axios";

export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  const response = await api.get<GetWorkspaceResponse>(`/workspaces/${workspaceId}`);

  return response.data.data;
}
