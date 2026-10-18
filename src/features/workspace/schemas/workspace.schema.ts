import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(3, { error: "Workspace name must be at least 3 characters." }).max(20, { error: "Workspace name must be at most 20 characters." }),
  description: z.string().trim().min(3, { error: "Workspace description must be at least 3 characters." }).max(100, { error: "Workspace description must be at most 100 characters." }),
});
export const updateWorkspaceSchema = createWorkspaceSchema;

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;

export const addMemberSchema = z.object({
  userId: z.string({ error: "Please select a user." }).min(1, { error: "Please select a user." }),
});

export type AddMemberSchema = z.infer<typeof addMemberSchema>;

