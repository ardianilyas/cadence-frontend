import { GetWorkspacesResponse, Workspace } from "@/features/workspace/types/workspace.type";
import { api } from "@/lib/axios";

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await api.get<GetWorkspacesResponse>("/workspaces");

  return response.data.data;
}
