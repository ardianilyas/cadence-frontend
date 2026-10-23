"use client";

import { useGetProjectsByWorkspaceId } from "@/features/project/hooks/use-get-workspace-by-id";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderX, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddProject } from "@/features/project/components/add-project";
import { ProjectsTable } from "@/features/project/components/projects-table";

type ProjectsListProps = {
  workspaceId: string;
};

export function ProjectsList({ workspaceId }: ProjectsListProps) {
  const {
    data: projects,
    isLoading,
    isError,
    refetch,
  } = useGetProjectsByWorkspaceId(workspaceId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="rounded-md border p-2">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
        </div>
        <Card size="sm">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <FolderX className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Failed to load projects
            </p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 size-3.5" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <AddProject workspaceId={workspaceId} />
        </div>
        <Card size="sm">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No projects yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first project to get started
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
        <AddProject workspaceId={workspaceId} />
      </div>
      <div className="rounded-md border p-2">
        <ProjectsTable projects={projects} workspaceId={workspaceId} />
      </div>
    </div>
  );
}
