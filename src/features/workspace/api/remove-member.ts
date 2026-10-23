import { api } from "@/lib/axios";

type RemoveMemberParams = {
  workspaceId: string;
  memberId: string;
};

export async function removeMember({
  workspaceId,
  memberId,
}: RemoveMemberParams): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
}
