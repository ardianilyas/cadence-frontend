"use client"

import { useWorkspace } from "@/features/workspace/hooks/use-get-workspace";
import WorkspaceMembersTable from "@/features/workspace/components/workspace-members-table";
import AddMember from "@/features/workspace/components/add-member";

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
      <div className="space-y-3">
        <button
          onClick={() => refetch()}
          className="text-sm underline underline-offset-4"
        >
          Try again
        </button>
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
          <WorkspaceMembersTable workspaceMembers={workspace.workspaceMembers} />
        </div>
      )}

    </div>
  )
}