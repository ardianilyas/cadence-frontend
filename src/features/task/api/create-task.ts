import { api } from "@/lib/axios";
import { CreateTaskInput } from "@/features/task/schemas/create-task.schema";

export async function createTask(data: CreateTaskInput) {
  const response = await api.post(`/projects/${data.projectId}/tasks`, data);
  return response.data;
}
