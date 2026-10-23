import { api } from "@/lib/axios";
import { WorkspaceMember } from "@/features/workspace/types/workspace.type";

export async function getWorkspaceMembers(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const response = await api.get(`/workspaces/${workspaceId}/members`);
  return response.data.data;
}
