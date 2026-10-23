import { api } from "@/lib/axios";
import { Task, TaskStatus } from "@/features/task/types/task.type";

type UpdateTaskStatusPayload = {
  projectId: string;
  taskId: string;
  status: TaskStatus;
};

type UpdateTaskStatusResponse = {
  success: boolean;
  message: string;
  data: Task;
};

export async function updateTaskStatus({
  projectId,
  taskId,
  status,
}: UpdateTaskStatusPayload): Promise<Task> {
  const { data } = await api.patch<UpdateTaskStatusResponse>(
    `/projects/${projectId}/tasks/${taskId}/status`,
    { status },
  );
  return data.data;
}
