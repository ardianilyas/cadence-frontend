import { z } from "zod";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(30, { message: "Title must be at most 30 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" })
    .max(200, { message: "Description must be at most 200 characters" }),
  status: z.enum(TaskStatus, { message: "Please select a status" }),
  priority: z.enum(TaskPriority, { message: "Please select a priority" }),
  dueDate: z
    .date()
    .min(new Date(), { message: "Due date must be in the future" })
    .optional(),
  projectId: z.uuid({ message: "Invalid project ID" }),
  assigneeId: z.string().min(1, { message: "Please select an assignee" }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
