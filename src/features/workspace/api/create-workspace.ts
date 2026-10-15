import { CreateWorkspaceSchema } from "@/features/workspace/schemas/workspace.schema";
import { CreateWorkspaceResponse, Workspace } from "@/features/workspace/types/workspace.type";
import { api } from "@/lib/axios";

export async function createWorkspace(payload: CreateWorkspaceSchema): Promise<Workspace> {
  const response = await api.post<CreateWorkspaceResponse>("/workspaces", payload);

  return response.data.data;
}
