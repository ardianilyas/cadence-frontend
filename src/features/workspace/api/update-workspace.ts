import { UpdateWorkspaceSchema } from "@/features/workspace/schemas/workspace.schema";
import {
  UpdateWorkspaceResponse,
  Workspace,
} from "@/features/workspace/types/workspace.type";
import { api } from "@/lib/axios";

export async function updateWorkspace(
  id: string,
  payload: UpdateWorkspaceSchema,
): Promise<Workspace> {
  const response = await api.patch<UpdateWorkspaceResponse>(
    `/workspaces/${id}`,
    payload,
  );

  return response.data.data;
}
