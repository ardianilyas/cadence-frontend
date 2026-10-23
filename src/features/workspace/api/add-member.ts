import { api } from "@/lib/axios";
import { AddMemberSchema } from "@/features/workspace/schemas/workspace.schema";
import {
  AddMemberResponse,
  WorkspaceMember,
} from "@/features/workspace/types/workspace.type";

export async function addMember(
  workspaceId: string,
  payload: AddMemberSchema,
): Promise<WorkspaceMember> {
  const response = await api.post<AddMemberResponse>(
    `/workspaces/${workspaceId}/members`,
    payload,
  );

  return response.data.data;
}
