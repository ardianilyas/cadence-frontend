import { WorkspaceRole } from "@/features/workspace/schemas/workspace.schema";

export type WorkspaceMember = {
  userId: string;
  role: WorkspaceRole;
  user: {
    id: string;
    name: string;
  };
};

export type Workspace = {
  id: string;
  name: string;
  description: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  workspaceMembers?: WorkspaceMember[];
  _count?: {
    workspaceMembers: number;
  };
};

export type GetWorkspacesResponse = {
  success: boolean;
  message: string;
  data: Workspace[];
};

export type GetWorkspaceResponse = {
  success: boolean;
  message: string;
  data: Workspace;
};

export type CreateWorkspaceResponse = {
  success: boolean;
  message: string;
  data: Workspace;
};

export type UpdateWorkspaceResponse = CreateWorkspaceResponse;

export type AvailableUser = {
  id: string;
  name: string;
  email?: string;
};

export type AddMemberResponse = {
  success: boolean;
  message: string;
  data: WorkspaceMember;
};
