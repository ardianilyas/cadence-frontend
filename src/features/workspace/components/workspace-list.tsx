"use client";

import { useWorkspaces } from "@/features/workspace/hooks/use-workspaces";
import { WorkspaceListSkeleton } from "@/features/workspace/components/workspace-list-skeleton";
import { Button } from "@/components/ui/button";
import WorkspaceTable from "@/features/workspace/components/workspace-table";

export function WorkspaceList() {
  const {
    data: workspaces,
    isPending,
    isError,
    error,
    refetch,
  } = useWorkspaces();

  if (isPending) {
    return <WorkspaceListSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load workspaces."}
        </p>

        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!workspaces.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="font-medium">No workspaces yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first workspace to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border p-2">
      <WorkspaceTable workspaces={workspaces} />
    </div>
  );
}
