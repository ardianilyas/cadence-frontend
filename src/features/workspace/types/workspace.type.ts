export type Workspace = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    workspaceMembers: number;
  };
}

export type GetWorkspaceResponse = {
  success: boolean;
  message: string;
  data: Workspace[];
}

export type CreateWorkspaceResponse = {
  success: boolean;
  message: string;
  data: Workspace;
}

export type UpdateWorkspaceResponse = CreateWorkspaceResponse;