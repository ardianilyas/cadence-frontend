import { api } from "@/lib/axios";
import { GetTasksResponse } from "@/features/task/types/task.type";

export async function getTasksByProjectId(projectId: string) {
  const { data } = await api.get<GetTasksResponse>(
    `/projects/${projectId}/tasks`,
  );

  return data.data;
}
