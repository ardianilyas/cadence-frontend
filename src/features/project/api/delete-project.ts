import { api } from "@/lib/axios";

export async function deleteProject(
  workspaceId: string,
  projectId: string,
): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
}
