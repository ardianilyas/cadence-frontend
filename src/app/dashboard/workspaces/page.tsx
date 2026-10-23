import { WorkspaceList } from "@/features/workspace/components/workspace-list";
import { CreateWorkspaceDialog } from "@/features/workspace/components/create-workspace-dialog";

export default function WorkspacePage() {
  return (
    <div>
      <h1 className="font-medium text-xl">Workspaces</h1>
      <p className="text-muted-foreground mb-2">
        Manage and access your workspaces.
      </p>

      <div className="mb-4 flex justify-end">
        <CreateWorkspaceDialog />
      </div>

      <WorkspaceList />
    </div>
  );
}
