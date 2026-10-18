import { api } from "@/lib/axios";
import { AvailableUser } from "@/features/workspace/types/workspace.type";

export async function getAvailableUsers(id: string): Promise<AvailableUser[]> {
  const { data } = await api.get(`/workspaces/${id}/available-users`);

  return data.data;
}
