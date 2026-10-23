export const TaskKeys = {
  all: ["tasks"] as const,
  lists: () => [...TaskKeys.all, "lists"] as const,
  byProject: (projectId: string) =>
    [...TaskKeys.all, "project", projectId] as const,
  detail: (taskId: string) => [...TaskKeys.all, "detail", taskId] as const,
};
