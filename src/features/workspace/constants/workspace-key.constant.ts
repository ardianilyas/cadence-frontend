export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "lists"] as const,
  detail: (workspaceId: string) =>
    [...workspaceKeys.all, "detail", workspaceId] as const,
  availableUsers: (workspaceId: string) =>
    [...workspaceKeys.all, "availableUsers", workspaceId] as const,
  workspaceMembers: (workspaceId: string) =>
    ["workspace-members", workspaceId] as const,
};
