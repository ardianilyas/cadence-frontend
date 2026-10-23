import { api } from "@/lib/axios";

export async function deleteTask(
  projectId: string,
  taskId: string,
): Promise<void> {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
}
