"use client";

import { useState, useRef } from "react";
import {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/features/task/types/task.type";
import { formatDate } from "@/lib/format-date";
import {
  Calendar,
  CheckCircle2,
  Flag,
  MoreHorizontal,
  Trash2,
  User,
  ArrowRightCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateTaskStatus } from "@/features/task/hooks/use-update-task-status";
import { DeleteTaskDialog } from "./delete-task-dialog";

// ─── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; dot: string; pill: string }
> = {
  TODO: {
    label: "Not Started",
    dot: "bg-slate-400 dark:bg-slate-500",
    pill: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-blue-500",
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40",
  },
  DONE: {
    label: "Complete",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40",
  },
};

// ─── Priority config ─────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; pill: string; dot: string }
> = {
  LOW: {
    label: "Low",
    dot: "bg-slate-400",
    pill: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40",
  },
  HIGH: {
    label: "High",
    dot: "bg-orange-500",
    pill: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/40",
  },
  URGENT: {
    label: "Urgent",
    dot: "bg-rose-500 animate-pulse",
    pill: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 font-semibold",
  },
};

// ─── Card Component ──────────────────────────────────────────────────────────

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const pendingAction = useRef<"delete" | null>(null);

  const updateStatus = useUpdateTaskStatus(task.projectId);

  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority as TaskPriority] ?? {
    label: task.priority,
    dot: "bg-slate-400",
    pill: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };

  const isOverdue =
    task.dueDate &&
    task.status !== "DONE" &&
    new Date(task.dueDate) < new Date();

  return (
    <>
      <div className="group relative rounded-xl bg-card border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-border transition-all duration-150 cursor-grab active:cursor-grabbing">
        <div className="p-3.5 space-y-2.5">
          {/* Header Row: Status tag & Actions dropdown */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none tracking-tight",
                status.pill,
              )}
            >
              <span
                className={cn("size-1.5 rounded-full shrink-0", status.dot)}
              />
              {status.label}
            </span>

            {/* Action Menu (stops pointer drag so clicking dropdown works smoothly) */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu
                onOpenChangeComplete={(open) => {
                  if (!open && pendingAction.current === "delete") {
                    pendingAction.current = null;
                    setDeleteOpen(true);
                  }
                }}
              >
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-foreground outline-none"
                      aria-label="Task options"
                    >
                      <MoreHorizontal className="size-3.5" />
                    </button>
                  }
                />

                <DropdownMenuContent align="end" className="w-44 text-xs">
                  {task.status !== "TODO" && (
                    <DropdownMenuItem
                      onClick={() =>
                        updateStatus.mutate({
                          projectId: task.projectId,
                          taskId: task.id,
                          status: "TODO",
                        })
                      }
                    >
                      <ArrowRightCircle className="mr-2 size-3.5 text-muted-foreground" />
                      Move to To Do
                    </DropdownMenuItem>
                  )}
                  {task.status !== "IN_PROGRESS" && (
                    <DropdownMenuItem
                      onClick={() =>
                        updateStatus.mutate({
                          projectId: task.projectId,
                          taskId: task.id,
                          status: "IN_PROGRESS",
                        })
                      }
                    >
                      <ArrowRightCircle className="mr-2 size-3.5 text-blue-500" />
                      Move to In Progress
                    </DropdownMenuItem>
                  )}
                  {task.status !== "DONE" && (
                    <DropdownMenuItem
                      onClick={() =>
                        updateStatus.mutate({
                          projectId: task.projectId,
                          taskId: task.id,
                          status: "DONE",
                        })
                      }
                    >
                      <CheckCircle2 className="mr-2 size-3.5 text-emerald-500" />
                      Move to Done
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      pendingAction.current = "delete";
                    }}
                  >
                    <Trash2 className="mr-2 size-3.5" />
                    Delete task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-1">
            <h4 className="text-[14px] font-medium leading-snug text-foreground tracking-tight line-clamp-2">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Assignee Row */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-[11px] text-muted-foreground">Assignee</span>
            {task.assignee ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 border border-border/40 text-[11px] font-medium text-foreground max-w-[160px]">
                <User className="size-3 text-muted-foreground shrink-0" />
                <span className="truncate">{task.assignee.name}</span>
              </div>
            ) : (
              <span className="text-[11px] text-muted-foreground/60 italic">
                Unassigned
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Footer Row: Due date & Priority pill */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Due date / Completion status */}
            {task.status === "DONE" && task.completedAt ? (
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="size-3 shrink-0" />
                <span>{formatDate(task.completedAt)}</span>
              </div>
            ) : task.dueDate ? (
              <div
                className={cn(
                  "flex items-center gap-1 text-[11px]",
                  isOverdue
                    ? "text-rose-600 dark:text-rose-400 font-semibold"
                    : "text-muted-foreground",
                )}
              >
                {isOverdue ? (
                  <Flag className="size-3 shrink-0" />
                ) : (
                  <Calendar className="size-3 shrink-0" />
                )}
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue && <span className="text-[10px]">(Overdue)</span>}
              </div>
            ) : (
              <span className="text-[11px] text-muted-foreground/50">
                No due date
              </span>
            )}

            {/* Priority tag */}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium leading-none",
                priority.pill,
              )}
            >
              <span
                className={cn("size-1 rounded-full shrink-0", priority.dot)}
              />
              {priority.label}
            </span>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog outside dropdown */}
      <DeleteTaskDialog
        projectId={task.projectId}
        taskId={task.id}
        taskTitle={task.title}
        open={deleteOpen}
        onOpenChangeAction={setDeleteOpen}
      />
    </>
  );
}
