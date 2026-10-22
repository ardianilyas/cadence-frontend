import { z } from "zod";

export enum ProjectStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  DELAYED = "DELAYED",
  COMPLETED = "COMPLETED",
}

export const createProjectSchema = z.object({
  name: z.string().trim().min(3, { error: "Project name must be at least 3 characters." }).max(50, { error: "Project name must be at most 50 characters." }),
  description: z.string().trim().min(3, { error: "Project description must be at least 3 characters." }).max(200, { error: "Project description must be at most 200 characters." }),
  startDate: z.date({ error: "Start date is required." }),
  dueDate: z.date({ error: "Due date is required." }),
  status: z.enum(ProjectStatus, { error: "Please select a status." }),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().trim().min(3, { error: "Project name must be at least 3 characters." }).max(50, { error: "Project name must be at most 50 characters." }),
  description: z.string().trim().min(3, { error: "Project description must be at least 3 characters." }).max(200, { error: "Project description must be at most 200 characters." }),
  startDate: z.date({ error: "Start date is required." }),
  dueDate: z.date({ error: "Due date is required." }),
  status: z.enum(ProjectStatus, { error: "Please select a status." }),
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
