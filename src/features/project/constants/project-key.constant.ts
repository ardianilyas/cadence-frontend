export const ProjectKeys = {
  all: ["projects"] as const,
  lists: () => [...ProjectKeys.all, "lists"] as const,
  detail: (projectId: string) =>
    [...ProjectKeys.all, "detail", projectId] as const,
};
