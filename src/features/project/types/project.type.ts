export type Project = {
  id: string;
  name: string;
  description: string;
  authorId: string;
  workspaceId: string;
  status: string;
  startDate: string;
  dueDate: string;
  created_at: string;
  updated_at: string;
}

export type GetProjectsResponse = {
  success: boolean;
  message: string;
  data: Project[];
}
