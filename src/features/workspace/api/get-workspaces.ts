import { GetWorkspaceResponse, Workspace } from "@/features/workspace/types/workspace.type";
import { api } from "@/lib/axios";

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await api.get<GetWorkspaceResponse>("/workspaces");

  return response.data.data;
}
