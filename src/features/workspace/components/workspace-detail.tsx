"use client"

import { useWorkspace } from "@/features/workspace/hooks/use-get-workspace";
import WorkspaceMembersTable from "@/features/workspace/components/workspace-members-table";
import AddMember from "@/features/workspace/components/add-member";
import { Button } from "@/components/ui/button";
import { FolderX, ArrowLeft } from "lucide-react";
import Link from "next/link";

type WorkspaceDetailProps = {
  workspaceId: string;
}

export function WorkspaceDetail({ workspaceId }: WorkspaceDetailProps) {
  const { data: workspace, isPending, isError, refetch } = useWorkspace(workspaceId);

  if (isPending) {
    return (
      <div>Loading...</div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <FolderX className="size-12 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Workspace not found</h2>
            <p className="text-muted-foreground">
              The workspace you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => refetch()} variant="outline">
              Try again
            </Button>
            <Link href="/dashboard/workspaces">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 size-4" />
                Back to workspaces
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {workspace.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {workspace.description || "No description provided."}
        </p>
      </div>

      {workspace.workspaceMembers?.length && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Members
            </h2>
            <AddMember workspaceId={workspaceId} />
          </div>
          <WorkspaceMembersTable workspaceId={workspaceId} workspaceMembers={workspace.workspaceMembers} />
        </div>
      )}

    </div>
  )
}