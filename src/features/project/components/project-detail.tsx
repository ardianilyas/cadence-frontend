"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGetTasksByProjectId } from "@/features/task/hooks/use-get-tasks-by-project-id";
import { KanbanBoard } from "@/features/task/components/kanban-board";
import { AddTask } from "@/features/task/components/add-task";
import { useGetProjectById } from "@/features/project/hooks/use-get-project-by-id";
import { useWorkspace } from "@/features/workspace/hooks/use-get-workspace";
import { useGetWorkspaceMembers } from "@/features/workspace/hooks/use-get-workspace-members";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge } from "@/components/project-status-badge";
import { formatDate } from "@/lib/format-date";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  Clock,
  FolderX,
  ListTodo,
  Search,
  X,
} from "lucide-react";
import { ProjectDetailSkeleton } from "./project-detail-skeleton";

type ProjectDetailProps = {
  projectId: string;
  workspaceId: string;
};

export function ProjectDetail({ projectId, workspaceId }: ProjectDetailProps) {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError,
    refetch,
  } = useGetTasksByProjectId(projectId);
  const { data: project, isLoading: projectLoading } = useGetProjectById(
    workspaceId,
    projectId,
  );
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: workspaceMembers } = useGetWorkspaceMembers(workspaceId);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");

  // Metrics computation
  const metrics = useMemo(() => {
    const all = tasks || [];
    const total = all.length;
    const todo = all.filter((t) => t.status === "TODO").length;
    const inProgress = all.filter((t) => t.status === "IN_PROGRESS").length;
    const done = all.filter((t) => t.status === "DONE").length;
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, todo, inProgress, done, progressPercent };
  }, [tasks]);

  // Filtered tasks computation
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description
          ?.toLowerCase()
          .includes(query);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Priority filter
      if (priorityFilter !== "ALL" && task.priority !== priorityFilter) {
        return false;
      }

      // Assignee filter
      if (assigneeFilter === "UNASSIGNED" && task.assigneeId) {
        return false;
      }
      if (
        assigneeFilter !== "ALL" &&
        assigneeFilter !== "UNASSIGNED" &&
        task.assigneeId !== assigneeFilter
      ) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, priorityFilter, assigneeFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    priorityFilter !== "ALL" ||
    assigneeFilter !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("ALL");
    setAssigneeFilter("ALL");
  };

  if (tasksLoading || projectLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-5 text-destructive">
              <FolderX className="size-10" />
            </div>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Failed to load tasks
            </h2>
            <p className="text-sm text-muted-foreground">
              There was an error loading the project tasks. Please check your
              connection and try again.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => refetch()} variant="outline">
              Try again
            </Button>
            <Link href={`/dashboard/workspaces/${workspaceId}`}>
              <Button variant="ghost">
                <ArrowLeft className="mr-2 size-4" />
                Back to workspace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb Navigation ── */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard/workspaces">Workspaces</Link>}
            />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link href={`/dashboard/workspaces/${workspaceId}`}>
                  {workspace?.name || "Workspace"}
                </Link>
              }
            />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project?.name || "Project"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* ── Project Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-border/60">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/dashboard/workspaces/${workspaceId}`}>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 -ml-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
              </Button>
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {project?.name || "Project Tasks"}
            </h1>

            {project?.status && (
              <ProjectStatusBadge status={project.status as any} />
            )}
          </div>

          {project?.description && (
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed pl-8">
              {project.description}
            </p>
          )}

          {/* Metadata badges (dates, etc.) */}
          {(project?.startDate || project?.dueDate) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground pl-8 pt-1">
              {project.startDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>Start: {formatDate(project.startDate)}</span>
                </span>
              )}
              {project.dueDate && (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>Due: {formatDate(project.dueDate)}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <AddTask
            projectId={projectId}
            workspaceMembers={workspaceMembers || []}
          />
        </div>
      </div>

      {/* ── Metrics Summary Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Tasks Card */}
        <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Tasks</span>
            <ListTodo className="size-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {metrics.total}
            </span>
            <span className="text-xs text-muted-foreground">
              {metrics.progressPercent}% done
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${metrics.progressPercent}%` }}
            />
          </div>
        </div>

        {/* To Do Card */}
        <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">To Do</span>
            <CircleDashed className="size-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {metrics.todo}
          </span>
          <p className="text-[11px] text-muted-foreground">Pending execution</p>
        </div>

        {/* In Progress Card */}
        <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">In Progress</span>
            <CircleDot className="size-4 text-blue-500" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {metrics.inProgress}
          </span>
          <p className="text-[11px] text-muted-foreground">Actively underway</p>
        </div>

        {/* Done Card */}
        <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {metrics.done}
          </span>
          <p className="text-[11px] text-muted-foreground">Delivered tasks</p>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 h-9 text-xs w-full bg-background"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Priority filter */}
          <Select
            value={priorityFilter}
            onValueChange={(val) => setPriorityFilter(val ?? "ALL")}
          >
            <SelectTrigger className="h-9 text-xs w-full sm:w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Assignee filter */}
          <Select
            value={assigneeFilter}
            onValueChange={(val) => setAssigneeFilter(val ?? "ALL")}
          >
            <SelectTrigger className="h-9 text-xs w-full sm:w-40">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Assignees</SelectItem>
              <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
              {workspaceMembers?.map((member) => (
                <SelectItem key={member.userId} value={member.userId}>
                  {member.user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 size-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ── Empty Filter State ── */}
      {hasActiveFilters && filteredTasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-3 bg-muted/20">
          <p className="text-sm font-medium text-foreground">
            No tasks match your filters
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query, priority, or assignee filter to
            view tasks.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* ── Empty State when no tasks exist at all ── */}
      {(!tasks || tasks.length === 0) && (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-4 bg-muted/20">
          <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ListTodo className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              No tasks in this project
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Get started by creating your first task to track progress and
              assign team members.
            </p>
          </div>
          <AddTask
            projectId={projectId}
            workspaceMembers={workspaceMembers || []}
          />
        </div>
      )}

      {/* ── Kanban Board ── */}
      {tasks &&
        tasks.length > 0 &&
        (!hasActiveFilters || filteredTasks.length > 0) && (
          <KanbanBoard tasks={filteredTasks} projectId={projectId} />
        )}
    </div>
  );
}
